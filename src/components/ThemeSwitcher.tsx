import { Box, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { ColorPicker } from "./ColorPicker";
import { Iconify } from "./iconify";

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
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
        <IconButton onClick={toggleMode} color="primary">
          <Iconify
            icon={
              mode === "light" ? "entypo:light-up" : "tdesign:mode-dark-filled"
            }
          />
        </IconButton>
      </Tooltip>

      <Tooltip title="Change theme color">
        <IconButton onClick={handleColorMenuOpen} color="primary">
          <Iconify icon="fluent:color-16-filled" />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleColorMenuClose}
      >
        <MenuItem onClick={(e) => e.stopPropagation()}>
          <ColorPicker />
        </MenuItem>
      </Menu>
    </Box>
  );
}
