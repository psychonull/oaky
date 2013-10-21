
var movement = oaky.System.extend({
  initialize: function(options) { },

  has: ['position', 'velocity'], //optional
  tagged: ["animal", "bird"], //optional
  
  process: function(delta, entities) { } //entities = game.entities (filtered?)
});


var game = oaky.createGame({
  //options
});

var sys = Movement.create({ xxx: true })

game.addSystem(sys);

sys.enable();
sys.disable();

game.use({ //TODO
  "position": {  x: 0, y: 0 },
  "velocity": {  dx: 0, dy: 0 }
});
//or
game.use("position", {  x: 0, y: 0 });

var ent = game.entities.make();

// Components
ent.add("position", { x: 25, y: 653 });
ent.add("velocity"); //with defaults

ent.get('velocity'); //get component
ent.get(['position'); //get component
ent.getAll(); //get array of components ['position', 'velocity']
ent.has('velocity'); //has or not a component

ent.set('velocity', { dx: 55 , dy: 66 });
ent.remove('velocity');

// tags
ent.addTag('monster');
ent.removeTag('player');
ent.hasTag('monster'); //true

ent.destroy();
ent.id;

// int: id | string: component | array: components
game.entities.get(p);

// string one tag | array: tags
game.entities.getTagged(tag);

//add event emitter to:
// send events from entities to entitymanager
// expose events of entity manager
// expose events of the game

game.start();
game.pause();
game.stop();


game.on('before:loop')
game.on('after:loop')

game.loop(function(){

});



//var Game = require('./Game');

$(function(){
/*
  var engine = window.ECS.create({
    //TODO :configs
  });

  engine.use(require('./systems/movement'));
  engine.use(require('./systems/gun'));
  engine.use(require('./systems/bulletCollision'));

  engine.use('position', require('./components/position'));
  engine.use('velocity', require('./components/velocity'));

  engine.register('sheep', require('./entities/sheep'));
  engine.register('bird', require('./entities/bird'));

  var aSheep = engine.create('sheep', {
    position: {
      x: 0,
      y: 0
    },
    velocity: {
      x: 0,
      y: 0
    }
  });
*/


  /* 
  cuando agrego un componente genera un identificador por cada uno
  por ej: position = c1, velocity = c2
  
  creando 2 arrays asociativos onda:
  var cById = {"c1": "position", "c2": "velocity" };
  var cByName = {"position": "c1", "velocity": "c2" }:

  Cuando crea una entidad la mete en un array asociativo
  dependiendo de sus componentes por ejemplo para sheep:
  var componentByEntityName = { "sheep": "c1-c2" };
  var entitiesByComponents = { 
    "c1": ["sheep", "bird"],
    "c2": ["sheep", "bird"],
    "c1-c2": ["sheep", "bird"] 
  };

  var entitiesByName = {"sheep": [{ id:1 }, { id: 2}], "bird": [{ id: 3}, {id:4 }] }
  var entities = [{ id:1} , {id: 2}, { id: 3}, {id:4 } ]
  
  Cuando crea un systema lo mete en un array asociativo
  dependiendo de los componentes que necesita por ejemplo para movement:
  var componentsBySystem = { "movement": "c1-c2" };

  Entonces cuando corre un systema puedo:
  pedir las entidades del sistema con:
    var comps = componentsBySystem["movement"];
    var entitiesTypes = entitiesByComponents[comps];
    for each(eType in entitiesTypes){
      entitiesByName[eType]
    }

  */

});
