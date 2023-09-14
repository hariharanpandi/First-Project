const moment = require('moment-timezone');

export default class DateConvertor {
    async dateConvertor(field: any, tenant: any, format:string) {
        const utcDate = moment.utc(field);
        const ourDate = utcDate.tz(tenant.time_zone).format(format);
        return ourDate;
    }
}