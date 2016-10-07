
var autoconfig = require('../src/index');

autoconfig.init('.config.json', null, ['cs']);


var env = process.env.NODE_ENV, dburl = process.env.DATABASE_URL;
console.log(env, dburl);
