##Oaky

Entity Component System Architecture for building fast and simple games.

### Getting Started

TODO: Show the inclusion of the oaky script into html.

```javascript
var game = oaky.createGame({
  //options
});
```

**Game Options:**
`poolSize` : `Number` (_default_: `1000` ) Max object for the object pool. Increases by double when run out of space.

#### Creating Entities
Entities are holders of components, and has a unique id. To create a new entity it must be get from the Entity Manager of the game:

```javascript
var player = game.entities.make();
console.log(player.id); // i.e: 1257
```

#### Managing components
Components are the data contained inside an entity, like position, velocity, etc.

```javascript
player.add('position', { x: 100, y: 100 });
player.has('position'); // true

var pos = player.get('position').x;
pos.x++;
player.set('position', pos);

player.remove('position');
player.has('position'); //false
```

> components are retrieved by reference, so this is also valid: `player.get('position').x++;`

#### Working with Systems
Systems must be inherited from `oaky.System`. They have the logic to make the entity components change. i.e.: MovementSystem would change the position component of an entity using the velocity component.

Let's create a movement System:

```javascript
var MovementSystem = oaky.System.extend({

    // optional: provide the components which 
    // are gonna be used by the system.
    has: ['position', 'velocity'],
  
    // optional: constructor
    initialize: function(options) { },

    // will be called on each game loop iteration
    // sending a delta time and the entities which 
    // which have the expected components 
    // (or all if "has" property was not specified.
    process: function(delta, entities) { }
});
```

> the process function has an access to the game is running on by `this.game`.

Now we need to create and add the system to the game:

```javascript
var movement = MovementSystem.create({ /* options */ });
game.addSystem(movement);
```

> the order in which the systems are added to the game is how they are executed.

#### Tagging
Tags are just strings, they can be use to group a set of entities or just to "flag" them.

There are times where you may need to retrieve all the entities that are enemies to check a shoot collision, or flag an enemy as "hit" by a shoot to make some cool stuff from other system with it, so tagging could be very usefull for that kind of things.

```javascript
var enemy = game.entities.make();
enemy.addTag('enemy');

enemy.hasTag('enemy'); //true

enemy.removeTag('enemy');
```

#### Managing Entities

```javascript

game.entities.get(12345); // by id

game.entities.get('position'); // by component

game.entities.get(['position', 'velocity']); // by components (AND)

game.entities.getTagged('enemy'); //by tag
game.entities.getTagged(['enemy', 'duck']); //by tags (AND)

entitiy.destroy(); //remove the entity from the manager
```

#### Game access

```javascript
game.start();
game.pause();
game.stop();
```

### TODO
* Build up an NPM module to use oaky from NodeJS.
* Version of oaky
* Licence
* Authors