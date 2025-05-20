import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PaletteIcon from "@mui/icons-material/Palette";
import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { ColorPicker } from "./ColorPicker";

export function ThemeSwitcher() {
  const { mode, toggleMode } = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleColorMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleColorMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
        <IconButton onClick={toggleMode} color="inherit">
          {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
      </Tooltip>

      <Tooltip title="Change theme color">
        <IconButton onClick={handleColorMenuOpen} color="inherit">
          <PaletteIcon />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleColorMenuClose}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 200,
          },
        }}
      >
        <MenuItem
          onClick={(e) => e.stopPropagation()}
          sx={{
            minWidth: 200,
            p: 0,
          }}
        >
          <ColorPicker />
        </MenuItem>
      </Menu>
    </Box>
  );
}
