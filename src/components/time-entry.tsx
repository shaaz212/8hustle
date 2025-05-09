import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useToast } from "../contexts/toast-context";
import { isValid12HourTimeFormat } from "../utils/helpers";

interface Entry {
  time: string;
  type: "in" | "out";
}

type Props = {
  title?: string;
  targetTime?: string;
  breakTime?: string;
  onTargetTimeChange: (targetTime: string) => void;
  onBreakTimeChange: (breakTime: string) => void;
  onAddEntries: (entry: Entry) => void;
};

export function TimeEntry({
  title,
  targetTime,
  onTargetTimeChange,
  breakTime,
  onBreakTimeChange,
  onAddEntries,
}: Props) {
  const [time, setTime] = useState("");
  const [timingRadio, setTimingRadio] = useState<"in" | "out">("in");
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid12HourTimeFormat(time)) {
      showToast(
        "Please enter time in format: h:mm:ss p (e.g., 9:30:00 am) or HH:mm:ss (e.g., 09:30:00)",
        "error"
      );
      return;
    }

    onAddEntries({
      time: time,
      type: timingRadio,
    });

    showToast(
      `Time ${timingRadio === "in" ? "clocked in" : "clocked out"} at ${time}`,
      "success"
    );

    // Reset form
    setTime("");
    setTimingRadio(timingRadio === "in" ? "out" : "in");
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTimingRadio(event.target.value as "in" | "out");
  };

  return (
    <Card>
      <CardHeader
        title={
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
        }
      />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" fontWeight={700}>
                  Target Time :
                </Typography>
                <TextField
                  type="text"
                  value={targetTime}
                  onChange={(e) => onTargetTimeChange(e.target.value)}
                  placeholder="eg: hh:mm"
                  size="small"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "success.main",
                      },
                    },
                  }}
                />
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" fontWeight={700}>
                  Break Time :
                </Typography>
                <TextField
                  type="text"
                  value={breakTime}
                  onChange={(e) => onBreakTimeChange(e.target.value)}
                  placeholder="eg: hh:mm"
                  size="small"
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "success.main",
                      },
                    },
                  }}
                />
              </Box>
            </Stack>
            <TextField
              label="Time"
              type="text"
              placeholder="eg: 10:02:17 AM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "success.main",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "success.main",
                },
                "& label.Mui-focused": {
                  color: "success.main",
                },
              }}
            />

            <Box display="flex" justifyContent="center">
              <FormControl>
                <RadioGroup
                  row
                  name="timingRadio"
                  value={timingRadio}
                  onChange={handleRadioChange}
                >
                  <FormControlLabel
                    value="in"
                    control={<Radio color="success" />}
                    label="In"
                  />
                  <FormControlLabel
                    value="out"
                    control={<Radio color="success" />}
                    label="Out"
                  />
                </RadioGroup>
              </FormControl>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={!time || !timingRadio}
            >
              Submit
            </Button>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
}
