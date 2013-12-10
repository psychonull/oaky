
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
      game = Game.create({
        testOption: 12345,
        testOptObj: {
          x: 10,
          y: 60
        }
      });

      expect(game.testOption).to.be.equal(12345);
      expect(game.testOptObj.x).to.be.equal(10);
      expect(game.testOptObj.y).to.be.equal(60);
    });

    describe('#addSystem', function(){
      
      it ('should allow to add systems', function(){
        expect(game.addSystem).to.be.a('function');

        game.addSystem("movement", MovementSystem.create({ gravity: 1.5 }));

        expect(game._systems).to.be.an('array');
        expect(game._systems.length).to.be.equal(1);

        expect(game._systemsByName["movement"]).to.be.ok();
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

    });

    describe('#disable', function(){
      it ('should allow to disable a system by name', function(){
        expect(game.disable).to.be.a('function');

        game.disable("movement");
        expect(game._systems[0].enabled).to.be.equal(false);
      });
    });

    describe('#enable', function(){
      it ('should allow to enable a system by name', function(){
        expect(game.enable).to.be.a('function');

        game.enable("movement");
        expect(game._systems[0].enabled).to.be.equal(true);
      });
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

    describe('#destroy', function(){
      it('should expose a destroy method to clear the entire game', function(){
        expect(game.destroy).to.be.a('function');
        
        var dtBefore, dtAfter;

        game.on("before:destroy", function(){
          dtBefore = new Date();
        });

        game.on("after:destroy", function(){
          dtAfter = new Date();
        });

        game.destroy();

        expect(game._components).to.be.equal(null);
        expect(dtBefore).to.be.ok();
        expect(dtAfter).to.be.ok();
        expect(dtAfter.getTime() + dtAfter.getMilliseconds())
          .to.be.greaterThan(dtBefore.getTime() + dtBefore.getMilliseconds());
      });
    });

  });
};
