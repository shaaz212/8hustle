import type { CardProps } from "@mui/material/Card";
import type { TimelineItemProps } from "@mui/lab/TimelineItem";

import Card from "@mui/material/Card";
import Timeline from "@mui/lab/Timeline";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";

// ----------------------------------------------------------------------

interface Entry {
  time: string;
  type: "in" | "out";
}

type Props = CardProps & {
  title?: string;
  subheader?: string;
  list: Entry[];
  onEditEntry?: (index: number, newTime: string) => void;
};

export function EntriesTimeline({
  title,
  subheader,
  list,
  onEditEntry,
  ...other
}: Props) {
  return (
    <Card {...other}>
      <CardHeader
        title={
          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>
        }
        subheader={subheader}
      />

      {list?.length > 0 ? (
        <Timeline
          sx={{
            m: 0,
            p: 3,
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
              padding: 0,
            },
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: "background.neutral",
            }}
          >
            <Box>
              {list.map((item, itemIndex) => {
                const pairedEntry =
                  item.type === "in"
                    ? list.slice(itemIndex + 1).find((e) => e.type === "out")
                    : list
                        .slice(0, itemIndex)
                        .reverse()
                        .find((e) => e.type === "in");

                const timeDifference = pairedEntry
                  ? calculateTimeDifference(
                      item.type === "in" ? item.time : pairedEntry.time,
                      item.type === "in" ? pairedEntry.time : item.time
                    )
                  : undefined;

                const lastItem = itemIndex === list.length - 1;

                return (
                  <Item
                    key={itemIndex}
                    item={item}
                    lastItem={lastItem}
                    timeDifference={timeDifference}
                    onEdit={(newTime) => onEditEntry?.(itemIndex, newTime)}
                  />
                );
              })}
            </Box>
          </Paper>
        </Timeline>
      ) : (
        <Box
          sx={{
            height: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.neutral",
            borderRadius: 2,
            m: 3,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Stack direction="column" spacing={1} alignItems="center">
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              No Entry Available
            </Typography>
          </Stack>
        </Box>
      )}
    </Card>
  );
}

// ----------------------------------------------------------------------

type ItemProps = TimelineItemProps & {
  lastItem: boolean;
  item: Entry;
  timeDifference?: string;
  onEdit?: (newTime: string) => void;
};

function Item({ item, lastItem, timeDifference, onEdit, ...other }: ItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTime, setEditedTime] = useState(item.time);

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleClose = () => {
    setIsEditDialogOpen(false);
    setEditedTime(item.time);
  };

  const handleSave = () => {
    onEdit?.(editedTime);
    setIsEditDialogOpen(false);
  };

  return (
    <TimelineItem {...other}>
      <TimelineSeparator>
        <TimelineDot
          color={item.type === "in" ? "success" : "error"}
          sx={{
            bgcolor: item.type === "in" ? "success.main" : "error.main",
          }}
        />
        {!lastItem && <TimelineConnector />}
      </TimelineSeparator>

      <TimelineContent>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: item.type === "in" ? "success.main" : "error.main",
            }}
          >
            {item.type === "in" ? "Clocked In" : "Clocked Out"}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            at
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {format12Hour(item.time)}
          </Typography>
          <IconButton
            size="small"
            onClick={handleEditClick}
            sx={{
              ml: 1,
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Stack>

        {timeDifference && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              mt: 1,
              color: "success.main",
              bgcolor: "success.lighter",
              p: 1,
              borderRadius: 1,
              display: "inline-flex",
            }}
          >
            <AccessTimeIcon fontSize="small" />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {item.type === "in" ? "Expected Duration" : "Duration"}:{" "}
              {timeDifference}
            </Typography>
          </Stack>
        )}

        <Dialog open={isEditDialogOpen} onClose={handleClose}>
          <DialogTitle>Edit Time Entry</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Time"
              type="text"
              fullWidth
              value={editedTime}
              onChange={(e) => setEditedTime(e.target.value)}
              placeholder="eg: 10:02:17 AM"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </TimelineContent>
    </TimelineItem>
  );
}

// ----------------------------------------------------------------------

function calculateTimeDifference(inTime: string, outTime: string): string {
  const in24hr = convertTo24Hour(inTime);
  const out24hr = convertTo24Hour(outTime);

  const inDate = new Date(`2000-01-01T${in24hr}:00`);
  const outDate = new Date(`2000-01-01T${out24hr}:00`);

  const diffMs = outDate.getTime() - inDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const parts = [];
  if (diffHours > 0) parts.push(`${diffHours}h`);
  if (diffMinutes > 0) parts.push(`${diffMinutes}m`);
  if (diffSeconds > 0) parts.push(`${diffSeconds}s`);

  return parts.join(" ") || "0s";
}

function convertTo24Hour(timeStr: string): string {
  const [time, period] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

function format12Hour(timeStr: string) {
  const [hour, minute] = timeStr.split(":");
  const date = new Date();
  date.setHours(Number(hour));
  date.setMinutes(Number(minute));
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
