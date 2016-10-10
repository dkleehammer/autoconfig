
var assert = require('assert'), autoconfig = require('../lib/index');

describe('env', function() {
  describe('# should load env', function() {
    it('process.env.NODE_DEV should be development', function() {
      // load autoconfig init
      autoconfig.init('env', './test/.config.json');

      assert.equal('development', process.env.NODE_ENV);
    });
  });

  describe('# should load both', function() {
    it('process.env.NODE_DEV should be testing', function() {
      // load autoconfig init env=other
      autoconfig.init('other', './test/.config.json');

      assert.equal('testing', process.env.NODE_ENV);
    });
  });

  describe('# No file find', function() {
    it('should throw exception', function() {
      assert.throws(function() {
        autoconfig.init();
      }, 'Did not find configuration file.  filename=.config.json searchfrom=null');
    });
  });

});
