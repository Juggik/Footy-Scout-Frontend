import React from "react";
import { Box, Container, Typography, Link, Stack } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#0b6efd", // same blue vibe as your navbar
        color: "white",
        py: 4,
        mt: 6,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={3}
        >
          {/* Left Section */}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Footy Scouter
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              Your home for football stats, scouting insights, and player analysis.
            </Typography>
          </Box>

          {/* Middle Links */}
          <Stack direction="row" spacing={3}>
            <Link href="#" underline="hover" sx={{ color: "white" }}>
              About
            </Link>
            <Link href="#" underline="hover" sx={{ color: "white" }}>
              Contact
            </Link>
            <Link href="#" underline="hover" sx={{ color: "white" }}>
              Privacy
            </Link>
          </Stack>

          {/* Right Section */}
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {new Date().getFullYear()} Footy Scouter. All rights reserved.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
