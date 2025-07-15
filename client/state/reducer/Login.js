import { LOGIN,LOGOUT } from "../../constants/actiontype";

const INIT_STATE = false;

function LoginReducer(state = INIT_STATE, action) {
  switch (action.type) {
    case LOGIN:
      return true;

    case LOGOUT:
      localStorage.removeItem('user');
      return false;

    default:
      return state;
  }
}

export default LoginReducer;
