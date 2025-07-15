import * as React from "react";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function PositionedSnackbar({ message }) {
  const [state, setState] = React.useState({
    open: true,
    vertical: "bottom",
    horizontal: "left",
  });
  const { vertical, horizontal, open } = state;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      open: false,
    }));
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      autoHideDuration={3000}
      open={open}
      message={message}
      onClose={handleClose}
      key={vertical + horizontal}
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}
