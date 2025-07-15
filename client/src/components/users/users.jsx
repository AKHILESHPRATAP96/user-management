import React, { useEffect, useState, useRef } from "react";
import Button from "@mui/material/Button";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogContentText,
  Alert,
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

import UserAdd from "./userAdd";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import MailOutlineOutlinedIcon from "@mui/icons-material/MailOutlineOutlined";
import PositionedSnackbar from "../Snackbar";

const token = localStorage.getItem("token");

const UsersList = () => {
  const [USERSDATA, setUSERSDATA] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isShowing, setIsShowing] = useState(false);
  const [archiveUserId, setArchiveUserId] = useState(null);
  const [alert, setAlert] = useState(false);
  const [mailLoading, setmailLoading] = useState(false);
  const [isSignup, setIsSignUp] = useState(false);

  const wrapperRef = useRef(null);
  const token = localStorage.getItem("token");
  const [loadingUserId, setLoadingUserId] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsShowing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const fetchUsers = async () => {
    if (!token) {
      setError("User is not authenticated");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/login/users`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      setUSERSDATA(response.data);
    } catch (err) {
      setError("Error loading user data");
      console.error("Error fetching users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClickOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
  };

  const handleCloseArchive = () => {
    setIsShowing(false);
  };

  const handleDisable = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/login/status`, {
        id: archiveUserId,
        isActive: false,
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
    setIsShowing(false);
  };

  const handleEnable = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/login/status`, {
        id: archiveUserId,
        isActive: true,
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
    setIsShowing(false);
  };

  const handleArchive = (id) => {
    setArchiveUserId(id);
    setIsShowing(true);
  };
  const handleResendPassword = async (user) => {
    setSelectedUser(user);

    try {
      setLoadingUserId(user._id);
      setmailLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/login/createpassword`,
        { email: selectedUser?.email },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setmailLoading(false);

      setIsSignUp(true);
      setTimeout(() => {
        setIsSignUp(false);
      }, 2000);
    } catch (error) {
      setmailLoading(false);

      setAlert(true);
      setTimeout(() => {
        setAlert(false);
      }, 2000);
    } finally {
      setmailLoading(false);
      setLoadingUserId(null);
    }
  };

  const columns = [
    // { field: "_id", headerName: "User ID", width: 100 },
    { field: "fullName", headerName: "Full Name", width: 150, editable: false },
    { field: "email", headerName: "Email", width: 200, editable: false },
 
    {
      field: "role",
      headerName: "Role",
      width: 100,
      editable: false,
      valueGetter: (params) => params,
    },
    {
      field: "isActive",
      headerName: "Active",
      width: 100,
      editable: false,
      valueGetter: (params) => (params ? "Enabled" : "Disabled"),
    },
    {
      field: "actions",
      headerName: "Edit/Archive",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleClickOpen(params.row)}>
            <EditOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => handleArchive(params.id)}>
            <ArchiveOutlinedIcon />
          </IconButton>
        </>
      ),
    },
    {
      field: "mail",
      headerName: "Resend ",
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleResendPassword(params.row)}>
            {loadingUserId === params.row._id ? (
              <CircularProgress size={24} />
            ) : (
              <MailOutlineOutlinedIcon />
            )}
          </IconButton>
        </>
      ),
    },
  ];

  const rows = USERSDATA?.users?.map((user) => ({
    id: user?.id,
    _id: user?._id,
    fullName: `${user?.firstName} ${user?.lastName}`,
    email: user?.email,
    department: user?.department,

    isActive: user?.isActive,
    gender: user?.gender,
    role: user?.role,
  }));
  console.log(USERSDATA.users)

  return (
    <>
      {isSignup && <PositionedSnackbar message={"Email send successfully "} />}
      <Box component="section" sx={{ p: 2 }}>
        <Box
          component="section"
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            startIcon={<PersonAddAltIcon />}
            sx={{ marginLeft: 1 }}
            onClick={() => setOpenAdd(true)}
          >
            Add New User
          </Button>
        </Box>
        <Box sx={{ width: "100%", marginTop: 1, marginBottom: 2 }}>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            <DataGrid
              autoHeight={true}
              autosizeOnMount
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 10,
                  },
                },
              }}
              pageSizeOptions={[10]}
              disableRowSelectionOnClick
            />
          )}
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <EditUser
              selectedUser={selectedUser}
              fetchUsers={fetchUsers}
              handleClose={handleClose}
            />
          </DialogContent>
        </Dialog>
      </Box>
      <Dialog open={openAdd} onClose={handleCloseAdd}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <UserAdd />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isShowing}
        onClose={handleCloseArchive}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"User Status"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You can enable or disable the user here. This action will not delete
            the user from the database.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisable} color="primary" variant="outlined">
            Disable
          </Button>
          <Button
            onClick={handleEnable}
            color="primary"
            autoFocus
            variant="contained"
          >
            Enable
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UsersList;

function EditUser({ selectedUser, fetchUsers, handleClose }) {
  const [formData, setFormData] = useState({
    email: selectedUser?.email,
    password: selectedUser?.password,
    firstName: selectedUser?.fullName?.split(" ")[0],
    lastName: selectedUser?.fullName?.split(" ")[1],
    gender: selectedUser?.gender,
    department: selectedUser?.department,
    role: selectedUser?.role,
    id: selectedUser?._id,
  });

  const [Admin, setAdmin] = React.useState(false);
  const profile = useSelector((state) => state.Profile);

  useEffect(() => {
    setFormData({
      email: selectedUser?.email,
      password: selectedUser?.password,
      firstName: selectedUser?.fullName?.split(" ")[0],
      lastName: selectedUser?.fullName?.split(" ")[1],
      gender: selectedUser?.gender,
      department: selectedUser?.department,
      role: selectedUser?.role,
      id: selectedUser?._id,
    });
  }, [selectedUser]);

  useEffect(() => {
    if (profile.user.role === "Admin") {
      setAdmin(true);
    }
  }, []);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/login/edit`,
        {
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          gender: formData.gender,
          department: formData.department,
          role: formData.role,
          id: formData.id,
        },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      fetchUsers(); // Refresh the user list after the update
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        autoFocus
        margin="dense"
        id="email"
        name="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
        fullWidth
        required
      />

      <TextField
        margin="dense"
        id="firstName"
        name="firstName"
        label="First Name"
        type="text"
        value={formData.firstName}
        onChange={handleInputChange}
        fullWidth
        required
      />
      <TextField
        margin="dense"
        id="lastName"
        name="lastName"
        label="Last Name"
        type="text"
        value={formData.lastName}
        onChange={handleInputChange}
        fullWidth
        required
      />
      <FormControl component="fieldset" margin="dense" fullWidth required>
        <FormLabel component="legend">Gender</FormLabel>
        <RadioGroup
          aria-label="gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
      </FormControl>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="department-label">Department</InputLabel>
        <Select
          labelId="department-label"
          id="department"
          name="department"
          value={formData.department}
          onChange={handleInputChange}
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
        <FormControl fullWidth required margin="dense">
          <InputLabel id="role-label">Role</InputLabel>
          <Select
            labelId="role-label"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
          >
            {Admin && <MenuItem value="Admin">Admin</MenuItem>}
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Team Lead">Team Lead</MenuItem>
            <MenuItem value="Team Manager">Team Manager</MenuItem>
          </Select>
        </FormControl>
      )}
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          color="primary"
          variant="contained"
          loading={false}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </form>
  );
}
