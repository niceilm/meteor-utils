Package.describe({
  name: 'flynn:utils',
  version: '0.0.7',
  // Brief, one-line summary of the package.
  summary: 'private use utils',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/niceilm/meteor-utils.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.2');

  api.export('NUTIL');
  api.export('CONSTANT');
  api.export('ROLES');
  api.export('ERRORS');

  api.use('stevezhu:lodash@3.10.1');
  api.use('http', 'server');
  api.use('alanning:roles@1.2.14', ['client', 'server']);
  api.imply('alanning:roles', ['client', 'server']);

  api.addFiles('utils.js');
  api.addFiles('utils_server.js', 'server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('flynn:utils');
  api.addFiles('utils-tests.js');
});
