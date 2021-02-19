export function convertMinutesToTime(minutes) {
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, 0)}`;
}

// Items is an array of trip objects with fields: id, startTime, endTime
export function getTimeWindow(items) {
  if (!items.length) return;
  const earliest = items.reduce((prev, curr) =>
    prev.startTime < curr.startTime ? prev : curr
  );
  const earliestTime = convertMinutesToTime(earliest.startTime);

  const latest = items.reduce((prev, curr) =>
    prev.endTime > curr.endTime ? prev : curr
  );
  const latestTime = convertMinutesToTime(latest.endTime);

  return `${earliestTime} - ${latestTime}`;
}
