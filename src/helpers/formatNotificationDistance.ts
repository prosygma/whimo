import { formatDistanceToNow } from 'date-fns';

export const formatNotificationDistance = (date: string) => {
  const distanceString = formatDistanceToNow(new Date(date), { addSuffix: true });
  const strippedDistance = distanceString.replace('about', '').trim();

  return strippedDistance
    .replace(/\b(\d+)\s+seconds?\b/g, '$1s')
    .replace(/\b(\d+)\s+minutes?\b/g, '$1m')
    .replace(/\b(\d+)\s+hours?\b/g, '$1h')
    .replace(/\b(\d+)\s+days?\b/g, '$1d')
    .replace(/\b(\d+)\s+months?\b/g, '$1mo')
    .replace(/\b(\d+)\s+years?\b/g, '$1y')
    .replace(/less than a minute/, '<1m');
};
