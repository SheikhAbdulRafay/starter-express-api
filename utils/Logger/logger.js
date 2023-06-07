const { createLogger, format, transports } = require('winston');
var currentdate = new Date(); 
var datetime = "" +currentdate.getFullYear() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                +  currentdate.getDate() + ".log";  
   
module.exports = createLogger({
transports:
    new transports.File({
    filename: `logs/${datetime}`,
    format:format.combine(
        format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
        format.align(),
        format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
    )}),
});