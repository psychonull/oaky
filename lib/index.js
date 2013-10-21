
var Game = require('./Game');

window.oaky = {
  createGame: function(options){
    return Game.create(options);
  },
  System: require('./System')
};
