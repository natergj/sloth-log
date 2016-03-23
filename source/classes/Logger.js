let logHandler = require('../logHandler.js');
let Aggregator = require('./Aggregator.js');
let _ = require('lodash');
let fs = require('fs');

let streamOpts = { flags: 'a', encoding: 'UTF-8' };
let defaultLevel = {
    'destination': process.stdout,
    'dateFormat': 'm/dd/yy h:MM:ss TT Z',
    'color': 'gray',
    'sendEmail': false,
    'inspect': false,
    'inspectOptions': {},
    'logLevelThreshold': 4,
    'format': '${logLevelName}[${logDate}][${relativeFilePath}:${line}] ${logMessage}',
    'aggregator': null   
};

class Logger {
    constructor(opts) {
        opts = opts ? opts : {};

        // Currently set logLevel
        this.logLevel = opts && typeof(opts.logLevel) === 'number' ? opts.logLevel : 4;

        this.fileSpecificLogLevels = {};

        this.levels = {
            'error': _.merge({}, 
                defaultLevel, 
                { color: 'red', 'logLevelThreshold': 1 }
            ),
            'warn': _.merge({}, 
                defaultLevel, 
                { color: 'magenta', 'logLevelThreshold': 2 }
            ),
            'info': _.merge({}, 
                defaultLevel, 
                { color: 'cyan', 'logLevelThreshold': 3 }
            ),
            'inspect': _.merge({}, 
                defaultLevel, 
                { color: 'white', inspect: true, inspectOptions: { showHidden: true, depth: 2, colors: true }, 'logLevelThreshold': 4 }
            ),
            'debug': _.merge({}, 
                defaultLevel, 
                { color: 'yellow', 'logLevelThreshold': 4 }
            )
        };

        // Add any log levels sent to constructor or update existing log levels
        if (opts.levels instanceof Object) {
            Object.keys(opts.levels).forEach((l) => {
                if (this.levels[l]) {
                    this.levels[l] = _.merge(this.levels[l], opts.levels[l]);
                } else {    
                    this.levels[l] = _.merge({}, defaultLevel, opts.levels[l]);
                }
            });
        }

        // set emailSetting if sent to constructor
        this.emailSettings = opts.emailSettings ? opts.emailSettings : null;

        // Generate functions with names of levels to handle logs
        Object.keys(this.levels).forEach((l) => {
            if (typeof(this.levels[l].destination) === 'string') {
                this.levels[l].destination = new fs.createWriteStream(this.levels[l].destination, streamOpts);
            }

            this[l] = function () {
                logHandler.processLog(l, this, arguments);
            };
        });
    }

    addCustomLogLevel(obj) {
        let l = obj.name;
        this.levels[obj.name] = defaultLevel;
        if (obj.filePath) {
            this.setLogFile(obj.name, obj.filePath);
        }
        this[l] = () => logHandler.processLog(l, this, arguments);
    }

    setLevelProps(logLevel, props) {
        if (this.levels[logLevel.toLowerCase()]) {
            this.levels[logLevel.toLowerCase()] = _.merge({}, defaultLevel, this.levels[logLevel.toLowerCase()], props);
        } else {
            throw new TypeError(`${logLevel} does not exists as an available log level.`);
        }
    }

    sendEmail(logLevel, sendEmail) {
        if (this.levels[logLevel.toLowerCase()]) {
            this.levels[logLevel.toLowerCase()].sendEmail = sendEmail;
        } else {
            throw new TypeError(`${logLevel} does not exists as an available log level.`);
        }
    }

    setLogLevelForThisFile(level) {

        // Get file calling function
        let errStack = (new Error()).stack;
        let stacklist = errStack.split('\n')[2].split('at ')[1];
        let regEx = /\(([^)]+)\)/;
        let parsedStack = regEx.exec(stacklist) ? regEx.exec(stacklist)[1] : stacklist;
        let stackParts = parsedStack.split(':');
        let fullFilePath = stackParts[0];   

        this.fileSpecificLogLevels[fullFilePath] = level;     
    }
}

module.exports = Logger;