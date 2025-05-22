import { forwardRef } from "react";
import { Icon } from "@iconify/react";
import Box from "@mui/material/Box";
import NoSsr from "@mui/material/NoSsr";

type IconifyProps = {
  icon: string;
  width?: number;
  color?: string;
  sx?: any;
  className?: string;
};

export const Iconify = forwardRef<SVGElement, IconifyProps>(
  ({ icon, width = 20, color, sx, className, ...other }, ref) => {
    const baseStyles = {
      width,
      height: width,
      flexShrink: 0,
      display: "inline-flex",
      color,
    };

    const classes = ["iconify", className].filter(Boolean).join(" ");

    const renderFallback = (
      <Box component="span" className={classes} sx={{ ...baseStyles, ...sx }} />
    );

    return (
      <NoSsr fallback={renderFallback}>
        <Box
          ref={ref}
          component={Icon}
          icon={icon}
          className={classes}
          sx={{ ...baseStyles, ...sx }}
          {...other}
        />
      </NoSsr>
    );
  }
);
