import logger from './logger';
logger.setLogLevelForThisFile(5);

logger.crit();
logger.crit('## Log 2 - All logs written ##');
logger.info('Info Line');
logger.warn('Warn Line');
logger.error('Error Line');
logger.inspect('Inspect Line');
logger.debug('Debug Line');
logger.crit('Something really broke');