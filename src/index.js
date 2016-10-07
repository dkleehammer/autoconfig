"use strict";

var path = require('path'), fs = require('fs');

function init(filename, searchfrom, env) {
  filename = filename ? filename : '.config.json',
  searchfrom = searchfrom ? searchfrom : null,
  env = env ? env : null;

  try {
    var fqn = _locate_config(filename, searchfrom);

    // parse config file (read directly from env if not null)
    _copy_env(fqn, env);
  } catch (e) {
    console.error(e);
  }
}

function _copy_env(fqn, env) {
  // env is always added, but overriden by any specific env(s) passed in
  var envs = ['env'];

  for (var e in env) {
    if (!envs[env[e]]) {
      envs.push(env[e]);
    }
  }

  // read the config file
  var config = require(fqn);

  for (var en in envs) {
    var section = config[envs[en]];

    for (var conf in section) {
      process.env[conf] = section[conf];
    }
  }
}

function _locate_config(filename, searchfrom) {
  if (filename.indexOf(path.sep) != -1 && searchfrom.indexOf(path.sep) != -1) {
    throw 'Cannot provide a path in `filename` and a `searchfrom` value.';
  }

  if (path.isAbsolute(filename)) {
    if (!fs.existsSync(filename)) {
      throw 'Did not find configuration file.  filename=' + filename;
    }

    return filename;
  }

  var p = path.resolve(searchfrom || process.cwd());

  while (1) {
    var stats = fs.statSync(p);

    if (stats.isDirectory(p)) {
      var fqn = path.join(p, filename);

      try {
        var fqn_stats = fs.statSync(fqn);
        if (fqn_stats.isFile(fqn) && !fqn_stats.isDirectory(fqn)) {
          return fqn;
        }
      } catch (e) {}
    }

    var parent = path.dirname(p);
    if (parent == p) {
      throw 'Did not find configuration file.  filename=' + filename + ' searchfrom=' + searchfrom;
    }
    p = parent;
  }
}

module.exports = {
  init: init,
  _locate_config: _locate_config
};
