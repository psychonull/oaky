
var System = require('../lib/System');
var MovementSystem = System.extend({

  initialize: function(options){
    this.gravity = options.gravity;
  },

  process: function(){ }

});

module.exports = function(){

  var Game = require('../lib/Game');
  
  describe('Game', function(){
    var game;

    before(function(){
      game = Game.create();
    });

    describe('#addSystem', function(){
      
      it ('should allow to add systems', function(){
        expect(game.addSystem).to.be.a('function');

        game.addSystem(MovementSystem.create({ gravity: 1.5 }));

        expect(game._systems).to.be.an('array');
        expect(game._systems.length).to.be.equal(1);

        expect(game._systems[0].gravity).to.be.equal(1.5);
      });

    });

    describe('#use', function(){

      it ('should allow to register one component', function(){
        expect(game.use).to.be.a('function');

        var defaultPosition = { x: 0, y:0 };
        game.use('position', defaultPosition);
        expect(game._components['position']).to.be.eql(defaultPosition);
      });

      it ('should throw an Error if the component already exists', function(){
        expect(function(){
          game.use('position', {});  
        }).to.throwError();
      });

      it ('should allow to register a collection of components');

    });

    describe('#start', function(){
      it('should expose a start method to run the game loop', function(){
        expect(game.start).to.be.a('function');
      });
    });

    describe('#stop', function(){
      it('should expose a stop method to stop the game loop', function(){
        expect(game.stop).to.be.a('function');
      });
    });


  });
};
