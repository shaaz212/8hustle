type LogEntry = {
    time?: string;
    type?: 'in' | 'out';
  };

  type PairedEntry = {
    in: string;
    out?: string;
    inIndex: number;
    outIndex?: number;
  };
  

  export function getLeavingTime(
    logs?: LogEntry[],
    workingHours: string = '08:00', // Default value is "08:00" for 8 hours
  ): string {
    if (!logs || logs.length === 0) return 'No Logs Available';
  
    // Parse the working hours string (e.g., "08:00") to hours and minutes
    const [workHoursStr, workMinutesStr] = workingHours.split(':').map(Number);
    const workingMs = (workHoursStr * 60 + workMinutesStr) * 60 * 1000;
  
    // Parse and sort valid logs
    const sortedLogs = logs
      .filter((entry): entry is Required<LogEntry> => !!entry.time && !!entry.type)
      .map((entry) => ({
        ...entry,
        date: new Date('2000-01-01T' + convertTo24Hour(entry.time.trim()))
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  
    if (sortedLogs.length === 0) return 'No valid logs';
  
    let totalInsideMs = 0;
    let lastInTime: Date | null = null;
  
    // Calculate total time spent inside
    for (const log of sortedLogs) {
      if (log.type === 'in') {
        lastInTime = log.date;
      } else if (log.type === 'out' && lastInTime) {
        totalInsideMs += log.date.getTime() - lastInTime.getTime();
        lastInTime = null;
      }
    }
  
    const lastEntry = sortedLogs[sortedLogs.length - 1];
  
    // Case when the last entry is "in"
    if (lastEntry.type === 'in') {
      const nowIn = lastEntry.date;
      const remainingInsideMs = Math.max(workingMs - totalInsideMs, 0);
      const leavingDate = new Date(nowIn.getTime() + remainingInsideMs);
      return formatAMPM(leavingDate);
    }
  
    // Case when the user is already "out"
    if (lastEntry.type === 'out') {
      const totalInsideMsCompleted = totalInsideMs;
      const totalRemainingMs = Math.max(workingMs - totalInsideMsCompleted, 0);
      
      if (totalRemainingMs === 0) {
        return 'You are done, bro!';
      }
      
      // Calculate when the user can leave based on the total remaining time
      const leavingDate = new Date(new Date().getTime() + totalRemainingMs);
      return `You can leave at ${formatAMPM(leavingDate)}`;
    }
  
    return 'Already outside';
  }
  
  // Function to calculate total worked hours inside
  export function getTotalWorkedHours(logs?: LogEntry[]): string {
    if (!logs || logs.length === 0) return '00:00';
  
    let totalInsideMs = 0;
    let lastInTime: Date | null = null;
  
    const sortedLogs = logs
      .filter((entry): entry is Required<LogEntry> => !!entry.time && !!entry.type)
      .map((entry) => ({
        ...entry,
        date: new Date('2000-01-01T' + convertTo24Hour(entry.time.trim())),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  
    for (const log of sortedLogs) {
      if (log.type === 'in') {
        lastInTime = log.date;
      } else if (log.type === 'out' && lastInTime) {
        totalInsideMs += log.date.getTime() - lastInTime.getTime();
        lastInTime = null;
      }
    }
  
    const hours = Math.floor(totalInsideMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalInsideMs % (1000 * 60 * 60)) / (1000 * 60));
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  
  // Function to calculate remaining hours to complete working hours
  export function getRemainingHours(logs?: LogEntry[], workingHours: string = '08:00'): string {
    if (!logs || logs.length === 0) return '00:00';
  
    const [workHoursStr, workMinutesStr] = workingHours.split(':').map(Number);
    const workingMs = (workHoursStr * 60 + workMinutesStr) * 60 * 1000;
  
    const totalWorkedMs = getTotalWorkedTimeInMilliseconds(logs);
    const remainingMs = Math.max(workingMs - totalWorkedMs, 0);
  
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  
  // Helper function to get total worked time in milliseconds
  function getTotalWorkedTimeInMilliseconds(logs?: LogEntry[]): number {
    if (!logs || logs.length === 0) return 0;
  
    let totalInsideMs = 0;
    let lastInTime: Date | null = null;
  
    // Parse and sort valid logs
    const sortedLogs = logs
      .filter((entry): entry is Required<LogEntry> => !!entry.time && !!entry.type)
      .map((entry) => ({
        ...entry,
        date: new Date('2000-01-01T' + convertTo24Hour(entry.time.trim()))
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  
    for (const log of sortedLogs) {
      if (log.type === 'in') {
        lastInTime = log.date;
      } else if (log.type === 'out' && lastInTime) {
        totalInsideMs += log.date.getTime() - lastInTime.getTime();
        lastInTime = null;
      }
    }
  
    return totalInsideMs;
  }
  
  export function getInOutPairs(logs?: LogEntry[]): PairedEntry[] {
    if (!logs || logs.length === 0) return [];
  
    const sortedLogs = logs
      .filter((entry): entry is Required<LogEntry> => !!entry.time && !!entry.type)
      .map((entry, index) => ({
        ...entry,
        date: new Date('2000-01-01T' + convertTo24Hour(entry.time.trim())),
        originalIndex: index
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  
    const pairs: PairedEntry[] = [];
    let lastIn: { time: string; index: number } | null = null;
  
    for (const log of sortedLogs) {
      if (log.type === 'in') {
        lastIn = { time: log.time, index: log.originalIndex };
      } else if (log.type === 'out' && lastIn) {
        pairs.push({ 
          in: lastIn.time, 
          out: log.time,
          inIndex: lastIn.index,
          outIndex: log.originalIndex
        });
        lastIn = null;
      }
    }
  
    // If last entry is an unpaired "in", include it without "out"
    if (lastIn) {
      pairs.push({ 
        in: lastIn.time,
        inIndex: lastIn.index
      });
    }
  
    return pairs;
  }

  // Convert "hh:mm:ss AM/PM" to 24-hour format string
  function convertTo24Hour(time: string): string {
    const [hms, modifier] = time.split(' ');
    let [hours, minutes, seconds] = hms.split(':').map(Number);
  
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
  
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Helper: Format date to "hh:mm:ss AM/PM"
  function formatAMPM(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12 || 12;
  
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
  }
  