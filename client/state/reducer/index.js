import LoginReducer from "./Login";
import { combineReducers } from "redux";
import { userReducer, userIDReducer, userProfile } from "./userReducer";

const rootReducer = combineReducers({
  loginState: LoginReducer,
  userInfo: userReducer,
  userID: userIDReducer,
  Profile: userProfile,
});

export default rootReducer;
