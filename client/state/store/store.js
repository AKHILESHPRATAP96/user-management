import { applyMiddleware, compose, createStore } from "redux";

import rootReducer from "../reducer";

const store=createStore(rootReducer)

export default store