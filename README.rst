autoconfig
==========

Overview
--------

An npm module to simplify configuration in a Node.js environment using a configuration file.
Much of this library was based on `mkleehammer/autoconfig
<https://github.com/mkleehammer/autoconfig>` a Python configuration module using a config
file.  The biggest difference between the Python and Node.js versions is the order of the
parameters.  Node.js does not support default paramters without the use of harmony flags::

  var autoconfig = require('autoconfig');
  autoconfig.init();

With these simple lines before other imports, you can add variables to process.env which
provides global access to the configuration.

After using Python autoconfig and needing a configuration thats as easy for Node.js, I decided
to create this project for all of my Node.js projects.

(From mkleehammer/autoconfig) - the `12 Factor App <http://12factor.net>`_ recommends keeping
configuration in environment variables...

The problem that I see in the Node.js community is the developer or even the runtime machine
(QA/Production webservers) is they are using configuration on the command line or setting
environment variables to the running user.  The first problem is Windows vs macOS/Linux style
of setting the environment varable "SET NODE_ENV=development (or setx) vs export
NODE_ENV=development".  The other option is to set it directly in the run node command, but
that is even more confusing on Windows vs macOS/Linux "SET NODE_ENV=development && node
index.js vs NODE_ENV=development node index.js".

In the end, this usually this results into a config file on the computer or hard-coded (env =
process.env.NODE_ENV ? process.env.NODE_ENV : 'development') that is checked-in with some sort
of .dev .qa .prod in the filename and could easily be error prone. The computer "usually" never
changes environments mid-development cycle so it makes sense to have a configruation that is
loaded to the process.env taken from a file specific to this machine. Given the file's
location, it can be machine-wide (think QA only server with multiple projects) or project
specific, see below.


Simple Example
--------------

If no parameters are passed, the library searches for a file named ".config.json", starting
from the current directory (process.cwd()) and searching upwards.

Using well-known JSON format, this makes it easy to get started instantly

::

  {
    "env": {
      "NODE_ENV": "development",
      "DATABASE_URL": "postgresql://localhost/test?client_encoding=utf8"
    },
    "other": {
      "DATABASE_URL": "postgresql://otherhose/test?client_encoding=utf8"
    }
  }

The two entries NODE_ENV and DATABASE_URL are added to `process.env
<https://nodejs.org/api/process.html#process_process_env>` and are accessible anywhere in any
Node.js file by simply by using process.env.NODE_ENV OR process.env.DATABASE_URL.


Environment Variables
---------------------

If an "env" section exists, its items are always copied, but additional sections can be copied
also by passing them via the ``env`` keyword.  The value can be a section name or a list of
section names - parameters are environment name (env), filename, filepath or null to search upward::

  autoconfig.init(env='other');             # copy from env and other
  autoconfig.init(env=['other', 'another]); # copy from env, other, and another

Even though env is always copied to process.env, other environments (if passed in) override
env.  This means that in the "Simple Example" above, other's "DATABASE_URL" will be used when
using "process.env.DATABASE_URL" even though env contains the same configuration.


Locating The Config File
------------------------

The default behavior is to look for a file named ".config.json", starting in the `current working
directory <https://nodejs.org/api/process.html#process_process_cwd>`_ and searching upwards.  If
a file is not found, an exception is thrown.

The ``init`` function accepts two keywords to customize this:

filename
  Pass just a filename, such as "project.ini" to search for a different filename.

  Pass an absolute path name, such as "/etc/project.ini", to disable searching and use the
  filename as given.

searchfrom
  An optional directory to begin the search from.  If not provided, the default is the current
  working directory as provided by ``process.cwd()``.

  To simplify configuration, a path to a file can also be passed and the search will begin in
  the same directory as the file.  This is particularly handy for starting a search from the
  directory where the calling module is located::

    autoconfig.init(env='env', __dirname);

  This parameter is ignored if ``filename`` is an absolute path since no search is performed.
