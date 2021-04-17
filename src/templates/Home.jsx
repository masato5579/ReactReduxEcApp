import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../reducks/users/operations";
import { getUserId } from "../reducks/users/selectors";
import { getUserName } from "../reducks/users/selectors";

const Home = () => {
  const dispatch = useDispatch();
  //selectorにアクセス
  const selector = useSelector((state) => state);
  //useridを取得
  const uid = getUserId(selector);
  //usernameを取得
  const username = getUserName(selector);
  return (
    <>
      <h2>Home</h2>
      <p>ユーザーID : {uid}</p>
      <p>ユーザー名 : {username} </p>
      <button onClick={() => dispatch(signOut())}>SIGN OUT</button>
    </>
  );
};

export default Home;
