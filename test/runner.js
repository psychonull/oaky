
require('./Entity.specs')();
require('./EntityManager.specs')();
require('./System.specs')();
require('./Game.specs')();
require('./Engine.specs')();

if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
else { mocha.run(); }
