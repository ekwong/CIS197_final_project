#!/usr/bin/env node
var app = require('../app');
require('../db/mongo');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d', server.address().port);
});
