const useGetClients = () => {
  const dayOfMonth = new Date().getDate()
  const month = new Date().getMonth() + 1
  const isSunday = (0 === new Date().getDay()) || (1 === month && (1 === dayOfMonth || 6 === dayOfMonth)) || (11 === month && 1 === dayOfMonth) || (12 === month && (25 === dayOfMonth || 26 === dayOfMonth)) ? true : false

  const result = clients.clients.map(i => {
    let incoming = ''
    const base = new Date()
    const now = new Date()
    const schedule = isSunday ? (i.sunday ?? []) : i.week
    schedule.forEach((j, _) => {
      base.setHours(j.substring(0, 2))
      base.setMinutes(j.substring(3, 5))
      const diff = base - now
      if (diff >= -(1000 * 60 * 5) && diff < (1000 * 60 * 60)) {
        incoming = `${incoming} ${j}`
      }
    })
    return {
      name: i.name,
      latitude: i.latitude,
      longitude: i.longitude,
      live: !!i.live,
      incoming: incoming.trim()
    }
  })

  return result
}
