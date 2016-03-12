let SlothLogger = require('./index.js');

globals.logger = new SlothLogger.Logger({
    levels: {
        info: {
            'destination': 'logs/info.log'
        },
        warn: {
            'destination': 'logs/warn.log'
        },
        crit: {
            'destination': process.stderr,
            'dateFormat': 'm/dd/yy h:MM:ss TT Z',
            'logLevelThreshold': 0
        }
    }
});

logger.info('Info Line');
logger.warn('Warn Line');
logger.error('Error Line');
logger.inspect('Inspect Line');
logger.debug('Debug Line');
logger.crit('Something really broke');


logger.info('Info Line');
logger.warn('Warn Line');
logger.error('Error Line');
logger.inspect('Inspect Line');
logger.debug('Debug Line');
logger.crit('Something really broke');


require('./log2.js');
require('./log3.js');