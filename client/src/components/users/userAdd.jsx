import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Box,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import PositionedSnackbar from "../Snackbar";
import { useSelector } from "react-redux";

export default function UserAdd() {
  const initialFormData = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
    department: "",
    role: "Employee",
  };

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState(initialFormData);
  const [alert, setAlert] = useState(false);
  const [error, setError] = useState("something went wrong");
  const [isSignup, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Admin, setAdmin] = React.useState(false);
  const profile = useSelector((state) => state.Profile);

  const sendCreatePasswordMail = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/login/createpassword`,
        { email: formData.email },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.log("Error while sending create password mail:", err);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    if (type === "checkbox" && name === "active") {
      setFormData({
        ...formData,
        active: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateFormData = () => {
    return (
      formData?.firstName?.trim() !== "" &&
      formData?.email?.trim() !== "" &&
      formData?.department?.trim() !== "" &&
      formData?.role?.trim() !== "" &&
      formData?.gender?.trim() !== ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFormData()) {
      setError("Enter all values");
      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2000);
      return;
    }
    try {
      setLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login/signup`,
        formData,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setLoading(false);
      if (response.status === 201) {
        // Fixed response status check
        sendCreatePasswordMail();
        setFormData(initialFormData);
        setIsSignUp(true);
        setTimeout(() => {
          setIsSignUp(false);
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message || "Something went wrong");

      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (profile.user.role === "Admin") {
      setAdmin(true);
    }
  }, []);
  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        display="flex"
        flexDirection="column"
        gap={2}
        width={500}
        my={2}
      >
        {isSignup && (
          <PositionedSnackbar message={"Successfully Registered "} />
        )}
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          fullWidth
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email ID"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          fullWidth
          required
          sx={{ mb: 2 }}
        />

        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup
            row
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="male" control={<Radio />} label="Male" />
          </RadioGroup>
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="department-label">Department</InputLabel>
          <Select
            labelId="department-label"
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            renderValue={(selected) => selected.toString()}
          >
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="Sales Team">Sales Team</MenuItem>
            <MenuItem value="Marketing">Marketing</MenuItem>
            <MenuItem value="Management">Management</MenuItem>
            <MenuItem value="Lead Generation">Lead Generation</MenuItem>
            <MenuItem value="Operations Team">Operations Team</MenuItem>
            <MenuItem value="Human Resources">Human Resources</MenuItem>
            <MenuItem value="Sales Support Team">Sales Support Team</MenuItem>
          </Select>
        </FormControl>

        {(Admin || profile.user.department == "IT") && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="Role-label">Role</InputLabel>
            <Select
              labelId="Role-label"
              id="Role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              renderValue={(selected) => selected}
            >
              {Admin && <MenuItem value="Admin">Admin</MenuItem>}
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Team Lead">Team Lead</MenuItem>
              <MenuItem value="Team Manager">Team Manager</MenuItem>
            </Select>
          </FormControl>
        )}

        <LoadingButton
          loading={loading} // Ensure loading prop is used
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Add User
        </LoadingButton>
      </Box>
      {alert && (
        <Alert
          sx={{ position: "absolute", top: 0, width: 500 }}
          severity="error"
        >
          {error}
        </Alert>
      )}
    </>
  );
}
