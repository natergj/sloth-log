let util = require('util');
let os = require('os');
let colors = require('colors');
let dateformat = require('dateformat');
let nodemailer = require('nodemailer');
let ansiUp = require('ansi_up');
let stripColorCodes = require('stripcolorcodes');

/**
 * Email log entries 
 * @param {Object} settings emailSettings value of Logger instance
 * @param {String} msg ansi text string of error message
 * @param {Function} cb Function to call once email is sent. Only called on error.
 */
let emailLog = (settings, msg, cb) => {
    let transporter = nodemailer.createTransport(settings.transportConfig);
    transporter.verify((err) => {
        if (err) {
            return cb(err);
        }

        let data = {
            from: settings.from,
            to: settings.to,
            text: stripColorCodes(msg),
            html: ansiUp.ansi_to_html(msg.replace(new RegExp('\n', 'g'), '<br/>')),
            subject: settings.subject
        };

        transporter.sendMail(data, cb);
    });
};

/**
 * Creates a formatted line of ansi text based on level settings
 * @param {String} levelName Name of the log level
 * @param {Logger} logger Logger instance
 * @param {Array} args arguments sent to log 
 * @param {String} fullFilePath full path to file calling logger
 * @param {String} relativeFilePath path to file calling logger relative to process.cwd
 * @param {String} line Line number that logger is called from 
 * @returns {String} ansi string for log entry
 */
let formatLog = (levelName, logger, args, fullFilePath, relativeFilePath, line) => {
    let params = logger.levels[levelName];
    
    // Get date and time for log entry
    let logDate = dateformat(new Date(), params.dateFormat);

    // Get formatted log type flag 
    let logLevelName = colors.blue('[') +
        colors[ params.color ].bold(levelName.toUpperCase()) +
        colors.blue(']');

    // Generate log message based on passed arguments
    let logMessage = '';
    if (params.inspect === true) {
        let msgParts = [];
        Object.keys(args).forEach((i) => {
            msgParts.push(util.inspect(args[i], params.inspectOptions));
        });
        logMessage = msgParts.join(' ');
    } else {
        logMessage = util.format(...args);  
    }
    
    // Combine parts into log line based on provided format
    let log = eval('`' + params.format + '`'); 

    return `${log}\n`; 
};

/**
 * Handles all calls to the loggers
 * @param {String} levelName Name of the log level
 * @param {Logger} logger Logger instance
 * @param {Array} args arguments sent to log 
 */
let processLog = (levelName, logger, args) => {
    let params = logger.levels[levelName];

    // Only process log lines if threshold is less than or equal to current log level
    if (params.logLevelThreshold > logger.logLevel) {
        return;
    }

    // Get line and file for log entry
    let errStack = (new Error()).stack;
    let stacklist = errStack.split('\n')[3].split('at ')[1];
    let regEx = /\(([^)]+)\)/;
    let parsedStack = regEx.exec(stacklist) ? regEx.exec(stacklist)[1] : stacklist;
    let stackParts = parsedStack.split(':');
    let fullFilePath = stackParts[0];
    let relativeFilePath = fullFilePath.replace(process.cwd() + '/', '');
    let line = stackParts[1];

    if (Object.keys(logger.fileSpecificLogLevels).indexOf(fullFilePath) >= 0) {
        if (params.logLevelThreshold > logger.fileSpecificLogLevels[fullFilePath]){
            return;
        }
    }

    let msg = formatLog(levelName, logger, args, fullFilePath, relativeFilePath, line);

    if (params.destination === process.stdout || params.destination === process.stderr) {
        params.destination.write(msg);
    } else {
        params.destination.write(stripColorCodes(msg));
    }

    if (logger.levels[levelName].aggregator !== null) {
        logger.levels[levelName].aggregator.addLog(msg);
    } else {
        if (params.sendEmail === true) {
            emailLog(logger.emailSettings, msg, (err) => {
                if (err) {
                    console.error('Error Sending Email: %s', err);
                }
            });
        }
    }
};

module.exports = { processLog, formatLog, emailLog };