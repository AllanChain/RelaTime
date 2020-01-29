import ICAL from 'ical.js'

const translateDate = date => ICAL.Time.fromJSDate(new Date(date), true)

export default {
  name: 'utils',
  h: 0,
  randColor() {
    this.h = (this.h + 90 + Math.round(20 * Math.random())) % 360
    return {
      h: this.h,
      s: Math.round(60 + 40 * Math.random()),
      l: Math.round(40 + 20 * Math.random())
    }
  },
  eventToComp(data) {
    data = JSON.parse(JSON.stringify(data))
    let comp = new ICAL.Component('VEVENT')
    data.rrule.until = translateDate(data.rrule.until)
    data.rrule = new ICAL.Recur(data.rrule)
    data.exdate = data.exdate.map(translateDate)
    data.duration = ICAL.Duration.fromSeconds(data.duration)
    data.description = JSON.stringify(data.description)
    for (let key in data) {
      let val = data[key]
      if (key.startsWith('dt')) val = translateDate(val)
      try {
        comp.addPropertyWithValue(key, val || undefined)
      } catch {
        comp.addProperty(new ICAL.Property(key)).setValues(val)
      }
    }
    return comp
  },
  compToEvent(comp) {
    let event = new ICAL.Event(comp)
    let rrule = comp.getFirstPropertyValue('rrule')
    let description
    try {
      description = JSON.parse(event.description)
    } catch {
      let matchClass = event.description.match(/(\d)+班(，(\d)学分)*?/)
      let matchMod = event.summary.match(/^(.*?)(习题|上机)课*?$/)
      description = {
        class: matchClass[1],
        credit: matchClass[3],
        mod: matchMod ? matchMod[2] : '',
        course: matchMod ? matchMod[1] : event.summary
      }
    }
    return {
      location: event.location,
      summary: event.summary,
      description: description,
      uid: event.uid,
      dtstart: event.startDate.toJSDate(),
      dtstamp: comp.getFirstPropertyValue('dtstamp').toJSDate(),
      dtend: event.endDate.toJSDate(),
      duration: event.duration.toSeconds(),
      rrule: {
        freq: rrule.freq,
        interval: rrule.interval,
        until: rrule.until.toJSDate(),
        ...rrule.parts
      },
      exdate: [
        ...comp
          .getFirstProperty('exdate')
          .getValues()
          .map(date => date.toJSDate())
      ]
    }
  },
  * getIterator(event) {
    let result
    let it = new ICAL.Event(this.eventToComp(event)).iterator()
    while ((result = it.next())) yield result.toJSDate()
  }
}
