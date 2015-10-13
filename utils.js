NUTIL = {};

CONSTANT = {
  BUILD_VERSION: __meteor_runtime_config__.autoupdateVersion,
  settings: Meteor.settings && Meteor.settings.public ? Meteor.settings.public : {}
};

ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user'
};

ERRORS = {
  BAD_PARAMETER: 'bad-parameter',
  NOT_AUTHENTICATED: 'not-authenticated',
  NOT_AUTHORIZED: 'not-authorized',
  NOT_EXIST: 'not-exist',
  SERVER_ERROR: 'server-error'
};

NUTIL.finder = finder;
NUTIL.isInteger = isInteger;
NUTIL.errorCode = errorCode;
NUTIL.normalizeDate = normalizeDate;
NUTIL.checkChange = checkChange;
NUTIL.checkAdmin = checkAdmin;
NUTIL.checkLogin = checkLogin;

function isInteger(num) {
  return (num % 1) === 0;
}

function finder(targetValue, sources) {
  return new Finder(targetValue, sources);
}

function Finder(_targetValue, _sources) {
  var _findKey = "value";
  var _returnKey = "label";
  _sources = _sources || [];

  this.findKey = function(findKey) {
    _findKey = findKey;
    return this;
  };
  this.returnKey = function(returnKey) {
    _returnKey = returnKey;
    return this;
  };
  this.source = function(sources) {
    _sources = sources;
    return this;
  };
  this.find = function() {
    var item = _.find(_sources, function(source) {
      return source[_findKey] === _targetValue;
    });
    if(item && item[_returnKey]) {
      if(_.isFunction(item[_returnKey])) {
        return item[_returnKey]();
      }
      return item[_returnKey];
    }
    return "";
  };
}

function errorCode(code, message) {
  switch(code) {
    case 400:
      return new Meteor.Error(ERRORS.BAD_PARAMETER, message || '파라미터가 잘못되었습니다.');
    case 401:
      return new Meteor.Error(ERRORS.NOT_AUTHENTICATED, message || '로그인이 필요합니다.');
    case 403:
      return new Meteor.Error(ERRORS.NOT_AUTHORIZED, message || '권한이 앖습니다.');
      break;
    case 404:
      return new Meteor.Error(ERRORS.NOT_EXIST, message || '아이템이 없습니다.');
    case 500:
      return new Meteor.Error(ERRORS.SERVER_ERROR, message || '서버가 아픕니다.');
  }
}

/**
 *
 * @param {Date} date
 */
function normalizeDate(date, format) {
  return new Date(moment(date).format(format || "YYYY-MM-DD"));
}

function checkAdmin(afterFn) {
  check(afterFn, Function);
  if(!Roles.userIsInRole(this.userId, [ROLES.ADMIN, ROLES.MANAGER])) {
    throw NUTIL.errorCode(403, "권한이 없습니다.");
  }
  return afterFn.apply(this, Array.prototype.slice.call(arguments, 1));
}

function checkLogin(afterFn) {
  check(afterFn, Function);
  if(!this.userId) {
    throw NUTIL.errorCode(401, "로그인이 필요합니다.");
  }
  return afterFn.apply(this, Array.prototype.slice.call(arguments, 1));
}

function checkChange(afterFn, newValue, oldValue) {
  check(afterFn, Function);
  if(newValue === oldValue) {
    return;
  }
  return afterFn.apply(this, Array.prototype.slice.call(arguments, 1));
}


