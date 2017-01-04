const MIN_TIME_SINCE_SUSPICIOUS_LOGIN = 60000;

module.exports = suspiciousLoginsEmitter =>
  (req, res, next) => {
    if (suspiciousLoginsEmitter.maxSuspiciousLoginsReached()) {
      const lastSuspiciousLogin = suspiciousLoginsEmitter.getLastSuspiciousLoginTime();
      const minTimeHasElapsed = new Date() - lastSuspiciousLogin > MIN_TIME_SINCE_SUSPICIOUS_LOGIN;

      if (minTimeHasElapsed) {
        suspiciousLoginsEmitter.resetSuspiciousLoginsCount();
      } else {
        res.send(500, 'Locked out from logging in. Please wait a short time');
      }
    }

    const { username, password } = req.body;

    if (typeof username === 'string' && typeof password === 'string') {
      return next();
    }

    suspiciousLoginsEmitter.recordSuspiciousLogin({ username, password });

    let errorMessage = 'Login details must be strings';

    if (suspiciousLoginsEmitter.maxSuspiciousLoginsReached()) {
      errorMessage = 'Too many suspicious login attempts. You will now be locked out for a short time.';
    }

    req.flash('error', errorMessage);

    return res.redirect('/login');
  };
