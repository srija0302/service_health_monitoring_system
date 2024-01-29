
const formattedDate = (timestamp) => { return new Date(timestamp).toLocaleString('en-US', {
  timeZone: 'Asia/Kolkata',
  hour12: false,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});
}

export default formattedDate;
