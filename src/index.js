"use strict";

let path = require('path'), fs = require('fs');

function init(env=null, filename='.config.json', searchfrom=null) {
  try {
    let fqn = _locate_config(filename, searchfrom);

    // parse config file (read directly from env if not null)
    _copy_env(fqn, env);
  } catch (e) {
    throw e;
  }
}

function _copy_env(fqn, env) {
  // TODO:: revist to es2015-ify

  // env is always added, but overriden by any specific env(s) passed in
  let envs = [];

  if (env && typeof(env) != 'string') {
    env.forEach(e => {
      if (!envs[e]) {
        envs.push(e);
      }
    });
  } else if (typeof(env) == 'string') {
    envs.push(env);
  }

  // read the config file
  let config = require(fqn);

  if (config['env'] !== undefined) {
    envs.unshift('env');
  }

  // iterate the envrionments and add them to process.env
  for (let en in envs) {
    let section = config[envs[en]];

    for (let conf in section) {
      process.env[conf] = section[conf];
    }
  }
}

function _locate_config(filename, searchfrom) {
  if ((filename !== null && filename.indexOf(path.sep) != -1) && (searchfrom !== null && searchfrom.indexOf(path.sep) != -1)) {
    throw `Cannot provide a path in ${filename} and a ${searchfrom} value.`;
  }

  if (path.isAbsolute(filename)) {
    if (!fs.existsSync(filename)) {
      throw `Did not find configuration file.  filename=${filename}`;
    }
    return filename;
  }

  let p = path.resolve(searchfrom || process.cwd());

  while (1) {
    let stats = fs.statSync(p);

    if (stats.isDirectory(p)) {
      let fqn = path.join(p, filename);

      try {
        let fqn_stats = fs.statSync(fqn);

        if (fqn_stats.isFile(fqn) && !fqn_stats.isDirectory(fqn)) {
          return fqn;
        }
      } catch (e) {}
    }

    let parent = path.dirname(p);
    if (parent == p) {
      throw `Did not find configuration file.  filename=${filename} searchfrom=${searchfrom}`;
    }
    p = parent;
  }
}

module.exports = {
  init: init
};
