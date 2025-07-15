import { useTheme } from "@emotion/react";
import { Alert, Box, Container, Grid, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import axios from "axios";

const  SignUpForm = ({ setEntryForm }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
   
  });

  const [alert, setAlert] = useState(false);
  const [error, setError] = useState("Something went wrong");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (event) => {
    event.preventDefault();
 
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      showAlert();
      return;
    }
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/login/signup`, formData);
      setLoading(false);
      setEntryForm("login");
    } catch (err) {
      console.log(err)
      setLoading(false);
      setError(err?.response?.data?.message || "Signup failed");
      showAlert();
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return true;
  };

  const showAlert = () => {
    setAlert(true);
    setTimeout(() => setAlert(false), 2000);
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <Grid container justifyContent="center">
      <Container component="main" maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField fullWidth required name="firstName" label="First Name" value={formData.firstName} onChange={handleChange} />
          <TextField fullWidth required name="lastName" label="Last Name" value={formData.lastName} onChange={handleChange} sx={{ mt: 1 }} />
          <TextField fullWidth required name="email" label="Email Address" value={formData.email} onChange={handleChange} sx={{ mt: 1 }} />
          <TextField fullWidth required type="password" name="password" label="Password" value={formData.password} onChange={handleChange} sx={{ mt: 1 }} />
          <TextField fullWidth required name="gender" label="Gender" value={formData.gender} onChange={handleChange} sx={{ mt: 1 }} />

          <LoadingButton type="submit" fullWidth variant="contained" loading={loading} sx={{ my: 1 }}>
            Sign Up
          </LoadingButton>

          {alert && <Alert severity="error">{error}</Alert>}

          <Grid container justifyContent="center" mt={1}>
            <Typography variant="caption" fontWeight={600} onClick={() => setEntryForm("login")} sx={{ cursor: "pointer" }}>
              Already have an account? Login
            </Typography>
          </Grid>
        </Box>
      </Container>
    </Grid>
  );
};

export default SignUpForm
