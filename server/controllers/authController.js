const User = require("../models/User");
const bcrypt = require("bcrypt");

const createPasswordEmail = require("../utils/createPasswordEmail");
const crypto = require("crypto");

const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, gender } =
      req.body;

    if (!email || !firstName || !gender ) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      role,
      
      gender,
    });

    const token = user.generateToken();

    res
      .status(201)
      .json({ message: "Signup successful", token, userId: user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & Password are required" });

    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isActive)
      return res.status(400).json({ message: "User is inactive" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = user.generateToken();

    res.status(200).json({
      token,
      userDetail: user,
      user: user.firstName,
      email: user.email,
      SocketId: user.id,
      Admin: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = user.createResetPasswordToken();
    await user.save();

    const resetUrl = `${process.env.CLIENTAPI}/resetpassword/${resetToken}`;
    const message = `<p>Hi ${user.firstName}, use this link to reset your password: <a href="${resetUrl}">Reset Password</a></p>`;

    await createPasswordEmail({
      to: email,
      subject: "Reset Password",
      html: message,
    });

    res.status(200).json({ message: "Reset password link sent" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const resetToken = user.createResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENTAPI}/createpassword/${resetToken}`;
    const message = `<p><b>Hi ${user.firstName}</b>. <br><br>Welcome to User Management!
     You have been registered on User Management by the admin. 
     Kindly click on the link to activate your account and set the password.<br><br>
     <a href="${resetUrl}">Click Here.</a><br><br>This token will expire in 15 minutes.
     <br><br>Regards<br><b>Wikiprospects</b></p>`;

    try {
      await createPasswordEmail({
        to: email.trim(),
        subject: "Welcome to Wikiprospects | Set Password",
        html: message,
      });

      const updatedData = { isActive: true };
      const id = user._id;
      const activeStatus = await User.findByIdAndUpdate(id, updatedData, {
        new: true,
      });

      res.status(200).json({
        message: "Password reset link has been sent successfully to the user.",
        activeStatus: activeStatus,
      });
    } catch (emailError) {
      // If the email sending fails, you may want to reset the token and save the user again without it
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      res
        .status(500)
        .json({ message: "Failed to send password reset link.", emailError });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetTokenExpire: { [Op.gt]: Date.now() },
      },
    });

    if (!user) return res.status(400).json({ message: "Token expired" });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.passwordResetToken = null;
    user.passwordResetTokenExpire = null;
    await user.save();

    const token = user.generateToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getusers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateUserIsActive = async (req, res) => {
  const { isActive, id } = req.body;
  try {
    await User.update({ isActive }, { where: { id } });
    const updatedUser = await User.findByPk(id);
    res.status(200).json({ message: "User status updated", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const editUser = async (req, res) => {
  try {
    const {
      id,
      email,
      password,
      firstName,
      lastName,
      gender,
      role,
      active,
    } = req.body;

    const updatedData = {
      email,
      firstName,
      lastName,
      gender,
      role,
      isActive: active,
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    await User.update(updatedData, { where: { id } });
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  signIn,
  signUp,
  forgetPassword,
  resetPassword,
  getusers,
  updateUserIsActive,
  editUser,
  createPassword,
};
