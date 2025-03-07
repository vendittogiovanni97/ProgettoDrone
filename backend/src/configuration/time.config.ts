import moment from "moment-timezone";
moment.tz.setDefault("Europe/Rome");
moment.locale("it");  

export const oggi = moment().calendar();
