const EventEmitter = require('events');

const MAX_SUSPICIOUS_LOGINS = 3;

function handleSuspiciousLogin(loginDetails) {
  Object.assign(loginDetails, { timestamp: new Date() });
  this.suspiciousLogins.push(loginDetails);
  this.suspiciousLoginsCount += 1;
}

module.exports = class SuspiciousLoginsEmitter extends EventEmitter {
  constructor() {
    super();

    this.suspiciousLoginsCount = 0;
    this.suspiciousLogins = [];

    this.on('suspicious-login', handleSuspiciousLogin);
  }

  recordSuspiciousLogin(loginDetails) {
    this.emit('suspicious-login', loginDetails);
  }

  getSuspiciousLoginsCount() {
    return this.suspiciousLoginsCount;
  }

  getSuspiciousLogins() {
    return this.suspiciousLogins;
  }

  getLastSuspiciousLoginTime() {
    const lastSuspiciousLogin = this.suspiciousLogins[this.suspiciousLogins.length];
    return lastSuspiciousLogin.timestamp;
  }

  resetSuspiciousLoginsCount() {
    this.suspiciousLoginsCount = 0;
  }

  maxSuspiciousLoginsReached() {
    return this.suspiciousLoginsCount === MAX_SUSPICIOUS_LOGINS;
  }
};
