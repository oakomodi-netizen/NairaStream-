import { NigerianTimeData } from '../types';

/**
 * Calculates current time and calendar status in Nigerian Local Time (Africa/Lagos, UTC+1).
 * @param forceFridayOverride Optional test override for reviewers to simulate Friday payout window.
 */
export function getNigerianTimeData(forceFridayOverride = false): NigerianTimeData {
  const now = new Date();
  
  // Format options in Nigerian timezone
  const lagosOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Africa/Lagos',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  };

  const lagosDateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Africa/Lagos',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const timeString = new Intl.DateTimeFormat('en-NG', lagosOptions).format(now);
  const dateString = new Intl.DateTimeFormat('en-NG', lagosDateOptions).format(now);

  // Extract hour in Lagos
  const hourFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Lagos',
    hour12: false,
    hour: 'numeric'
  });
  const hour = parseInt(hourFormatter.format(now), 10);

  // Extract weekday in Lagos
  const dayFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Lagos',
    weekday: 'long'
  });
  const dayName = dayFormatter.format(now);
  const realIsFriday = dayName.toLowerCase() === 'friday';
  const isFriday = forceFridayOverride || realIsFriday;

  // Determine greeting based on Lagos hour
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
  } else if (hour >= 17 || hour < 4) {
    greeting = 'Good evening';
  }

  return {
    timeString,
    dateString,
    greeting,
    isFriday,
    dayName: forceFridayOverride ? 'Friday (Test Mode)' : dayName,
    formattedDateTime: `${dateString} • ${timeString} (WAT/Lagos)`
  };
}

export function formatNaira(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount).replace('NGN', '₦');
}
