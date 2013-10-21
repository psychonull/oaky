// TODO: Remove

module.exports = function(){

  var 
      engine = require('../lib/')
    , movementSystem = require('./mockups/systems/movement')
    , positionComponent = require('./mockups/components/position')
    , velocityComponent = require('./mockups/components/velocity')
    , playerEntity = require('./mockups/entities/player');

  describe('Engine', function(){

    describe('#use', function(){
      
      it ('should register a System when is called with one parameter', function(){
        engine.use(movementSystem);
        expect(engine.systems.length).to.be.equal(1);
      });

      it ('should throw an error if is not a valid System', function(){
        expect(function(){
          engine.use({ invalidProcess: function(){ } });
        }).to.throwError();
      });

      it ('should register a Component when is called with 2 parameters', function(){
        engine.use('position', positionComponent);
        engine.use('velocity', velocityComponent);

        expect(engine.components.length).to.be.equal(2);
        
        expect(engine.cById["c1"]).to.be.equal("position");
        expect(engine.cById["c2"]).to.be.equal("velocity");

        expect(engine.cByName["position"]).to.be.equal("c1");
        expect(engine.cByName["velocity"]).to.be.equal("c2");
      });

    });

    describe('#register', function(){

      it ('should register an Entity', function(){
        engine.register('player1', playerEntity);
        
        expect(engine.entitiesByC["c1"].indexOf("player1")).to.be.greaterThan(-1);
        expect(engine.entitiesByC["c2"].indexOf("player1")).to.be.greaterThan(-1);
      });

      it ('should register another Entity', function(){
        engine.register('player2', playerEntity);
        
        expect(engine.entitiesByC["c1"].indexOf("player2")).to.be.greaterThan(-1);
        expect(engine.entitiesByC["c2"].indexOf("player2")).to.be.greaterThan(-1);
      });

    });

    describe('#create', function(){

      it ('should create an Entity', function(){

        var pl = engine.create('player1', {
          position: {
            x: 100,
            y: 200
          },
          velocity: {
            dy: 50
          }
        });

        expect(engine.entitiesByName["player1"]).to.be.an('array');
        expect(engine.entitiesByName["player1"].length).to.be.equal(1);
        expect(engine.entitiesByName["player1"]).to.have.property('id');
        expect(engine.entitiesByName["player1"].id).to.be.greaterThan(0);
      });

    });

  });

};
