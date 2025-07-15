import { USER } from "../../constants/actiontype";
import { ID } from "../../constants/actiontype";
import { PROFILE } from "../../constants/actiontype";

export const userProfile = (user) => ({
  type: USER,
  payload: user,
});

export const userID = (userID) => ({
  type: ID,
  payload: userID,
});

export const userDetails = (userDetail) => ({
  type: PROFILE,
  payload: userDetail,
});
