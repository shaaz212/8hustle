import {
  Card,
  CardHeader,
  Typography,
  Paper,
  Stack,
  Box,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import type { CardProps } from "@mui/material";
import { getInOutPairs } from "../utils/leavingTime";

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

type PairedEntry = {
  in: string;
  out?: string;
  inIndex: number;
  outIndex?: number;
};

export function EntriesTimeline({
  title,
  subheader,
  list,
  onEditEntry,
  ...other
}: Props) {
  const timeLinePairs = getInOutPairs(list);

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

      {timeLinePairs.length > 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.neutral",
            m: 2,
          }}
        >
          <Stack spacing={3}>
            {timeLinePairs.map((item, index) => (
              <InOutItem
                key={index}
                item={item}
                onEditIn={(newTime) => onEditEntry?.(item.inIndex, newTime)}
                onEditOut={(newTime) =>
                  item.outIndex !== undefined &&
                  onEditEntry?.(item.outIndex, newTime)
                }
              />
            ))}
          </Stack>
        </Paper>
      ) : (
        <Box
          sx={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.neutral",
            borderRadius: 2,
            m: 2,
            border: "1px dashed",
            borderColor: "divider",
          }}
        >
          <Typography variant="h6" color="text.secondary" fontWeight={500}>
            No Entry Available
          </Typography>
        </Box>
      )}
    </Card>
  );
}

function InOutItem({
  item,
  onEditIn,
  onEditOut,
}: {
  item: PairedEntry;
  onEditIn: (newTime: string) => void;
  onEditOut: (newTime: string) => void;
}) {
  const duration = item.out ? getTimeDifference(item.in, item.out) : "--";
  const [editDialog, setEditDialog] = useState<{
    open: boolean;
    type: "in" | "out";
    time: string;
  } | null>(null);

  const handleEditClick = (type: "in" | "out", time: string) => {
    setEditDialog({ open: true, type, time });
  };

  const handleClose = () => {
    setEditDialog(null);
  };

  const handleSave = (newTime: string) => {
    if (editDialog?.type === "in") {
      onEditIn(newTime);
    } else {
      onEditOut(newTime);
    }
    handleClose();
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap={2}
        flexWrap="wrap"
      >
        <TimeDisplay
          label="IN"
          time={item.in}
          color="success.main"
          onEdit={() => handleEditClick("in", item.in)}
        />
        <Divider sx={{ flex: 1 }} />
        <DurationDisplay duration={duration} />
        <Divider sx={{ flex: 1 }} />
        <TimeDisplay
          label="OUT"
          time={item.out || "—"}
          color={item.out ? "error.main" : "text.disabled"}
          onEdit={
            item.out ? () => handleEditClick("out", item.out!) : undefined
          }
        />
      </Box>

      <Dialog open={!!editDialog} onClose={handleClose}>
        <DialogTitle>Edit Time Entry</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Time"
            type="text"
            fullWidth
            value={editDialog?.time || ""}
            onChange={(e) =>
              setEditDialog((prev) =>
                prev ? { ...prev, time: e.target.value } : null
              )
            }
            placeholder="eg: 10:02:17 AM"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={() => editDialog && handleSave(editDialog.time)}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function TimeDisplay({
  label,
  time,
  color,
  onEdit,
}: {
  label: string;
  time: string;
  color: string;
  onEdit?: () => void;
}) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box
        sx={{
          bgcolor: color,
          borderRadius: "50%",
          width: 24,
          height: 24,
        }}
      />
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="subtitle2" fontWeight={600}>
            {time}
          </Typography>
          {onEdit && (
            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}

function DurationDisplay({ duration }: { duration: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <AccessTimeIcon fontSize="small" />
      <Box>
        <Typography variant="caption" color="text.secondary">
          Duration
        </Typography>
        <Typography variant="subtitle2" fontWeight={600}>
          {duration}
        </Typography>
      </Box>
    </Stack>
  );
}

function getTimeDifference(startTime: string, endTime: string): string {
  const baseDate = "2000-01-01";
  const start = new Date(`${baseDate} ${startTime}`);
  const end = new Date(`${baseDate} ${endTime}`);

  const diffMs = end.getTime() - start.getTime();

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${hours}h ${minutes}m ${seconds}s`;
}
