logger.setLogLevelForThisFile(2);

logger.crit();
logger.crit('## Log 3 ##');
logger.info('Info Line');
logger.warn('Warn Line');
logger.error('Error Line');
logger.inspect('Inspect Line');
logger.debug('Debug Line');
logger.crit('Something really broke');