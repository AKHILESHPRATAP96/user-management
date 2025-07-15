import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { Link } from "react-router-dom";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const secondaryListItems = (
  <React.Fragment>
    <Link to="/profile" style={{ color: "#000", textDecoration: "none" }}>
      <ListItemButton
        sx={location.pathname === "/profile" ? { bgcolor: "#e3e3e3" } : {}}
      >
        <ListItemIcon>
          <AccountCircleOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="View Profile" />
      </ListItemButton>
    </Link>
    <Link to="/notifications" style={{ color: "#000", textDecoration: "none" }}>
      <ListItemButton
        sx={
          location.pathname === "/notifications" ? { bgcolor: "#e3e3e3" } : {}
        }
      >
        <ListItemIcon>
          <NotificationsNoneOutlinedIcon />
        </ListItemIcon>
        <ListItemText primary="Notifications" />
      </ListItemButton>
    </Link>
  </React.Fragment>
);

export { secondaryListItems };
