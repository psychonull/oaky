
var Game = require('./Game');

window.oaky = window.oaky || {};

window.oaky.createGame = function(options){
  return Game.create(options);
};

window.oaky.System = require('./System');
