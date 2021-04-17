import React, { useCallback } from "react";
import IconButton from "@material-ui/core/IconButton";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import { makeStyles } from "@material-ui/styles";
import { storage } from "../../firebase/index";
import ImagePreview from "./ImagePreview";
const useStyles = makeStyles({
  icon: {
    height: 48,
    width: 48,
  },
});

const ImageArea = (props) => {
  //material-uiのスタイル設定
  const classes = useStyles();

  //画像の削除
  const deleteImage = useCallback(
    async (id) => {
      //confirmの表示
      const ret = window.confirm("この画像を削除しますか？？");
      if (!ret) {
        //もしいいえを選択したら
        return false;
      } else {
        //もしはいを選択したら
        //idにフィルターをかけて選んだ画像以外の画像を取得
        const newImages = props.images.filter((image) => image.id !== id);
        //画像をsetImagesでimagesに格納
        props.setImages(newImages);
        //firebaseから選んだ画像のデータを削除
        return storage.ref("images").child(id).delete();
      }
    },
    [props.images]
  );
  //画像のアップロード
  const uploadImage = useCallback(
    (e) => {
      //file（選んだ画像）を取得
      const file = e.target.files;
      //jpedfileとして格納
      let blob = new Blob(file, { type: "image/jpeg" });

      //ランダムな16文字の作成
      const S =
        "abcdefghijklmnopqrstuvwsyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");

      //uploadRefはstorageのimagesFilesの中に上記ランダムで生成した文字列を格納したもの
      const uploadRef = storage.ref("images").child(fileName);

      //uploadTaskはblobをstorageに格納する定数
      const uploadTask = uploadRef.put(blob);

      //storageの格納がうまくいったら
      uploadTask.then(() => {
        //ダウンロードURLを取得する
        //snapshotはデータに変更があるたびにリアルタイムでアプリケーションにデータを反映できる
        //つまり、今回の場合、uploadTaskに変更があったのでリアルタイム同期
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          //ダウンロードURLの取得がうまくいったら
          const newImage = { id: fileName, path: downloadURL };
          //setImagesでimagesをnewImageに変更
          //prevStateを使うことで、これまでダウンロードしていたimagesの中のデータを消さずに更新
          props.setImages((prevState) => [...prevState, newImage]);
        });
      });
    },
    [props.setImages]
  );

  return (
    <div>
      <div className="p-grid__list-images">
        {props.images.length > 0 &&
          props.images.map((image) => (
            <ImagePreview
              id={image.id}
              path={image.path}
              key={image.id}
              delete={deleteImage}
            />
          ))}
      </div>
      <div className="u-text-right">
        <span>商品画像を登録する</span>
        <IconButton className={classes.icon}>
          <label>
            <AddPhotoAlternateIcon />
            <input
              className="u-display-none"
              type="file"
              id="image"
              onChange={(e) => {
                uploadImage(e);
              }}
            />
          </label>
        </IconButton>
      </div>
    </div>
  );
};

export default ImageArea;
