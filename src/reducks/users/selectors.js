import { createSelector } from "reselect";

//usersの情報取得
const usersSelector = (state) => state.users;

export const getIsSignedIn = createSelector(
  [usersSelector],
  (state) => state.isSignedIn
);

export const getOrdersHistory = createSelector(
  [usersSelector],
  (state) => state.orders
);

export const getProductsInCart = createSelector(
  [usersSelector],
  (state) => state.cart
);

//uidの取得関数
export const getUserId = createSelector([usersSelector], (state) => state.uid);

//usernameの取得関数
export const getUserName = createSelector(
  [usersSelector],
  (state) => state.username
);
