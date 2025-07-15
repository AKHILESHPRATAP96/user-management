import { ID, USER, PROFILE } from "../../constants/actiontype";

const INIT_STATE = JSON.parse(localStorage.getItem("user")) || null;
const INIT_STATE_ID = JSON.parse(localStorage.getItem("userID")) || null;
const INIT_STATE_PROFILE =
  JSON.parse(localStorage.getItem("UserDetail")) || null;

function userReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case USER:
      const userState = { user: action.payload };
      localStorage.setItem("user", JSON.stringify(userState));
      return userState;
    default:
      return state;
  }
}
function userIDReducer(state = INIT_STATE_ID, action) {
  switch (action.type) {
    case ID:
      const userState = { user: action.payload };
      localStorage.setItem("userID", JSON.stringify(userState));
      return userState;
    default:
      return state;
  }
}

function userProfile(state = INIT_STATE_PROFILE, action) {
  switch (action.type) {
    case PROFILE:
      const userState = { user: action.payload };
      localStorage.setItem("UserDetail", JSON.stringify(userState));
      return userState;
    default:
      return state;
  }
}

export { userReducer, userIDReducer, userProfile };
