import * as React from "react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Button, Stack } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../state/action/login";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Modal from "@mui/material/Modal";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

const drawerWidth = 250;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",

  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  height: "50vh",
  width: "50vw",
  overflow: "auto",
  overflowX: "hidden",
  scrollBehavior: "smooth",
};

function getDateTime(isoString) {
  const date = new Date(isoString);

  // Get individual date components
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Month is zero-indexed
  const day = ("0" + date.getDate()).slice(-2);
  let hours = date.getHours();
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);

  // Determine AM or PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert hours to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)

  // Construct the formatted date and time string
  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds} ${ampm}`;
  return formattedDate;
}

export default function Dashboard({ componentName, mode }) {
  const token = localStorage.getItem("token");
  const [open, setOpen] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [Admin, setAdmin] = React.useState(false);
  const [IT, setIT] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [notifications, setNotifications] = React.useState([]);
  const [badge, setBadge] = React.useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [showAll, setShowAll] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleShowAll = () => {
    setShowAll(!showAll);
  };

  const user = useSelector((state) => state.userInfo);
  const userID = useSelector((state) => state.userID);
  const profile = useSelector((state) => state.Profile);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/${userID?.user}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const { allNotifications, unreadNotifications } = response.data;

      const messages = allNotifications.map((notif) => notif);
      const unreadCount = unreadNotifications.length;

      setNotifications(messages);
      setBadge(unreadCount);

      localStorage.setItem("badgeCount", unreadCount.toString());
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/notifications/${userID.user
        }/markAsRead`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      fetchNotifications();
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  React.useEffect(() => {
    const storedBadgeCount = localStorage.getItem("badgeCount");
    if (storedBadgeCount) {
      setBadge(parseInt(storedBadgeCount, 10));
    }

    if (profile.user.role === "Admin" || profile.user.department === "IT") {
      setAdmin(true);
      setIT(true);
    }
    fetchNotifications();
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    localStorage.removeItem("UserDetail");
    localStorage.removeItem("admin");
    dispatch(logout());
    navigate("/");
  };

  const handleClose = () => {
    markNotificationsAsRead();
    setAnchorEl(null);
  };

  const handleBadgeClick = () => {
    setBadge(0);
    localStorage.setItem("badgeCount", "0");
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDialog = (value) => {
    setDialogOpen(value);
  };
  React.useEffect(() => {
    isSmallScreen ? setOpen(false) : setOpen(true);
  }, [isSmallScreen]);

  const handleNotificationClick = async (notif) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/taskmanagement/${notif?.taskId?._id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedTask(response.data?.task);
      handleDialog(true);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };


  const renderNotifications = () => {
    return notifications?.slice(0, 10).map((notif, index) => (
      <div key={index}>
        <MenuItem
          onClick={() => handleNotificationClick(notif)}
          component="li"
          dense
          sx={{
            fontFamily: "Lato",
            py: 0.5,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            "&::before": {
              content: '"•"', // Bullet point symbol
              color: "primary.main", // Use theme primary color or any preferred color
              width: "1.5rem", // Space for bullet
              textAlign: "center",

            },
          }}
        >
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 500 }}>
              {notif.message}
            </Typography>
            <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
              {getDateTime(notif.createdAt)}
            </Typography>
          </div>
        </MenuItem>

        {index < notifications.length - 1 && (
          <Divider variant="fullWidth" sx={{ my: 0.1, borderColor: "divider" }} />
        )}
      </div>
    ));
  };


  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />

      <AppBar position="absolute" open={open}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h1"
            color="inherit"
            noWrap
            fontWeight={500}
            fontSize={30}
            sx={{ flexGrow: 1 }}
          >
            UserManagement
          </Typography>

          <Typography
            variant="h2"
            component="div"
            sx={{
              flexGrow: 1,
              textAlign: "right",
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            {
              location.pathname === "/users"
                ? "Users Management"
                : location.pathname === "/dashboard" ||
                  location.pathname === "/Dashboard"
                  ? "Dashboard"
                  : location.pathname === "/profile"
                    ? "Profile"
                    : location.pathname == "/notifications"
                      ? "Notifications"

                      : location.pathname == "/receiverequest" ? 'Receive request'
                        : "Not Found"}
          </Typography>
          <Stack spacing={4} direction="row" justifyContent={"space-around"}>
            <IconButton color="inherit" onClick={handleMenu}>
              <Badge badgeContent={badge} color="secondary">
                <NotificationsIcon onClick={handleBadgeClick} />
              </Badge>
            </IconButton>

            {/* notifications */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              MenuListProps={{
                sx: {
                  pb: 0,
                },
              }}
            >
              {notifications && notifications.length > 0 ? (
                !showAll && renderNotifications()
              ) : (
                <MenuItem onClick={handleClose} component="li">
                  <Divider sx={{ color: "GrayText" }} variant="fullWidth" />
                  No notifications yet!
                </MenuItem>
              )}
              {!showAll && (
                <MenuItem sx={{ p: 0, my: 0 }}>
                  <Button
                    onClick={() => {
                      navigate("/notifications"), setAnchorEl(null);
                    }}
                    fullWidth
                    color="info"
                    variant="contained"
                    sx={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                  >
                    View all
                  </Button>
                </MenuItem>
              )}
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <Toolbar>
          <ListItemIcon>
            <ChevronLeftIcon onClick={toggleDrawer} />
          </ListItemIcon>
          <Typography
            sx={{ color: "black", fontSize: 17 }}
          >{`Hi ${user?.user}`}</Typography>
        </Toolbar>

        <Divider />
        <List component="nav" sx={{}}>
          {/* main list item */}
          <Link
            to="/Dashboard"
            style={{ color: "#000", textDecoration: "none" }}
          >
            <ListItemButton
              sx={
                location.pathname === "/dashboard" ? { bgcolor: "#e3e3e3" } : {}
              }
            >
              <ListItemIcon>
                <GridViewOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </Link>
        
            <Link to="/users" style={{ color: "#000", textDecoration: "none" }}>
              <ListItemButton
                sx={
                  location.pathname === "/users" ? { bgcolor: "#e3e3e3" } : {}
                }
              >
                <ListItemIcon>
                  <PeopleAltOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="User Management" />
              </ListItemButton>
            </Link>
    








          {/* {mainListItems} */}
          <Divider sx={{ my: 1 }} />
          {/* {secondaryListItems} */}

          <Link to="/profile" style={{ color: "#000", textDecoration: "none" }}>
            <ListItemButton
              sx={
                location.pathname === "/profile" ? { bgcolor: "#e3e3e3" } : {}
              }
            >
              <ListItemIcon>
                <AccountCircleOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="View Profile" />
            </ListItemButton>
          </Link>
          <Link
            to="/notifications"
            style={{ color: "#000", textDecoration: "none" }}
          >
            <ListItemButton
              sx={
                location.pathname === "/notifications"
                  ? { bgcolor: "#e3e3e3" }
                  : {}
              }
            >
              <ListItemIcon>
                <NotificationsNoneOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Notifications" />
            </ListItemButton>
          </Link>

          <Divider />
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Log Out" />
          </ListItemButton>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          overflow: "auto",
          p: 0,
        }}
      >
        <Modal
          open={showAll}
          onClose={() => handleShowAll}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {showAll && renderAllNotifications()}
            {showAll && (
              <Button
                color="inherit"
                variant="text"
                onClick={handleShowAll}
                fullWidth
              >
                View less
              </Button>
            )}
          </Box>
        </Modal>

        <Toolbar />
        <Grid container>
          <Grid item xs={12}>
            {componentName}
          </Grid>
        </Grid>
      </Box>
      {/* Footer */}
      <Box
        component="footer"
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 0,

          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "background.paper",
          color: "text.primary",
          p: 1,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          Copyright © {new Date().getFullYear()} - All Rights Reserved by
          User Management.
        </Typography>
      </Box>

    </Box>
  );
}
