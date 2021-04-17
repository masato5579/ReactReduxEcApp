import { FirebaseTimestamp, db } from "../../firebase";
import { push } from "connected-react-router";
import { deleteProductsAction, fetchProductsAction } from "./actions";

//dbのコレクション
const productsRef = db.collection("products");

export const deleteProduct = (id) => {
  return async (dispatch, getState) => {
    productsRef
      .doc(id)
      .delete()
      .then(() => {
        const prevProducts = getState().products.list;
        const nextProducts = prevProducts.filter(
          (product) => product.id !== id
        );
        dispatch(deleteProductsAction(nextProducts));
      });
  };
};

export const fetchProducts = (gender, category) => {
  return async (dispatch) => {
    let query = productsRef.orderBy("updated_at", "desc");
    query = gender !== "" ? query.where("gender", "==", gender) : query;
    query = category !== "" ? query.where("category", "==", category) : query;

    query.get().then((snapshots) => {
      const productList = [];
      snapshots.forEach((snapshot) => {
        const product = snapshot.data();
        productList.push(product);
      });
      dispatch(fetchProductsAction(productList));
    });
  };
};

export const orderProduct = (productInCart, amount) => {
  return async (dispatch, getState) => {
    const uid = getState().users.uid;
    const userRef = db.collection("users").doc(uid);
    const timestamp = FirebaseTimestamp.now();

    let products = [],
      soldOutProducts = [];

    const batch = db.batch();

    for (const product of productInCart) {
      const snapshot = await productsRef.doc(product.productId).get();
      const sizes = snapshot.data().sizes;

      const updatetedSizes = sizes.map((size) => {
        if (size.size === product.size) {
          if (size.quantity === 0) {
            soldOutProducts.push(product.name);
            return size;
          }
          return { size: size.size, quantity: size.quantity - 1 };
        } else {
          return size;
        }
      });
      products.push({
        id: product.productId,
        images: product.images,
        name: product.name,
        price: product.price,
        size: product.size,
      });

      batch.update(productsRef.doc(product.productId), {
        sizes: updatetedSizes,
      });

      batch.delete(userRef.collection("cart").doc(product.cartId));
    }

    if (soldOutProducts.length > 0) {
      const errorMessage =
        soldOutProducts.length > 1
          ? soldOutProducts.join("と")
          : soldOutProducts[0];

      alert(
        "大変申し訳ございません。" +
          errorMessage +
          "が在庫切れとなったため、処理を中断しました。"
      );
      return false;
    } else {
      batch
        .commit()
        .then(() => {
          const orderRef = userRef.collection("orders").doc();
          const date = timestamp.toDate();
          const shippingDate = FirebaseTimestamp.fromDate(
            new Date(date.setDate(date.getDate() + 3))
          );

          const history = {
            amount: amount,
            created_at: timestamp,
            id: orderRef.id,
            products: products,
            shipping_date: shippingDate,
            updated_at: timestamp,
          };

          orderRef.set(history);
          dispatch(push("order/complate"));
        })
        .catch(() => {
          alert("注文処理が失敗しました。");
          return false;
        });
    }
  };
};

export const saveProducts = (
  id,
  name,
  descreption,
  category,
  gender,
  price,
  images,
  sizes
) => {
  return async (dispatch) => {
    //timeStampの作成
    const timeStamp = FirebaseTimestamp.now();

    //保存するdata
    const data = {
      category: category,
      descreption: descreption,
      gender: gender,
      images: images,
      name: name,
      price: parseInt(price),
      sizes: sizes,
      updated_at: timeStamp,
    };

    if (id === "") {
      //参照する場所
      const ref = productsRef.doc();

      //productsRefのid
      id = ref.id;

      //dataにidを追加
      data.id = id;
      //dataに作成日時を追加
      data.created_at = timeStamp;
    }

    //databease productsRefコレクションに上記データを格納
    return productsRef
      .doc(id)
      .set(data, { merge: true })
      .then(() => {
        dispatch(push("/"));
      })
      .catch((error) => {
        throw new Error(error);
      });
  };
};
