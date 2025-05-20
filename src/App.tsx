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
import { Header } from "./components/header";
import { TimeEntry } from "./components/time-entry";
import { ToastProvider } from "./contexts/toast-context";
import { LeaveTime } from "./components/leave-time";
import { EntriesTimeline } from "./components/entries-timeline";

interface Entry {
  time: string;
  type: "in" | "out";
}

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [targetTime, setTargetTime] = useState("08:00");
  const [breakTime, setBreakTime] = useState("01:00");

  const handleAddEntries = useCallback((entry: Entry) => {
    setEntries((prev) => [entry, ...prev]);
  }, []);

  const handleTargetTime = useCallback((targetTime: string) => {
    setTargetTime(targetTime);
  }, []);

  const handleBreakTime = useCallback((breakTime: string) => {
    setBreakTime(breakTime);
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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              8Hustle
            </Typography>
            <ThemeSwitcher />
          </Toolbar>
        </AppBar>

        <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
          <ToastProvider>
            <Stack spacing={5}>
              <Header />
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
                  breakTime={breakTime}
                  onBreakTimeChange={(breakTime) => handleBreakTime(breakTime)}
                  onAddEntries={(entry) => handleAddEntries(entry)}
                />
                <LeaveTime
                  targetHours={targetTime}
                  breakHours={breakTime}
                  entries={entries}
                />
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
