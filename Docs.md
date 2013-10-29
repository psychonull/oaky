##Oaky

Entity Component System Architecture for building fast and simple games.

### Getting Started

TODO: Show the inclusion of the oaky script into html.

```javascript
var game = oaky.createGame({
  //settings -> any setting you need at game level
  viewSize: 500
});

console.log(game.viewSize); // 500
```

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

// also method 'is' as synonymous for 'has'
player.add('animal');
player.is('animal'); // true

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
    uses: ['position', 'velocity'],
  
    // optional: constructor
    initialize: function(options) { },

    // will be called on each game loop iteration
    // sending a delta time and the entities which 
    // which have the expected components 
    // (or none if "uses" property is not specified.
    process: function(delta, entities) {
        // access to the EntityManager from the system
        var newEntity = this.game.entities.make();
    }
});
```

> the process function has an access to the game is running on by `this.game`.

Now we need to create and add the system to the game:

```javascript
var movement = MovementSystem.create({ /* options */ });
game.addSystem("movement", movement);
```

> the order in which the systems are added to the game is how they are executed.

### Enabling and Disabling Systems
```javascript

movement.enabled = false;
movement.enabled = true;

// or from the Game instance

this.game.enable("movement");
this.game.disable("movement");

```

> By default all systems are enabled

#### Managing Entities

```javascript

game.entities.get(12345); // by id

game.entities.get('position'); // by component

game.entities.get(['position', 'velocity']); // by components (AND)

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