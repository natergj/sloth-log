let util = require('util');
let os = require('os');
let colors = require('colors');
let dateformat = require('dateformat');
let nodemailer = require('nodemailer');
let ansiUp = require('ansi_up');
let stripColorCodes = require('stripcolorcodes');

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
            html: ansiUp.ansi_to_html(msg),
            subject: 'Message from ' + os.hostname()
        };

        transporter.sendMail(data, (err) => {
            if (err) {
                return cb(err);
            }
        });
    });
};

let formatLog = (level, logger, args) => {
    let params = logger.levels[level];
    
    let logDate = dateformat(new Date(), params.dateFormat);

    let errStack = (new Error()).stack;
    let stacklist = errStack.split('\n')[4].split('at ')[1];
    let regEx = /\(([^)]+)\)/;
    let parsedStack = regEx.exec(stacklist) ? regEx.exec(stacklist)[1] : stacklist;
    let stackParts = parsedStack.split(':');
    let fullFilePath = stackParts[0];
    let relativeFilePath = fullFilePath.replace(process.cwd() + '/', '');
    let line = stackParts[1];

    let logType = colors.blue('[') +
        colors[ params.color ].bold(level.toUpperCase()) +
        colors.blue(']');

    let logMessage = '';
    if (params.inspect === true) {
        let msgParts = [];
        Object.keys(args).forEach((i) => {
            msgParts.push(util.inspect(args[i], params.inspectOptions));
        });
        logMessage = msgParts.join(' ');
    } else {
        logMessage = util.format.apply(util.format, args);  
    }
    
    let log = eval('`' + params.format + '`'); 

    return `${log}\n`; 
};

let processLog = (level, logger, args) => {
    let params = logger.levels[level];
    let msg = formatLog(level, logger, args);

    if (params.writeSteam === process.stdout) {
        params.writeSteam.write(msg);
    } else {
        params.writeSteam.write(stripColorCodes(msg));
    }

    if (logger.levels[level].aggregator !== null) {
        logger.levels[level].aggregator.addLog(msg);
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

module.exports = {
    processLog: processLog,
    formatLog: formatLog,
    emailLog: emailLog
};