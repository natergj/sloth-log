let logHandler = require('../logHandler.js');
let Aggregator = require('./Aggregator.js');
let _ = require('lodash');
let fs = require('fs');

let streamOpts = { flags: 'a', encoding: 'UTF-8' };

class Logger {
    constructor(opts) {
        this.defaultLevel = {
            'writeSteam': process.stdout,
            'dateFormat': 'm/dd/yy h:MM:ss TT Z',
            'color': 'gray',
            'sendEmail': false,
            'inspect': false,
            'inspectOptions': {},
            'logLevelThreshold': 5,
            'format': '${logType}[${logDate}][${relativeFilePath}:${line}] ${logMessage}',
            'aggregator': null   
        };

        this.logLevel = opts && typeof(opts.logLevel) === 'number' ? opts.logLevel : 5;

        this.levels = {
            'error': _.merge({}, this.defaultLevel, { color: 'red', 'logLevelThreshold': 1 }),
            'warn': _.merge({}, this.defaultLevel, { color: 'magenta', 'logLevelThreshold': 2 }),
            'info': _.merge({}, this.defaultLevel, { color: 'cyan', 'logLevelThreshold': 3 }),
            'inspect': _.merge({}, this.defaultLevel, { color: 'white', inspect: true, inspectOptions: { showHidden: true, depth: 2, colors: true }, 'logLevelThreshold': 4 }),
            'debug': _.merge({}, this.defaultLevel, { color: 'yellow', 'logLevelThreshold': 5 })
        };

        this.emailSettings = opts ? opts.emailSettings : null;

        Object.keys(this.levels).forEach((l) => {
            this[l] = function () {
                logHandler.processLog(l, this, arguments);
            };
        });
    }

    get logLevel() {
        return this.logLevel;
    }

    set logLevel(level) {
        if (typeof(level) !== 'number') {
            throw new TypeError('Logger logLevel must be a number');
        }
    }


    addCustomLogLevel(obj) {
        let l = obj.name;
        this.levels[obj.name] = this.defaultLevel;
        if (obj.filePath) {
            this.setLogFile(obj.name, obj.filePath);
        }
        this[l] = () => logHandler.processLog(l, this, arguments);
    }

    setLogDateFormat(logLevel, fmt) {
        if (!this.levels[logLevel]) {
            throw new TypeError(`${logLevel} does not exists as an available log level.`);
        } else if (typeof(fmt) !== 'string') {
            throw new TypeError('new log date format must be a string');
        } else {
            this.levels[logLevel].dateFormat = fmt;
        }
    }

    setLogFormat(logLevel, fmt) {
        if (!this.levels[logLevel]) {
            throw new TypeError(`${logLevel} does not exists as an available log level.`);
        } else if (typeof(fmt) !== 'string') {
            throw new TypeError('new log type format must be a string');
        } else {
            this.levels[logLevel].format = fmt;
        }
    }

    setLogFile(logLevel, filePath) {
        if (this.levels[logLevel.toLowerCase()]) {
            let thisWriteStream = fs.createWriteStream(filePath, streamOpts);
            this.levels[logLevel.toLowerCase()].writeSteam = thisWriteStream;
        } else {
            throw new TypeError(`${logLevel} does not exists as an available log level.`);
        }
    }

    setLogColor(logLevel, color) {
        let availableColors = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white', 'gray', 'grey'];
        if (availableColors.indexOf(color) < 0) {
            throw new TypeError(`${color} is not an available color. Please choose one of ${availableColors.join(', ')}`);
        } else if (!this.levels[logLevel.toLowerCase()]) {
            throw new TypeError(`${logLevel} does not exists as an available log level.`);
        } else {
            this.levels[logLevel.toLowerCase()].color = color;
        }
    }

    sendEmail(logLevel, sendEmail) {
        if (this.levels[logLevel.toLowerCase()]) {
            this.levels[logLevel.toLowerCase()].sendEmail = sendEmail;
        } else {
            throw new TypeError(`${logLevel} does not exists as an available log level.`);
        }
    }

    setLogLevelThreshold(logLevel, threshold) {
        if (typeof(threshold) !== 'number') {
            throw new TypeError('New threshold must be a number');
        } else {
            this.levels[logLevel].logLevelThreshold = threshold;
        }
    }

    setAggregator(level, aggregator) {
        if (aggregator instanceof Aggregator) {
            aggregator.emailSettings = this.emailSettings;
            this.levels[level].aggregator = aggregator;
        } else {
            throw new TypeError('aggregator must be an Aggregator');
        }
    }

}

module.exports = Logger;