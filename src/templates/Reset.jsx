import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { TextInput } from "../components/Ulkit/index";
import { PrimaryButton } from "../components/Ulkit/index";
import { resetPassword } from "../reducks/users/operations";
import { push } from "connected-react-router";

const Reset = () => {
  //dispatchを使用できるように
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  //emailの更新
  const inputEmail = useCallback(
    (e) => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  return (
    <div className="c-section-container">
      <h2 className="u-text__headline u-text-center">パスワードのリセット</h2>
      <div className="module-spacer--medium" />

      <TextInput
        fullWidth={true}
        label={"メールアドレス"}
        mulutiline={false}
        required={true}
        rows={1}
        value={email}
        type={"email"}
        onChange={inputEmail}
      />

      <div className="module-spacer--medium" />
      <div className="center">
        <PrimaryButton
          label={"リセットパスワード"}
          onClick={() => dispatch(resetPassword(email))}
        />
      </div>
      <div className="module-spacer--medium" />
      <p onClick={() => dispatch(push("/signin"))}>ログイン画面に戻る</p>
    </div>
  );
};

export default Reset;
