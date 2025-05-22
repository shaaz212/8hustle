import { Card, CardContent, Typography, Stack, Box } from "@mui/material";
import {
  getLeavingTime,
  getRemainingHours,
  getTotalWorkedHours,
} from "../utils/leavingTime";

interface LeaveTimeProps {
  targetHours: string; // e.g., "08:00"
  entries: { time: string; type: "in" | "out" }[];
}

export function LeaveTime({ targetHours, entries }: LeaveTimeProps) {
  const leavingTime = getLeavingTime(entries, targetHours);
  const totalWorkedTime = getTotalWorkedHours(entries);
  const TimeLeft = getRemainingHours(entries);

  return (
    <Stack spacing={2}>
      <Box>
        <Card>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 220,
            }}
          >
            <Typography variant="h4" color="primary.main" fontWeight={700}>
              {leavingTime}
            </Typography>
          </Box>
        </Card>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "repeat(2,1fr)" }}
        gap={2}
      >
        {[
          {
            label: "Total Work Time",
            time: totalWorkedTime,
            color: "text.primary",
          },
          {
            label: "Left Time",
            time: TimeLeft,
            color: "error.main",
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
