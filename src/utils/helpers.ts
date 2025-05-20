export function isValid12HourTimeFormat(time: string): boolean {
  // Allow both 12-hour and 24-hour formats
  const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9](?::[0-5][0-9])?\s*(AM|PM)$/i;
  const time24Regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9])?$/;
  return timeRegex.test(time.trim()) || time24Regex.test(time.trim());
}

export function isValidTimeFormat(time: string): boolean {
  // Validate HH:mm format
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time.trim());
}

export function formatTo24Hour(timeStr: string): string {
  try {
    // Handle 12-hour format (e.g., "10:05:41 AM" or "3:39:57 PM")
    const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
    if (match) {
      let [_, hours, minutes, seconds, period] = match;
      let hour = parseInt(hours);
      
      if (period.toUpperCase() === "PM" && hour !== 12) {
        hour += 12;
      } else if (period.toUpperCase() === "AM" && hour === 12) {
        hour = 0;
      }
      
      return `${hour.toString().padStart(2, "0")}:${minutes}${seconds ? `:${seconds}` : ":00"}`;
    }
    
    // Handle 24-hour format (e.g., "14:30:00")
    return timeStr;
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeStr;
  }
}

export function formatTo12Hour(timeStr: string): string {
  try {
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds || 0);
    
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return timeStr;
  }
}

export function calculateTimeDifference(startTime: string, endTime: string): string {
  try {
    const start = new Date(`2000-01-01 ${formatTo24Hour(startTime)}`);
    const end = new Date(`2000-01-01 ${formatTo24Hour(endTime)}`);

    const diffMs = end.getTime() - start.getTime();

    if (isNaN(diffMs) || diffMs < 0) return "Invalid";

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.join(" ") || "0s";
  } catch (error) {
    console.error("Error calculating time difference:", error);
    return "Invalid";
  }
}

export function calculateTotalDuration(entries: { time: string; type: "in" | "out" }[]): string {
  let totalMs = 0;
  let inTime: string | null = null;

  // Process entries in chronological order
  for (const entry of entries) {
    if (entry.type === "in") {
      inTime = entry.time;
    } else if (entry.type === "out" && inTime) {
      const start = new Date(`2000-01-01 ${formatTo24Hour(inTime)}`);
      const end = new Date(`2000-01-01 ${formatTo24Hour(entry.time)}`);
      const duration = end.getTime() - start.getTime();
      
      if (duration > 0) {
        totalMs += duration;
      }
      inTime = null;
    }
  }

  if (totalMs === 0) return "";

  const hours = Math.floor(totalMs / (1000 * 60 * 60));
  const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(" ") || "0s";
}