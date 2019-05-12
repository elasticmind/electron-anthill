export function transformEvents(events) {
  const maxChannelLength = Math.max(...events.map((event) => event.channel.length));
  const transformEventWithChannelColumnPadding = (event) => transformEvent(event, maxChannelLength);

  return events.map(transformEventWithChannelColumnPadding).join('\n');
}

function transformEvent({timestamp, channel, category, subcategory}, maxChannelLength) {
  const categoryColumnPadding = maxChannelLength + 10;
  const timestampedChannelLength = channel.length + 10;
  return `[${timestamp.toFixed(6)}] ${channel}`
    + `${necessaryPadding(timestampedChannelLength, categoryColumnPadding)}`
    + `${category}|${subcategory}`;
}

function necessaryPadding(currentLength, maxLength) {
  return ' '.repeat(maxLength - currentLength + 1);
}
