import { Box, Stack, Typography, Container } from "@mui/material";
import logoImg from "../assets/logo.png";

export function Header() {
  return (
    <header>
      <Container maxWidth="xl">
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "background.paper",
          }}
        >
          <Box
            component="img"
            src={logoImg}
            alt="Logo"
            sx={{
              width: 40,
              height: 40,
              objectFit: "contain",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "success.main",
              letterSpacing: "0.5px",
            }}
          >
            8hustle
          </Typography>
        </Stack>
      </Container>
    </header>
  );
}
