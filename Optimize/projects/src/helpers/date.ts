const moment = require('moment-timezone');

export default class DateConvertor {
    async dateConvertor(field: any, timeZone: string, format: string) {
        const utcDate = moment.utc(field);
        const ourDate = utcDate.tz(timeZone).format(format);
        return ourDate;
    }

    async dateDifference(field: any, timeZone: string,) {
        const createdAt = moment(field).tz(timeZone)
        const currentTime = moment().tz(timeZone);
        const diffDuration = moment.duration(currentTime.diff(createdAt));
        return diffDuration;
    }
}