import {
  createStore as reduxCreateStore,
  combineReducers,
  applyMiddleware,
} from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import thunk from "redux-thunk";

//usersの情報
import { UsersReducer } from "../users/reducers";
//productsの情報
import { ProductsReducer } from "../products/reducers";

export default function createStore(history) {
  return reduxCreateStore(
    combineReducers({
      //connectRouter
      router: connectRouter(history),
      //UsersのReducer
      users: UsersReducer,
      //productsのReducer
      products: ProductsReducer,
    }),
    //thunkで非同期処理も可能に
    applyMiddleware(routerMiddleware(history), thunk)
  );
}
