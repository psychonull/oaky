
var Game = require('../lib/Game');
var System = require('../lib/System');

var SystemTest = System.extend({

  uses: ['ca', 'cb'],

  initialize: function(options) {
    this.gravity = 0.5;
  },

  process: function(delta, entities) {

  }

});

module.exports = function(){

  describe("SystemSpec", function(){
    var game, testSystem, entities = [], spyProcess;

    before(function(){
      
      game = Game.create();
      testSystem = SystemTest.create();

      game.addSystem("test", testSystem);

      var entity;
      entity = game.entities.make();
      entity.add("ca");
      entity.add("cb");
      entity.add("cc");
      entities.push(entity);

      entity = game.entities.make();
      entity.add("ca");
      entity.add("cb");
      entities.push(entity);

      entity = game.entities.make();
      entity.add("cd");
      entities.push(entity);

      spyProcess = sinon.spy(testSystem, "process");
    });

    describe('System', function(){

      it ('should run the system with the corresponding entities', function(done){
        
        game.start();

        setTimeout(function(){
          game.stop();
          expect(spyProcess.called).to.be.ok();
          expect(spyProcess.args[0][1].length).to.be.equal(2);
          spyProcess.reset();
          done();
        }, 100);

      });
  
      it ('should run the system with the corresponding entities #2', function(done){
        entities[0].remove("cb");

        game.start();
        setTimeout(function(){
          game.stop();
          expect(spyProcess.called).to.be.ok();
          expect(spyProcess.args[0][1].length).to.be.equal(1);
          spyProcess.reset();
          done();
        }, 100);

      });

      it ('should not run a disabled system', function(done){
        
        game.disable("test");
        game.start();
        setTimeout(function(){
          game.stop();
          expect(spyProcess.called).to.be.equal(false);
          spyProcess.reset();
          done();
        }, 100);

      });

      it ('should run an enabled system', function(done){
        
        game.enable("test");
        game.start();
        setTimeout(function(){
          game.stop();
          expect(spyProcess.called).to.be.equal(true);
          spyProcess.reset();
          done();
        }, 100);

      });
  
    });
  });
};
