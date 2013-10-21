
var Base = require('./Base')
  , Entity = require('./Entity');

module.exports = Base.extend({

  initialize: function(){
    this._entities = [];
    this.lastId = 0;
  },

  make: function(){
    var entity = Entity.create({
      id: ++this.lastId
    });

    entity.on('destroy', this.destroyEntity.bind(this));
    
    this._entities.push(entity);
    return entity;
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

    for(var i=0; i<this._entities.length; i++){
      var comps = this._entities[i].getAll();
      if (isValid(comps)){
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

    for(var i=0; i<this._entities.length; i++){

      for(var j=0; j<tags.length; j++){

        if (this._entities[i].hasTag(tags[j])){
          found.push(this._entities[i]);
        }
      }
    }

    return found;
  },

  destroyEntity: function(id){
    for(var i=0; i<this._entities.length; i++){
      if (this._entities[i].id === id){
        this._entities.splice(i, 1);
        return;
      }
    }
  }

});
