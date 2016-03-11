let logHandler = require('../logHandler.js');

class Aggregator {
    constructor() {
        this.logs = [];
        this.emailSettings = null;
    }

    send() {
        if (this.logs.length > 0) {
            let msg = this.logs.join('');
            logHandler.emailLog(this.emailSettings, msg, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            this.logs = [];
        }
    }

    addLog(msg) {
        this.logs.push(msg);
    }
}

module.exports = Aggregator;