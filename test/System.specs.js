
var Game = require('../lib/Game');
var System = require('../lib/System');

var SystemTest = System.extend({

  has: ['position', 'velocity'],

  initialize: function(options) {
    this.gravity = 0.5;
  },

  process: function(delta, entities) {

  }

});

module.exports = function(){
  var game;

  before(function(){

    game = Game.create({
      poolSize: 500
    });

    game.addSystem(SystemTest.create());
    
  });

  describe('System', function(){

    it ('should test the systems', function(){
      
    });

  });

};
