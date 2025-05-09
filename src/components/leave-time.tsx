import { useState } from "react";
import { Card, CardContent, Typography, Stack, Box } from "@mui/material";

interface LeaveTimeProps {
  targetHours: string; // e.g., "08:00"
  breakHours: string; // e.g., "01:00"
  entries: { time: string; type: "in" | "out" }[];
}

export function LeaveTime({
  targetHours,
  breakHours,
  entries,
}: LeaveTimeProps) {
  const toMinutes = (timeStr: string): number => {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const targetMinutes = toMinutes(targetHours);
  const breakAllowanceMinutes = toMinutes(breakHours);

  const calculateTotalWorkTime = () => {
    let totalMinutes = 0;
    for (let i = 0; i < entries.length; i += 2) {
      if (i + 1 < entries.length) {
        const inTime = new Date(`2000-01-01T${entries[i].time}`);
        const outTime = new Date(`2000-01-01T${entries[i + 1].time}`);
        totalMinutes += (outTime.getTime() - inTime.getTime()) / (1000 * 60);
      }
    }
    return totalMinutes;
  };

  const calculateBreakTime = () => {
    let breakMinutes = 0;
    for (let i = 0; i < entries.length - 1; i++) {
      if (entries[i].type === "out" && entries[i + 1].type === "in") {
        const outTime = new Date(`2000-01-01T${entries[i].time}`);
        const inTime = new Date(`2000-01-01T${entries[i + 1].time}`);
        breakMinutes += (inTime.getTime() - outTime.getTime()) / (1000 * 60);
      }
    }
    return breakMinutes;
  };

  const totalWorkMinutes = calculateTotalWorkTime();
  const breakMinutes = calculateBreakTime();
  const remainingWorkMinutes = targetMinutes - totalWorkMinutes;
  const remainingBreakMinutes = Math.max(
    0,
    breakAllowanceMinutes - breakMinutes
  );
  const totalRemainingMinutes = Math.max(
    0,
    remainingWorkMinutes + remainingBreakMinutes
  );

  const formatLeaveTime = (baseTime: Date, offsetMinutes: number) => {
    const leaveTime = new Date(baseTime.getTime() + offsetMinutes * 60000);
    return leaveTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const calculateLeaveTime = () => {
    const lastIn = [...entries].reverse().find((e) => e.type === "in");
    if (!lastIn) return "00:00:00";
    const lastInDate = new Date(`2000-01-01T${lastIn.time}`);
    return formatLeaveTime(lastInDate, totalRemainingMinutes);
  };

  const formatRegularTime = (minutes: number) => {
    const h = Math.floor(Math.abs(minutes) / 60);
    const m = Math.floor(Math.abs(minutes) % 60);
    return `${h}:${m.toString().padStart(2, "0")}`;
  };

  const calculateTimeLeft = () => {
    const hasOut = entries.some((e) => e.type === "out");
    return hasOut
      ? formatRegularTime(totalWorkMinutes)
      : formatRegularTime(remainingWorkMinutes);
  };

  return (
    <Stack spacing={2}>
      <Box>
        <Card>
          <CardContent>
            <Box
              display="flex"
              flexDirection="column"
              textAlign="center"
              gap={1}
            >
              <Typography variant="caption" fontWeight={700}>
                You can leave at
              </Typography>
              <Typography variant="h4" fontWeight={700}>
                {calculateLeaveTime()}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "repeat(2,1fr)" }}
        gap={2}
      >
        {[
          {
            label: "Target Time",
            time: formatRegularTime(targetMinutes),
            color: "text.primary",
          },
          {
            label: entries.some((e) => e.type === "out")
              ? "Total Time"
              : "Time Left",
            time: calculateTimeLeft(),
            color: remainingWorkMinutes <= 0 ? "success.main" : "error.main",
          },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent>
              <Box
                display="flex"
                flexDirection="column"
                textAlign="center"
                gap={1}
              >
                <Typography variant="caption" fontWeight={700}>
                  {item.label}
                </Typography>
                <Typography variant="h4" fontWeight={700} color={item.color}>
                  {item.time}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
