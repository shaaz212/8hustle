import { useCallback, useState } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Stack,
} from "@mui/material";
import { ThemeProvider } from "./theme/ThemeContext";
import { ThemeSwitcher } from "./components/ThemeSwitcher";

// components
import { TimeEntry } from "./components/time-entry";
import { ToastProvider } from "./contexts/toast-context";
import { LeaveTime } from "./components/leave-time";
import { EntriesTimeline } from "./components/entries-timeline";
import { Iconify } from "./components/iconify";

interface Entry {
  time: string;
  type: "in" | "out";
}

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [targetTime, setTargetTime] = useState("08:00");

  const handleAddEntries = useCallback((entry: Entry) => {
    setEntries((prev) => [entry, ...prev]);
  }, []);

  const handleTargetTime = useCallback((targetTime: string) => {
    setTargetTime(targetTime);
  }, []);

  const handleEditEntry = useCallback((index: number, newTime: string) => {
    setEntries((prev) => {
      const newEntries = [...prev];
      newEntries[index] = { ...newEntries[index], time: newTime };
      return newEntries;
    });
  }, []);

  return (
    <ThemeProvider>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Iconify icon="guidance:time" color="primary.main" />
            <Typography
              variant="h6"
              component="div"
              fontWeight={800}
              sx={{ flexGrow: 1 }}
            >
              Hustle
            </Typography>
            <ThemeSwitcher />
          </Toolbar>
        </AppBar>

        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          <ToastProvider>
            <Stack spacing={5}>
              <Box
                display="grid"
                gridTemplateColumns={{ xs: "1fr", md: "repeat(2,1fr)" }}
                gap={3}
              >
                <TimeEntry
                  title="Work Hours"
                  targetTime={targetTime}
                  onTargetTimeChange={(targetTime) =>
                    handleTargetTime(targetTime)
                  }
                  onAddEntries={(entry) => handleAddEntries(entry)}
                />
                <LeaveTime targetHours={targetTime} entries={entries} />
              </Box>
              <EntriesTimeline
                title="Work Hours Timeline"
                list={entries}
                onEditEntry={handleEditEntry}
              />
            </Stack>
          </ToastProvider>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
