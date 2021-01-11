import moment from 'moment'

export const format = {
    Hour(hour, timezone) {
        if (hour) {
            if (timezone)
                return moment(String(hour)).utcOffset(timezone).format('HH:mm')
            else
                return moment(String(hour)).format('HH:mm')
        }
    },
    Date(date) {
        if (date) {
            return moment(String(date)).format('DD/MM/YYYY')
        }
    },
    DateHour(date, timezone) {
        return this.Date(date) + ' ' + this.Hour(date, timezone)
    },
    Money(value) {
        if (value) 
            return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',')
        else 
            return 'R$ 0,00'
    },
}