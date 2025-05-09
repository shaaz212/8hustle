import { useCallback, useState } from "react";

// mui
import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

// components
import { Header } from "./components/header";
import { TimeEntry } from "./components/time-entry";
import { EntriesTimeline } from "./components/entries-timeline";
import { ToastProvider } from "./contexts/toast-context";
import { LeaveTime } from "./components/leave-time";

interface Entry {
  time: string;
  type: "in" | "out";
}

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [targetTime, setTargetTime] = useState("08:00");
  const [breakTime, setBreakTime] = useState("01:00");
  const [timeLeft, setTimeLeft] = useState("");

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

  console.log("list", entries);

  return (
    <ToastProvider>
      <Container maxWidth="xl">
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
              onTargetTimeChange={(targetTime) => handleTargetTime(targetTime)}
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
      </Container>
    </ToastProvider>
  );
}

export default App;
