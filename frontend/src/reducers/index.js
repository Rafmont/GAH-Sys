import counterReducer from "./counter";
import loggedReducer from "./isLogged";
import tokenReducer from "./token";
import nameReducer from "./name";
import levelReducer from "./level";
import authReducer from "./auth";
import idReducer from "./id";

import { combineReducers } from "redux";

const reducers = combineReducers({
  counterReducer,
  loggedReducer,
  tokenReducer,
  nameReducer,
  levelReducer,
  authReducer,
  idReducer,
});

export default reducers;
