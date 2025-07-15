import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Button, Typography, Container, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";
import useMediaQuery from "@mui/material/useMediaQuery";

const DashboardHome = () => {
  const user = useSelector((state) => state.userInfo);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box textAlign="center">
        <Typography
          variant={isSmallScreen ? "h4" : isMediumScreen ? "h3" : "h2"}
          sx={{ fontWeight: "bold", my: isSmallScreen ? 2 : 4 }}
        >
          Hello, {user.user}
        </Typography>
        <Typography
          variant={isSmallScreen ? "body2" : "body1"}
          sx={{ mb: isSmallScreen ? 2 : 4, px: isSmallScreen ? 1 : 4 }}
        >
          Let's take a closer look at the variety of options that are available
          to you. We have a wide range of choices tailored to meet your specific
          needs and preferences. Whether you're looking for something practical,
          stylish, or innovative, our selection has something for everyone.
          We'll explore each option in detail to ensure you find the perfect fit
          for your requirements and goals. So, let's dive in and discover what
          we have to offer!
        </Typography>
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          sx={{ justifyContent: "center" }}
          gap={isSmallScreen ? 1 : 2}
        >
          <Button
            component={Link}
            to="/profile"
            variant="outlined"
            startIcon={<PersonIcon />}
            size={isSmallScreen ? "small" : "medium"}
            fullWidth={isSmallScreen}
          >
            Check Profile
          </Button>
          <Button
            component={Link}
            to="/notifications"
            variant="outlined"
            startIcon={<NotificationsIcon />}
            size={isSmallScreen ? "small" : "medium"}
            fullWidth={isSmallScreen}
          >
            Check Notifications
          </Button>
          <Button
            component={Link}
            to="/taskboard"
            variant="outlined"
            startIcon={<AssignmentIcon />}
            size={isSmallScreen ? "small" : "medium"}
            fullWidth={isSmallScreen}
          >
            Tasks
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardHome;
