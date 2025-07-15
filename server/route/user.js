const express = require("express");
const {
  signIn,
  signUp,
  forgetPassword,
  resetPassword,
  getusers,
  updateUserIsActive,
  editUser,
  createPassword,
} = require("../controllers/authController");
const authenticateToken = require("../middleware/authenticatication");

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/forgotpassword", forgetPassword);
router.post("/createpassword", createPassword);
router.patch("/resetpassword/:token", resetPassword);
router.get("/users", authenticateToken, getusers);
router.patch("/status", updateUserIsActive);
router.put("/edit", editUser);

module.exports = router;
