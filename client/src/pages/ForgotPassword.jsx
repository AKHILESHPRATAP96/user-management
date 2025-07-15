import React, { useState } from "react";
import {
  Alert,
  useMediaQuery,
  Box,
  Paper,
  Grid,
  Container,
  CssBaseline,
  TextField,
  Avatar,
  Typography,
  Button,
} from "@mui/material";
import {
  styled,
  useTheme,
  createTheme,
  ThemeProvider,
} from "@mui/material/styles";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link } from "react-router-dom";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import img from "../assets/pattern.png";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  borderRadius: "15px",
}));

const defaultTheme = createTheme();

function ForgotPassword({ entryForm, setEntryForm }) {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [alert, setAlert] = useState(false);
  const [error, setError] = useState("something went wrong");
  const [loading, setloading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [disable, setDisable] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateEmail(formData.email)) {
      setError("Invalid email address");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2000);
      return;
    }

    try {
      setloading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login/forgotpassword`,
        formData
      );
      if (response.status == 200) {
        setSuccess(true);
        setDisable(true);
        setloading(false);
      }
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

  return (
    <Container component="main" maxWidth="lg">
      <CssBaseline />

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          autoFocus
        />
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          loading={loading}
          disabled={disable}
        >
          Reset Password
        </LoadingButton>
        {success && (
          <Alert severity="success">
            Your reset password has been sent to your email address
          </Alert>
        )}
        {alert && <Alert severity="error">{error}</Alert>}
      </Box>
      <Grid container justifyContent="center" mt={1}>
        <Typography
          variant="caption"
          fontWeight={600}
          onClick={() => setEntryForm("login")}
          style={{ cursor: "pointer" }}
          textAlign="center"
        >
          Login
        </Typography>
      </Grid>
    </Container>
  );
}

export default ForgotPassword;
