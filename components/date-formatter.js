import { parseISO, format } from 'date-fns'

export default function DateFormatter({ dateString }) {
  console.log(dateString)
  // const date = parseISO(dateString)
  // return <time dateTime={dateString}>{format(date, 'LLLL	d, yyyy')}</time>
  return <time>{dateString}</time>
}
