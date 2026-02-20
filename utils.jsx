const getUrlParams = () => new URLSearchParams(new URL(window.location).search)
const getUrlParam = (param: String) => getUrlParams().get(param) ?? undefined
const datePart = (d = new Date()) => d.toISOString().split('T')[0]

const setForm = (form, data) => {
  for (const [key, value] of Object.entries(data)) {
    const e = form.querySelector(`[name='${key}']`)
    if (e) {
      e.value = value
    }
  }
}

const getWeeks = (months) => {
  const currentYear = new Date()
  currentYear.setHours(0, 0, 0, 0)
  currentYear.setMonth(0)
  currentYear.setDate(1)
  currentYear.setDate(currentYear.getDate() - currentYear.getDay() + 2)
  
  const nextYear = new Date().getFullYear() + 1
  const weeks = new Array()
  while(currentYear.getFullYear() < nextYear) {
    const start = datePart(currentYear)
    const month = months[currentYear.getMonth()]
    currentYear.setDate(currentYear.getDate() + 6)
    const nextMonth = months[currentYear.getMonth()]
    weeks.push({
      start: start,
      month: nextMonth === month ? month : `${month}/${nextMonth}`
    })
    currentYear.setDate(currentYear.getDate() + 1)
  }

  return weeks
}


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
