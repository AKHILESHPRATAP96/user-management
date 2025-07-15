import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import TaskDetailDialog from "./Task_management/TaskDetailDialog";

const NotificationTable = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userID = useSelector((state) => state.userID);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState(null);


  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/notifications/${userID.user}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const { allNotifications } = response.data;
      setNotifications(allNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userID.user) {
      fetchNotifications();
    }
  }, [userID.user]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const handleNotificationClick = async (notif) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/taskmanagement/${notif.taskId._id}`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedTask(response.data.task);
      handleDialog(true);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  };

  const handleDialog = (value) => {
    setDialogOpen(value);
  };

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <TableContainer sx={{ px: 3 }}>
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          style={{ padding: 12 }}
          fontSize={22}
        >
          Notifications
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Message</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created By</TableCell>

              <TableCell sx={{ fontWeight: "bold" }}>Read</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <TableRow
                  style={{ cursor: "pointer" }}
                  key={notification?._id}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <TableCell>{notification?.message}</TableCell>

                  <TableCell>
                    {notification?.createdBy?.firstName ||
                      notification?.message?.split(" ")[[0]]}
                  </TableCell>

                  <TableCell>{notification.read ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    {new Date(notification.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No Notifications !!</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TaskDetailDialog
        task={selectedTask}
        dialogOpen={dialogOpen}
        handleDialog={handleDialog}
      />
    </>
  );
};

export default NotificationTable;
