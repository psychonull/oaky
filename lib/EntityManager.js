
var Base = require('./Base')
  , Entity = require('./Entity')
  , Pool = require('./Pool');

module.exports = Base.extend({

  initialize: function(options){
    options = options || {};
    this.lastId = 0;

    var self = this;
    function Allocator() {
      var obj = Entity.create();
      obj.on('destroy', function(entity){
        self.destroyEntity(entity);
      });
      return obj;
    }

    function Resetor(obj, index) {
      obj.index = index;
      obj.id = ++self.lastId;
    }

    this.pool = new Pool(Allocator, Resetor);
  },

  make: function(){
    return this.pool.create();
  },

  getById: function(id){
    var els = this.pool.elems;

    for(var i=0; i<els.length; i++){
      if (els[i].id === id){
        return els[i];
      }
    }

    return null;
  },

  getByComponents: function(components){
    var found = [];
    var els = this.pool.elems;

    function isValid(comps){
      for(var j=0; j<components.length; j++){
        if (comps.indexOf(components[j]) === -1){
          return false;
        }
      }

      return true;
    }

    for(var i=els.length; i--;){
      var comps = els[i].getAll();
      if (els[i].id && isValid(comps)){
        found.push(els[i]);
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
    var els = this.pool.elems;

    for (var i = els.length; i--;) {
      if (els[i].id){
        for(var j=tags.length; j--;){
          if (els[i].hasTag(tags[j])){
            found.push(els[i]);
          }
        }
      }
    }

    return found;
  },

  destroyEntity: function(entity){
    entity.id = null;
    this.pool.discard(entity.index);
  }

});
