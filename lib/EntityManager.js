
var Base = require('./Base')
  , Entity = require('./Entity')
  , Pool = require('./Pool');

module.exports = Base.extend({

  initialize: function(){
    this.lastId = 0;

    var self = this;
    function allocator() {
      var obj = Entity.create();
      obj.on('destroy', function(entity){
        self.destroyEntity(entity);
      });
      return obj;
    }

    function resetor(obj, index) {
      obj.index = index;
      obj.id = ++self.lastId;
    }

    this.pool = Pool.create(allocator, resetor);
  },

  make: function(){
    return this.pool.make();
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

  destroyEntity: function(entity){
    entity.id = null;
    this.pool.discard(entity.index);
  }

});
