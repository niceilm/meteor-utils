NUTIL.verifyCaptcha = verifyCaptcha;
NUTIL.isDevelopment = isDevelopment;
NUTIL.fastResponse = fastResponse;
NUTIL.normalizeLimit = normalizeLimit;

function fastResponse(afterFn) {
  $log.debug("fastResponse : ", arguments);
  check(afterFn, Function);
  var passArguments = Array.prototype.slice.call(arguments, 1);
  var self = this;

  Meteor.defer(function() {
    afterFn.apply(self, passArguments);
  });
}

function verifyCaptcha(remoteip, response) {
  return HTTP.post('https://www.google.com/recaptcha/api/siteverify', {
    params: {
      secret: Meteor.settings.recapcha.privatekey,
      response: response,
      remoteip: remoteip
    }
  });
}

function isDevelopment() {
  return process.env.NODE_ENV === "development";
}

/**
 *
 * @param {Number} limit
 * @param {Number} unit
 * @returns {Number}
 */
function normalizeLimit(limit, unit) {
  unit = unit || 30;

  if(limit < unit) {
    limit = unit;
  }

  var diff = limit % unit;

  if(diff != 0) {
    limit = limit - diff + unit;
  }

  return limit;
}