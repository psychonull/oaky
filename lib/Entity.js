
var Base = require('./Base');

module.exports = Base.extend({

  initialize: function(options){
    this.id = options.id;
    this.tags = [];
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

  set: function(type, newValue){
    this._components[type] = newValue;
    return this;
  },

  remove: function(type){
    delete this._components[type];
    return this;
  },

  /* TAGS */

  addTag: function(tag){
    if (!this.hasTag(tag)){
      this.tags.push(tag);
    }
    return this;
  },

  removeTag: function(tag){
    if (this.hasTag(tag)){
      this.tags.splice(this.tags.indexOf(tag), 1);
    }
    return this;
  },

  hasTag: function(tag){
    return this.tags.indexOf(tag) > -1 ? true : false;
  },

  /* Others */

  destroy: function(){
    if (this._events.destroy){
      this._events.destroy(this.id);
    }
  }

});
