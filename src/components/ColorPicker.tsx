import { Box, Typography, Stack, Paper } from "@mui/material";
import { HexColorPicker } from "react-colorful";
import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";

export function ColorPicker() {
  const { setCustomColor, setColorPreset } = useTheme();
  const [color, setColor] = useState("#1976d2");

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    setCustomColor(newColor);
    setColorPreset("custom");
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Stack spacing={2}>
        <Typography
          variant="subtitle2"
          sx={{
            color: "text.primary",
            fontWeight: 600,
            textAlign: "center",
          }}
        >
          Customize Theme Color
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            "& .react-colorful": {
              width: "100%",
              height: "180px",
              borderRadius: 1,
              overflow: "hidden",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
            },
            "& .react-colorful__saturation": {
              borderRadius: "4px 4px 0 0",
            },
            "& .react-colorful__hue": {
              height: "20px",
              borderRadius: "0 0 4px 4px",
            },
          }}
        >
          <HexColorPicker color={color} onChange={handleColorChange} />
        </Box>
      </Stack>
    </Paper>
  );
}
