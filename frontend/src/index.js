import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import React from "react";
import ReactDOM from "react-dom";
import JqueryMaskPlugin from "jquery-mask-plugin";

import App from "./App";

import { createStore } from "redux";
import reducers from "./reducers/index";
import { Provider } from "react-redux";

const store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);
