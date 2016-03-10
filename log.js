var SuperLogger = require('./index.js');

/*
var logger = new SuperLogger.Logger({         
    emailSettings: {   
        from: 'noreply@seas.harvard.edu',
        to: 'nater@seas.harvard.edu',
        transportConfig: {
            host: 'smtp-outbound.seas.harvard.edu',
            port: 25,
            secure: false,
            ignoreTLS: true
        }
    }
});

var aggregator = new SuperLogger.Aggregator();
logger.setAggregator('error', aggregator);
logger.setAggregator('info', aggregator);

logger.setLogColor('info', 'green');
logger.setLogFile('error', 'error.log');
logger.sendEmail('error', true);

logger.error('error line 1');
logger.error('error line 2');
logger.error('error line 3');

logger.warn('warn line');
logger.info('info line');
logger.inspect('inspect line');
logger.debug('debug line');

var obj = { 'a': '1', 'b': '2', 'c': [1, 2, 3] };
obj.self = obj;
var txt = 'Text';


logger.inspect('msg', txt, obj);

aggregator.send();
*/


var logger = new SuperLogger.Logger();

logger.error('Error Log Line');
logger.debug('Debug Log Line');
logger.info('Line with variable: %s', 'stringVar');