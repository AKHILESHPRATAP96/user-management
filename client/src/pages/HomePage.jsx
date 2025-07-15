import React, { useState } from "react";
import { Alert, useMediaQuery } from "@mui/material";
import axios from "axios";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import AddParticles from "../components/AddParticles";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { login } from "../../state/action/login";
import LoadingButton from "@mui/lab/LoadingButton";
import { userProfile } from "../../state/action";
import { userDetails, userID } from "../../state/action/user";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import LoginIcon from "@mui/icons-material/Login";
import ForgotPassword from "./ForgotPassword";
import SignUpForm from "./SignUp"


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function HomePage() {
  const [entryForm, setEntryForm] = useState("login");
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function addSpacesBeforeCaps(str) {
    return str.replace(/([A-Z])/g, " $1").trim();
  }

  return (
    <Box
      component="section"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Lato, sans-serif",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: isSmallScreen ? 2 : 4,
        }}
      >
        <AddParticles />
  
        <Typography
          variant={isSmallScreen ? "h2" : "h1"}
          fontWeight={800}
          color={"black"}
          sx={{
            fontSize: isSmallScreen ? 32 : 52,
            fontWeight: 800,
            textTransform: "uppercase",
            mt: 2,
            mb: 2,
          }}
        >
          User Management
        </Typography>
        <Typography variant="body1" color={"black"} mb={3}>
          Welcome to User Management, where innovation meets efficiency
          to revolutionize your company's operations and elevate productivity.
          Our exclusive platform is meticulously crafted to meet your specific
          requirements, ensuring seamless integration and optimal performance
          with a suite of advanced modules designed for versatility.
        </Typography>
        <Button
          variant="contained"
          onClick={handleClickOpen}
          startIcon={<LoginIcon />}
          size="large"
        >
          Login
        </Button>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          maxWidth="sm"
          fullWidth
        >
       <DialogTitle>
  {entryForm === "login" && "Login"}
  {entryForm === "signup" && "Sign Up"}
  {entryForm === "forgotpassword" && "Forgot Password"}
</DialogTitle>

    <DialogContent>
  {entryForm === "login" && (
    <LoginForm entryForm={entryForm} setEntryForm={setEntryForm} />
  )}
  {entryForm === "signup" && (
    <SignUpForm setEntryForm={setEntryForm} />
  )}
  {entryForm === "forgotpassword" && (
    <ForgotPassword entryForm={entryForm} setEntryForm={setEntryForm} />
  )}
</DialogContent>

        </Dialog>
      </Container>
    </Box>
  );
}

export default HomePage;

const LoginForm = ({ entryForm, setEntryForm }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const nav = useNavigate();
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState("something went wrong");
  const [loading, setloading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2000);
      return;
    }
    try {
      setloading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login/signin`,
        formData
      );
      dispatch(userProfile(response.data.user));
      nav("/dashboard");

      dispatch(userID(response.data.SocketId));

      localStorage.setItem("token", response.data.token);
      dispatch(userDetails(response.data.userDetail));
      dispatch(login());
      setloading(false);
    } catch (error) {
      setloading(false);
      setError(
        (await error?.response?.data?.message) || "Something went wrong"
      );
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2000);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const domain = email.split("@")[1];
    return (
      (re.test(String(email).toLowerCase()) &&
        domain === "wikiprospects.com") ||
      (re.test(String(email).toLowerCase()) && domain === "wikiprospects.in") ||
      (re.test(String(email).toLowerCase()) && domain === "url-factory.com")
    );
  };

  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <Grid container justifyContent="center">
      <Container component="main" maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="current-password"
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            loading={loading}
            sx={{ my: 1 }}
            startIcon={<LoginIcon />}
          >
            Enter 
          </LoadingButton>
          {alert && <Alert severity="error">{error}</Alert>}
          <Grid container justifyContent="center" mt={1}>
            <Typography
              variant="caption"
              fontWeight={600}
              onClick={() => setEntryForm("signup")}
              sx={{ cursor: "pointer" }}
            >
              sign up  .
            </Typography>
            <Typography
              variant="caption"
              fontWeight={600}
              onClick={() => setEntryForm("forgotpassword")}
              sx={{ cursor: "pointer" }}
            >
              Forgot Your Password?
            </Typography>
          </Grid>
        </Box>
      </Container>
    </Grid>
  );
};
