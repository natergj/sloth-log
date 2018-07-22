const logHandler = require('../logHandler.js');

class Aggregator {
    constructor(opts) {
        this.logs = [];
        this.emailSettings = opts.emailSettings;
    }

    send(cb) {
        let msg = '';
        if (this.logs.length > 0) {
            msg = this.logs.join('');
            this.logs = [];
        } else {
            msg = 'There were no logs added to the Aggregator';
        }

        logHandler.emailLog(this.emailSettings, msg, cb);
    }

    addLog(msg) {
        this.logs.push(msg);
    }
}

module.exports = Aggregator;