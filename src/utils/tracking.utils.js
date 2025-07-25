export function parseTimestamp(timestamp) {
  const dateStr = timestamp.slice(0, 8);
  const timeStr = timestamp.slice(9);
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const hour = timeStr.slice(0, 2);
  const minute = timeStr.slice(2, 4);
  const second = timeStr.slice(4, 6);

  return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
}
