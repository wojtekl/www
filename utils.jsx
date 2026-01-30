const getUrlParams = () => new URLSearchParams(new URL(window.location).search)
const getUrlParam = (param) => getUrlParams().get(param) ?? undefined

/* DateFormatter */
const DateFormatter = (props: { timestamp: Number, locale: String }) => {
  const { timestamp, locale } = props
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const format = { month: "short", day: "numeric", timezone: timezone }
  return new Date(timestamp).toLocaleString(locale, format)
}


/* NumberFormatter */
const NumberFormatter = (props: { value: Number, locale: String }) => {
  const { value, locale } = props
  const format = { maximumFractionDigits: 2, minimumFractionDigits: 2 }
  return value.toLocaleString(locale, format)
}
