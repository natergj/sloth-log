const SlothLogger = require('../index.js');
const fs = require('fs');

module.exports = new SlothLogger.Logger({
  levels: {
    info: {
      'destination': 'logs/info/info.log'
    },
    warn: {
      'destination': 'logs/warn/warn.log'
    },
    crit: {
      'destination': process.stderr,
      'dateFormat': 'm/dd/yy h:MM:ss TT Z',
      'logLevelThreshold': 0
    }
  }
});