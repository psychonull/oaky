
var Base = require('./Base');

module.exports = Base.extend({

  initialize: function(){
    this.id = null;
    this.index = -1;
    this._components = {};
    this._events = {};
  },

  /* Components */

  on: function(evName, cb){
    this._events[evName] = cb;
  },

  add: function(type, initialValue){
    this._components[type] = initialValue;
  },

  get: function(type){
    //TODO: should not be able to change it (read-only access)
    return this._components[type];
  },

  getAll: function(){
    return Object.keys(this._components);
  },

  has: function(type){
    return this._components.hasOwnProperty(type);
  },

  is: function(type){
    return this.has(type);
  },

  set: function(type, newValue){
    this._components[type] = newValue;
    return this;
  },

  remove: function(type){
    delete this._components[type];
    return this;
  },

  clear: function(){
    for (var c in this._components){
      if (this._components.hasOwnProperty(c)){
        this.remove(c);
      }
    }
    return this;
  },

  /* Others */

  destroy: function(){
    this.clear();

    if (this._events.destroy){
      this._events.destroy(this);
    }
  }

});
