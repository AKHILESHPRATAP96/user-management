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
} from "@mui/material";

import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import KeyIcon from "@mui/icons-material/Key";

function CreatePassword() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { token } = useParams();
  const nav = useNavigate();
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState("something went wrong");
  const [loading, setloading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

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
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2000);
      return;
    }
    try {
      setloading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/login/resetpassword/${token}`,
        formData
      );

      setSuccess(true);
      localStorage.setItem("token", response.data);
      setloading(false);
      setTimeout(() => {
        nav("/");
      }, 2000);
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

  return (
    <>
      <Grid container>
        <Grid
          item
          xs={12}
          minHeight={"100vh"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Container
            component="main"
            maxWidth="sm"
            sx={{ border: "1px solid rgb(0,0,0,0.1)", borderRadius: 1 }}
          >
            <CssBaseline />

            <Typography
              component="h1"
              variant="h5"
              sx={{ textAlign: "center" }}
            >
              Create Password
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 3, display: "flex", flexDirection: "column", gap: 3 }}
            >
              <TextField
                required
                fullWidth
                id="password"
                label="New Password"
                name="password"
                autoComplete="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                autoFocus
              />
              <TextField
                required
                fullWidth
                id="password"
                label="Confirm Password"
                name="confirmPassword"
                autoComplete="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                type="password"
              />
              <LoadingButton
                startIcon={<KeyIcon />}
                type="submit"
                fullWidth
                variant="contained"
                loading={loading}
                size="large"
              >
                Set Password
              </LoadingButton>
              {success && (
                <Alert severity="success">
                  Your password has been reset successfully
                </Alert>
              )}
              {alert && <Alert severity="error">{error}</Alert>}
            </Box>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}

export default CreatePassword;
