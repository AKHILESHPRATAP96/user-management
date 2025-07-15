import React, { useState } from "react";
import {
  Button,
  TextField,
  InputLabel,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  FormControl,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";

export const UserEdit = () => {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // Handle save logic here
    setOpen(false);
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <CreateIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Make changes to the user details here. Click save when you're done.
          </DialogContentText>
          <div style={{ display: "grid", gap: "16px", paddingTop: "16px" }}>
            <FormControl fullWidth>
              <InputLabel htmlFor="fullName">Full Name</InputLabel>
              <TextField
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter New Name"
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel htmlFor="email">Email ID</InputLabel>
              <TextField
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter New Email ID"
                type="email"
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="department-label">Department</InputLabel>
              <Select
                labelId="department-label"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                fullWidth
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Department 1">Department 1</MenuItem>
                <MenuItem value="Department 2">Department 2</MenuItem>
                <MenuItem value="Department 3">Department 3</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
