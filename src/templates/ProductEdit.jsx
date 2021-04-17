import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { TextInput, SelectBox, PrimaryButton } from "../components/Ulkit/index";
import { saveProducts } from "../reducks/products/operations";
import { ImageArea } from "../components/Products/index";
import { SetSizeArea } from "../components/Products/index";
import { db } from "../firebase";

const ProductEdit = () => {
  //dispatchを利用できるようにする
  const dispatch = useDispatch();

  //現在のいるlocationのpathnameの/product/editの次の文字を取得
  let id = window.location.pathname.split("/product/edit")[1];

  //文字、/product/editの文字がない場合は、末尾に/をいれる
  if (id !== "") {
    id = id.split("/")[1];
  }

  //入力State達
  const [name, setName] = useState(""),
    [description, setDescription] = useState(""),
    [category, setCategory] = useState(""),
    [categories, setCategories] = useState([]),
    [gender, setGender] = useState(""),
    [images, setImages] = useState(""),
    [price, setPrice] = useState(""),
    [sizes, setSizes] = useState("");

  //nameの更新
  const inputName = useCallback(
    (e) => {
      setName(e.target.value);
    },
    [setName]
  );

  //discriptionの更新
  const inputDiscription = useCallback(
    (e) => {
      setDescription(e.target.value);
    },
    [setDescription]
  );

  //priceの更新
  const inputPrice = useCallback(
    (e) => {
      setPrice(e.target.value);
    },
    [setPrice]
  );

  //genderの種類 タブの選択肢
  const genders = [
    { id: "all", name: "全て" },
    { id: "male", name: "メンズ" },
    { id: "female", name: "レディース" },
  ];

  //初回と、idが更新されたときに実行される
  useEffect(() => {
    //もしidがない場合
    if (id !== "") {
      //firestoreのproductsというコレクションのidというdocumentを取得する
      //成功したら、その中の配列のdataを取得し、state達を更新
      db.collection("products")
        .doc(id)
        .get()
        .then((snapshot) => {
          const data = snapshot.data();
          setImages(data.images);
          setName(data.name);
          setDescription(data.descreption);
          setCategory(data.category);
          setGender(data.gender);
          setPrice(data.price);
          setSizes(data.sizes);
        });
    }
  }, [id]);

  useEffect(() => {
    db.collection("categories")
      .orderBy("order", "asc")
      .get()
      .then((snapshots) => {
        const list = [];
        snapshots.forEach((snapshot) => {
          const data = snapshot.data();
          list.push({
            id: data.id,
            name: data.name,
          });
        });
        setCategories(list);
      });
  }, []);

  return (
    <section>
      <h2 className="u-text__headline u-text-center">商品の登録・編集</h2>
      <div className="c-section-container">
        <ImageArea images={images} setImages={setImages} />
        <TextInput
          fullWidth={true}
          label={"商品名"}
          multiline={false}
          required={true}
          onChange={inputName}
          rows={1}
          value={name}
          type={"text"}
        />
        <TextInput
          fullWidth={true}
          label={"商品説明"}
          multiline={true}
          required={true}
          onChange={inputDiscription}
          rows={5}
          value={description}
          type={"text"}
        />
        <SelectBox
          label={"カテゴリー"}
          required={true}
          options={categories}
          select={setCategory}
          value={category}
        />
        <SelectBox
          label={"性別"}
          required={true}
          options={genders}
          select={setGender}
          value={gender}
        />
        <TextInput
          fullWidth={true}
          label={"価格"}
          multiline={false}
          required={true}
          onChange={inputPrice}
          rows={1}
          value={price}
          type={"number"}
        />
        <div className="module-spacer--small"></div>
        <SetSizeArea sizes={sizes} setSizes={setSizes} />
        <div className="module-spacer--small"></div>
        <div className="center">
          <PrimaryButton
            label={"商品情報を追加"}
            onClick={() =>
              dispatch(
                saveProducts(
                  id,
                  name,
                  description,
                  category,
                  gender,
                  price,
                  images,
                  sizes
                )
              )
            }
          />
        </div>
      </div>
    </section>
  );
};

export default ProductEdit;
