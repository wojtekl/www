const getUrlParams = () => new URLSearchParams(new URL(window.location).search)
const getUrlParam = (param) => getUrlParams().get(param) ?? undefined
const datePart = (d) => d.toISOString().split('T')[0]


/* DateFormatter */
const DateFormatter = (props: { timestamp: Number, locale: String, format: String }) => {
  const { timestamp, locale, format } = props
  if (!timestamp) {
    return '---'
  }
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const formatDefault = { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "numeric", timezone: timezone }
  const formatDate = { weekday: "short", month: "short", day: "numeric", timezone: timezone }
  const formatTime = { hour: "numeric", minute: "numeric", timezone: timezone }
  return new Date(timestamp).toLocaleString(locale, 'time' === format ? formatTime : 'date' === format ? formatDate : formatDefault)
}


/* NumberFormatter */
const NumberFormatter = (props: { value: Number, locale: String }) => {
  const { value, locale } = props
  const format = { maximumFractionDigits: 2, minimumFractionDigits: 2 }
  return value.toLocaleString(locale, format)
}
