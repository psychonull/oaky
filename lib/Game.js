
var Base = require('./Base')
  , EntityManager = require('./EntityManager')
  , GameTime = require('./GameTime');

module.exports = Base.extend({

  initialize: function(options){
    options = options || {};

    this._components = {};
    this._systems = [];

    this.entities = EntityManager.create(options.poolSize);

    this.gameTime = new GameTime();

    this.tLoop = null;
    this.paused = false;
    this.boundGameRun = this.gameRun.bind(this);
    this.ents = [];
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

    for(var i=0; i<this._systems.length; i++){
      var system = this._systems[i];
      var entities = this.entities.pool.elems;

      if (system.has && system.has.length > 0) {
        entities = this.entities.get(system.has);
        system.process(this.gameTime.frameTime, entities);
      }
      else {
        this.ents.length = 0;
        for(var j=entities.length; j--;){
          if (entities[j].id){
            this.ents.push(entities[j]);
          }
        }
        system.process(this.gameTime.frameTime, this.ents);
      }
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
