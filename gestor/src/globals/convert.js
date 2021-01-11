export const convert = {
    ToDateHour(date) {
        if (date) {
            let reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/
                , [, day, month, year, hours, minutes] = reggie.exec(date)
            return new Date(year, month, day, hours, minutes).toISOString()
        }
    },
}