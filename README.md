## Sloth Logger
Logger with custom levels, colors, formats, output options and more

## Installation

    npm install super-logger


## Basic Usage
SlothLogger has 5 log types by default and the log level is set to show all logs. The default log types are:
error, warn, info, inspect, debug.

By default, logs are output to the console.

```javascript
var SlothLogger = require('super-logger');
var logger = new SlothLogger.Logger();

logger.error('Error Log Line');
logger.debug('Debug Log Line');
logger.info('Line with variable: %s', 'stringVar');
```
### Output

```bash
[ERROR][3/10/16 12:20:26 PM EST][log.js:47] Error Log Line
[DEBUG][3/10/16 12:20:26 PM EST][log.js:48] Debug Log Line
[INFO][3/10/16 12:59:26 PM EST][log.js:49] Line with variable: stringVar
```
## Set custom log line format
Custom log line formats are supported. Format string should be in the format of javascript template literals without the enclosign ` marks. Available options are:   
logType: type of log (i.e. error, warn, etc) in all caps enclosed with []   
logDate: formatted date. Uses [dateformat](https://www.npmjs.com/package/dateformat) as formatter and supports custom format. Defaults to 'm/dd/yy h:MM:ss TT Z'   
fullFilePath: the full path to the file where the logger was called   
relativeFilePath: the path relative to the current working directory where node was executed   
line: the line of the file where the logger was called   
logMessage: the formatted log entry 

```javascript
var SlothLogger = require('super-logger');
var logger = new SlothLogger.Logger();

logger.setLogFormat('error', '${logLevel}[${logDate}][${fullFilePath}:${line}] ${logMessage}');
```

### logDate format
```javascript
var SlothLogger = require('super-logger');
var logger = new SlothLogger.Logger();

logger.setLogDateFormat('error', 'dddd, mmmm dS, yyyy, h:MM:ss TT');

```

## Set log level
By Default, the log level is set to 5 and the built-in log types have the following log thresholds. By changing the logLevel to 3, only error, warn, and info logs will be logged.

error: 1   
warn: 2   
info: 3   
inspect: 4   
error: 5   


```javascript
var SlothLogger = require('super-logger');
var logger = new SlothLogger.Logger();

logger.logLevel = 4;
```

## Set log type log level threshold
```javascript
var SlothLogger = require('super-logger');
var logger = new SlothLogger.Logger();

setLogLevelThreshold('info',5);
```

## Log to file
You can also specify that you wish to log an individual level to a file rather than the console.

```javascript
var SlothLogger = require('super-logger');
var logger = new SlothLogger.Logger();
logger.setLogFile('error', __dirname + '/logs/error.log');
```

## Change console log color
Colors shown in the color for each log type can be customized
Available options are: black, red, green, yellow, blue, magenta, cyan, white, gray, grey.

```javascript
var SlothLogger = require('super-logger');
var logger = new SlothLogger.Logger();
logger.setLogColor('error', 'orange');
```

## Send an email notification for each log item
By providing your logger with email settings, you can set each log type to send an email every time the logger is called.

SlothLogger uses [nodemailer](https://www.npmjs.com/package/nodemailer) for mailing. Options for nodemailer transport can be found in their documentation.

```javascript
var SlothLogger = require('super-logger');
var logger = new SlothLogger.Logger({
	emailSettings: {   
        from: 'noreply@mycompany.com',
        to: 'admin@mycompany.com',
        transportConfig: {
            host: 'smtp.mycompany.com',
            port: 25
        }
    }
});
logger.sendEmail('error', true);
```

## Set Log Email Aggregator
You can also set a log aggregator to collect log entries and send them in bulk. sendEmail attributes of log types are ignored if an aggregator is assigned. Log entries will always be emailed and they will only be emailed once send() has been called on the Aggregator.

```javascript
var SlothLogger = require('super-logger');
var logger = new SlothLogger.Logger({
	emailSettings: {   
        from: 'noreply@mycompany.com',
        to: 'admin@mycompany.com',
        transportConfig: {
            host: 'smtp.mycompany.com',
            port: 25
        }
    }
});
var aggregator = new SlothLogger.Aggregator();
logger.setAggregator('error', aggregator);

logger.error('add this line to error log');
aggregator.send();
```
