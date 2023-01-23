
import { MONTHS_SHORT } from '../variables';

export function dateFormat (d: string) {
  const date = new Date(d);
  let dateStr = ''
  const hrs = date.getHours()
  const meridian = hrs > 12 ? 'PM' : 'AM'
  let hours = (hrs > 12 ? hrs - 12 : hrs).toString()
  while (hours.length < 2) hours = `0${hours}`
  let minutes = date.getMinutes().toString()
  while (minutes.length < 2) minutes = `0${minutes}`

  dateStr += MONTHS_SHORT[date.getMonth()] + ' '
  dateStr += date.getDate() + ', '
  dateStr += date.getFullYear() + ' '
  dateStr += hours + ':'
  dateStr += minutes + ' '
  dateStr += meridian

  return dateStr;
}
