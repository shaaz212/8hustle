export function isValid12HourTimeFormat(time: string): boolean {
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]:[0-5][0-9] (AM|PM)$/i;
    return timeRegex.test(time.trim());
  }