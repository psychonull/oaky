
var Base = require('./Base')
  , EntityManager = require('./EntityManager')
  , GameTime = require('./GameTime');

module.exports = Base.extend({

  initialize: function(options){

    for (var opt in options){
      if (options.hasOwnProperty(opt)){
        this[opt] = options[opt];
      }
    }

    this._components = {};

    this._systems = [];
    this._systemsByName = {};

    this.entities = EntityManager.create();

    this.gameTime = new GameTime();

    this.tLoop = null;
    this.paused = false;
    this.boundGameRun = this.gameRun.bind(this);
  },

  addSystem: function(name, system){
    if (!system){
      throw new Error("A system was expected");
    }

    if (this._systemsByName.hasOwnProperty(name)){
      throw new Error("Duplicated system name " + name); 
    }

    this._systemsByName[name] = system;
    this._systems.push(system);
    system.game = this;  
  },

  use: function(name, component){
    if (this._components.hasOwnProperty(name)){
      throw new Error("component '" + name + "' already exist");
    }

    this._components[name] = component;
  },

  process: function(){

    for(var i=0; i<this._systems.length; i++){
      var system = this._systems[i];
      
      if (!system.enabled){
        continue;
      }

      if (system.uses && system.uses.length > 0) {
        var entities = this.entities.get(system.uses);
        system.process(this.gameTime.frameTime, entities);
      }
      else {
        system.process(this.gameTime.frameTime);
      }
    }
  },

  enable: function(systemName){
    if (this._systemsByName.hasOwnProperty(systemName)){
      this._systemsByName[systemName].enabled = true;
    }
  },

  disable: function(systemName){
    if (this._systemsByName.hasOwnProperty(systemName)){
      this._systemsByName[systemName].enabled = false;
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
