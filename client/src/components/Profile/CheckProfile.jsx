import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
} from "@mui/material";
import { useSelector } from "react-redux";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import { Stack } from "@mui/joy";

const UserProfile = () => {
  const userDetail = useSelector((state) => state.Profile);

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: "auto",
        mt: 8,

        backgroundColor: "#f5f5f5",
        borderRadius: 2,
      }}
    >
      <Card
        sx={{
          backgroundColor: "#ffffff",
          pt: 3,
          boxShadow: 2,
        }}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            margin: "auto",
            mb: 2,
          }}
        >
          {userDetail.user.gender == "male" ? (
            <AccountCircleIcon sx={{ fontSize: 60 }} />
          ) : (
            <Person3OutlinedIcon sx={{ fontSize: 60 }} />
          )}
        </Avatar>
        <Stack display="flex" flexDirection="column" alignItems="center">
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {userDetail.user.firstName} {userDetail.user.lastName}
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              display="flex"
              alignItems="center"
              gap={1}
              gutterBottom
            >
              <EmailOutlinedIcon />
              Email: {userDetail.user.email}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
              display="flex"
              alignItems="center"
              gap={1}
            >
              <BusinessOutlinedIcon />
              Department:{userDetail.user.department}
            </Typography>
            <Typography
              variant="body1"
              display="flex"
              alignItems="center"
              gap={1}
              color="textSecondary"
            >
              <ManageAccountsOutlinedIcon />
              Role: {userDetail.user.role}
            </Typography>
          </CardContent>
        </Stack>
      </Card>
    </Box>
  );
};

export default UserProfile;
