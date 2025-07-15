import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        textAlign: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h1" component="h1" gutterBottom>
        403
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" paragraph>
        You do not have permission to view this page. Please contact the
        administrator if you believe this is a mistake.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button variant="contained" color="primary" component={Link} to="/">
          Go to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
