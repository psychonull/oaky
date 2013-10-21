
var Base = require('./Base')
  , EntityManager = require('./EntityManager')
  , GameTime = require('./GameTime');

module.exports = Base.extend({

  initialize: function(/*options*/){

    this._components = {};
    this._systems = [];

    this.entities = EntityManager.create();
    this.gameTime = new GameTime();

    this.tLoop = null;
    this.paused = false;
    this.boundGameRun = this.gameRun.bind(this);
  },

  addSystem: function(system){
    system.game = this;
    this._systems.push(system);
  },

  use: function(name, component){
    if (this._components.hasOwnProperty(name)){
      throw new Error("component '" + name + "' already exist");
    }

    this._components[name] = component;
  },

  process: function(){
    var time = this.gameTime.frameTime;

    for(var i=0; i<this._systems.length; i++){
      var system = this._systems[i];
      var entities = this.entities._entities;

      if (system.has && system.has.length > 0) {
        entities = this.entities.get(system.has);
      }

      system.process(time, entities);
    }
  },

  loop: function(){
    this.process();
  },

  start: function(){
    this.paused = false;
    this.gameRun();
  },

  stop: function(){
    this.paused = true;
    window.cancelAnimationFrame(this.tLoop);
  },

  gameRun: function(){
    if (this.gameTime.tick()) { this.loop(); }
    this.tLoop = window.requestAnimationFrame(this.boundGameRun);
  }

});
