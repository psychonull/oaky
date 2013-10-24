
var Base = require('./Base')
  , Entity = require('./Entity');

module.exports = Base.extend({

  initialize: function(options){
    options = options || {};
    this._entities = [];
    this.lastId = 0;

    this.poolSize = 0;
    this.marker = 0;

    var poolSize = (options.poolSize) || 1000;
    this.expandPool(poolSize);

    this.poolSize = poolSize;
  },

  make: function(){
    if (this.marker >= this.poolSize) {
      this.expandPool(this.poolSize * 2);
    }

    var obj = this._entities[this.marker++];
    obj.index = this.marker - 1;
    obj.id = ++this.lastId;

    return obj;
  },

  getById: function(id){
    for(var i=0; i<this._entities.length; i++){
      if (this._entities[i].id === id){
        return this._entities[i];
      }
    }

    return null;
  },

  getByComponents: function(components){
    var found = [];

    function isValid(comps){
      for(var j=0; j<components.length; j++){
        if (comps.indexOf(components[j]) === -1){
          return false;
        }
      }

      return true;
    }

    for(var i=this._entities.length; i--;){
      var comps = this._entities[i].getAll();
      if (this._entities[i].id && isValid(comps)){
        found.push(this._entities[i]);
      }
    }

    return found;
  },

  get: function(idOrComponent){
    if (!isNaN(idOrComponent)){
      return this.getById(idOrComponent);
    }
    else {
      var compos = Array.isArray(idOrComponent) ? idOrComponent : [idOrComponent];
      return this.getByComponents(compos);
    }
  },

  getTagged: function(tag){
    var found = [];
    var tags = Array.isArray(tag) ? tag : [tag];

    for (var i = this._entities.length; i--;) {
      if (this._entities[i].id){
        for(var j=tags.length; j--;){
          if (this._entities[i].hasTag(tags[j])){
            found.push(this._entities[i]);
          }
        }
      }
    }

    return found;
  },

  expandPool: function(newSize) {

    var self = this;
    function destroy(entity){
      self.destroyEntity(entity);
    }

    for (var i = newSize - this.poolSize; i--;) {
      var obj = Entity.create();
      obj.on('destroy', destroy);
      this._entities.push(obj);
    }

    this.poolSize = newSize;
  },

  destroyEntity: function(entity){
    this.marker--;

    var end = this._entities[this.marker];
    var endIndex = end.index;

    this._entities[this.marker] = entity;
    this._entities[entity.index] = end;
    entity.id = null;

    end.index = entity.index;
    entity.index = endIndex;
  }

});
