// This file was generated by modules-webmake (modules for web) project.
// See: https://github.com/medikoo/modules-webmake

(function (modules) {
	var resolve, getRequire, require, notFoundError, findFile
	  , extensions = {".js":[],".json":[],".css":[],".html":[]};
	notFoundError = function (path) {
		var error = new Error("Could not find module '" + path + "'");
		error.code = 'MODULE_NOT_FOUND';
		return error;
	};
	findFile = function (scope, name, extName) {
		var i, ext;
		if (typeof scope[name + extName] === 'function') return name + extName;
		for (i = 0; (ext = extensions[extName][i]); ++i) {
			if (typeof scope[name + ext] === 'function') return name + ext;
		}
		return null;
	};
	resolve = function (scope, tree, path, fullpath, state) {
		var name, dir, exports, module, fn, found, i, ext;
		path = path.split(/[\\/]/);
		name = path.pop();
		if ((name === '.') || (name === '..')) {
			path.push(name);
			name = '';
		}
		while ((dir = path.shift()) != null) {
			if (!dir || (dir === '.')) continue;
			if (dir === '..') {
				scope = tree.pop();
			} else {
				tree.push(scope);
				scope = scope[dir];
			}
			if (!scope) throw notFoundError(fullpath);
		}
		if (name && (typeof scope[name] !== 'function')) {
			found = findFile(scope, name, '.js');
			if (!found) found = findFile(scope, name, '.json');
			if (!found) found = findFile(scope, name, '.css');
			if (!found) found = findFile(scope, name, '.html');
			if (found) {
				name = found;
			} else if ((state !== 2) && (typeof scope[name] === 'object')) {
				tree.push(scope);
				scope = scope[name];
				name = '';
			}
		}
		if (!name) {
			if ((state !== 1) && scope[':mainpath:']) {
				return resolve(scope, tree, scope[':mainpath:'], fullpath, 1);
			}
			return resolve(scope, tree, 'index', fullpath, 2);
		}
		fn = scope[name];
		if (!fn) throw notFoundError(fullpath);
		if (fn.hasOwnProperty('module')) return fn.module.exports;
		exports = {};
		fn.module = module = { exports: exports };
		fn.call(exports, exports, module, getRequire(scope, tree));
		return module.exports;
	};
	require = function (scope, tree, fullpath) {
		var name, path = fullpath, t = fullpath.charAt(0), state = 0;
		if (t === '/') {
			path = path.slice(1);
			scope = modules['/'];
			tree = [];
		} else if (t !== '.') {
			name = path.split('/', 1)[0];
			scope = modules[name];
			if (!scope) throw notFoundError(fullpath);
			tree = [];
			path = path.slice(name.length + 1);
			if (!path) {
				path = scope[':mainpath:'];
				if (path) {
					state = 1;
				} else {
					path = 'index';
					state = 2;
				}
			}
		}
		return resolve(scope, tree, path, fullpath, state);
	};
	getRequire = function (scope, tree) {
		return function (path) { return require(scope, [].concat(tree), path); };
	};
	return getRequire(modules, []);
})({
	"oaky": {
		"lib": {
			"Base.js": function (exports, module, require) {
				
				/*
				 * Taken from https://gist.github.com/davidaurelio/838778
				 * more info at: http://uxebu.com/blog/2011/02/23/object-based-inheritance-for-ecmascript-5/
				 */
				
				module.exports = {
				
				  create: function create() {
				    var instance = Object.create(this);
				    instance.initialize.apply(instance, arguments);
				    return instance;
				  },
				 
				  extend: function extend(properties, propertyDescriptors) {
				    propertyDescriptors = propertyDescriptors || {};
				
				    if(properties){
				      var simpleProperties = Object.getOwnPropertyNames(properties);
				      for (var i = 0, len = simpleProperties.length; i < len; i += 1) {
				        var propertyName = simpleProperties[i];
				        if(propertyDescriptors.hasOwnProperty(propertyName)) {
				          continue;
				        }
				
				        propertyDescriptors[propertyName] =
				          Object.getOwnPropertyDescriptor(properties, propertyName);
				      }
				    }
				
				    return Object.create(this, propertyDescriptors);
				  },
				
				  initialize: function initialize() {},
				
				  _super: function _super(definedOn, methodName, args) {
				    if (typeof methodName !== "string") {
				      args = methodName;
				      methodName = "initialize";
				    }
				
				    return Object.getPrototypeOf(definedOn)[methodName].apply(this, args);
				  }
				};
			},
			"Entity.js": function (exports, module, require) {
				
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
			},
			"EntityManager.js": function (exports, module, require) {
				
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
			},
			"Game.js": function (exports, module, require) {
				
				var Base = require('./Base')
				  , EntityManager = require('./EntityManager')
				  , GameTime = require('./GameTime');
				
				module.exports = Base.extend({
				
				  initialize: function(options){
				
				    for (var opt in options){
				      if (options.hasOwnProperty(opt)){
				        this[opt] = options[opt];
				      }
				    }
				
				    this._components = {};
				
				    this._systems = [];
				    this._systemsByName = {};
				
				    this.entities = EntityManager.create();
				
				    this.gameTime = new GameTime();
				
				    this.tLoop = null;
				    this.paused = false;
				    this.boundGameRun = this.gameRun.bind(this);
				  },
				
				  addSystem: function(name, system){
				    if (!system){
				      throw new Error("A system was expected");
				    }
				
				    if (this._systemsByName.hasOwnProperty(name)){
				      throw new Error("Duplicated system name " + name); 
				    }
				
				    this._systemsByName[name] = system;
				    this._systems.push(system);
				    system.game = this;  
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
				      
				      if (!system.enabled){
				        continue;
				      }
				
				      if (system.uses && system.uses.length > 0) {
				        var entities = this.entities.get(system.uses);
				        system.process(this.gameTime.frameTime, entities);
				      }
				      else {
				        system.process(this.gameTime.frameTime);
				      }
				    }
				  },
				
				  enable: function(systemName){
				    if (this._systemsByName.hasOwnProperty(systemName)){
				      this._systemsByName[systemName].enabled = true;
				    }
				  },
				
				  disable: function(systemName){
				    if (this._systemsByName.hasOwnProperty(systemName)){
				      this._systemsByName[systemName].enabled = false;
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
			},
			"GameTime.js": function (exports, module, require) {
				// Manages the ticks for a Game Loop
				
				var GameTime = module.exports = function(){
				  this.lastTime = Date.now();
				  this.frameTime = 0;
				  this.typicalFrameTime = 20;
				  this.minFrameTime = 12; 
				  this.time = 0;
				};
				
				// move the clock one tick. 
				// return true if new frame, false otherwise.
				GameTime.prototype.tick = function() {
				  var now = Date.now();
				  var delta = now - this.lastTime;
				
				  if (delta < this.minFrameTime ) {
				    return false;
				  }
				
				  if (delta > 2 * this.typicalFrameTime) { // +1 frame if too much time elapsed
				     this.frameTime = this.typicalFrameTime;
				  } else {  
				    this.frameTime = delta;      
				  }
				
				  this.time += this.frameTime;
				  this.lastTime = now;
				
				  return true;
				};
				
				GameTime.prototype.reset = function() {
				  this.lastTime = Date.now();
				  this.frameTime = 0;
				  this.typicalFrameTime = 20;
				  this.minFrameTime = 12; 
				  this.time = 0;
				};
			},
			"Pool.js": function (exports, module, require) {
				
				var Base = require('./Base');
				
				module.exports = Base.extend({
				
				  // How fast we grow 
				  expandFactor : 0.2,
				
				  // Minimum number of items we grow 
				  expandMinUnits : 16,
				
				  elems : [],
				
				  // List of discarded element indexes in our this.elems pool 
				  freeElems : [],
				  
				  initialize: function(allocator, resetor){
				    // Start with one element
				    this.allocator = allocator;
				    this.resetor = resetor;
				    // Set initial state of 1 object
				    this.elems[0] = this.allocator();
				    this.freeElems = [0];
				  },
				
				  make: function() {
				    if(!this.freeElems.length) {
				      this.expand();
				    }
				
				    // See if we have any allocated elements to reuse
				    var index = this.freeElems.pop();
				    var elem = this.elems[index];
				    this.resetor(elem, index);
				    return elem;
				  },
				
				  getLength: function() {
				    return this.elems.length - this.freeElems.length;
				  },
				
				  expand : function() {
				
				    var oldSize = this.elems.length;
				
				    var growth = Math.ceil(this.elems.length * this.expandFactor);
				
				    if(growth < this.expandMinUnits) {
				      growth = this.expandMinUnits;
				    }
				
				    this.elems.length = this.elems.length + growth;
				
				    for(var i=oldSize; i<this.elems.length; i++) {
				      this.elems[i] = this.allocator();
				      this.freeElems.push(i);
				    }
				  },
				
				  discard : function(n) {
				
				    // Cannot double deallocate
				    if(this.freeElems.indexOf(n) >= 0) {
				      return;
				    }
				
				    this.freeElems.push(n);
				  },
				
				  // Return object at pool index n
				  get : function(n) {
				    return this.elems[n];
				  }
				
				});
			},
			"System.js": function (exports, module, require) {
				/*jslint unused: false */
				
				var Base = require('./Base');
				
				module.exports = Base.extend({
				
				  uses: [],
				  enabled: true,
				  
				  initialize: function(options){ },
				  process: function(delta, entities) { }
				
				});
			}
		},
		"test": {
			"Engine.specs.js": function (exports, module, require) {
				module.exports = function(){
				
				  describe('Engine', function(){
				
				    it ('should test the engine access');
				
				  });
				
				};
			},
			"Entity.specs.js": function (exports, module, require) {
				
				module.exports = function(){
				  var Entity = require("../lib/Entity");
				
				  describe("Entity", function(){
				    var entity;
				
				    before(function(){
				      entity = Entity.create({
				        id: 1
				      });
				    });
				
				    describe("Components", function(){
				
				      it("should work with a component pool");
				
				      describe("#add", function(){
				        
				        it ("should add a component", function(){
				          expect(entity.add).to.be.a("function");
				
				          entity.add("position", { x:0, y: 0 });
				          expect(entity._components).to.be.a("object");
				          expect(entity._components["position"]).to.be.eql({ x:0, y: 0 });
				        });
				
				      });
				
				      describe("#get", function(){
				        
				        it ("should get a component's value by type", function(){
				          entity.add("velocity", { dx: 5, dy: 5 });
				
				          expect(entity.get).to.be.a("function");
				
				          var c = entity.get("velocity");
				
				          expect(c).to.be.a("object");
				          expect(c.dx).to.be.equal(5);
				          expect(c.dy).to.be.equal(5);
				        });
				
				      });
				
				      describe("#getAll", function(){
				        
				        it ("should an array with all current component types supported", function(){
				          expect(entity.getAll).to.be.a("function");
				
				          var comps = entity.getAll();
				          expect(comps).to.be.an("array");
				          expect(comps.length).to.be.equal(2);
				          
				          expect(comps.indexOf("position")).to.be.greaterThan(-1);
				          expect(comps.indexOf("velocity")).to.be.greaterThan(-1);
				        });
				        
				      });
				
				      describe("#has", function(){
				        
				        it ("should return true or false if the entity has a component type", function(){
				          expect(entity.has).to.be.a("function");
				
				          expect(entity.has("position")).to.be.equal(true);
				          expect(entity.has("velocity")).to.be.equal(true);
				          expect(entity.has("xcomponent")).to.be.equal(false);
				        });
				        
				      });
				
				      describe("#is", function(){
				        
				        it ("should return true or false if the entity has a component type", function(){
				          expect(entity.is).to.be.a("function");
				
				          expect(entity.is("position")).to.be.equal(true);
				          expect(entity.is("velocity")).to.be.equal(true);
				          expect(entity.is("xcomponent")).to.be.equal(false);
				        });
				        
				      });
				
				      describe("#set", function(){
				        
				        it ("should set a component's value by type", function(){
				          expect(entity.set).to.be.a("function");
				
				          var cv = entity.get("velocity");
				
				          cv.dx = 7;
				          cv.dy = 8;
				
				          entity.set("velocity", cv);
				
				          cv = entity.get("velocity")
				          expect(cv).to.be.a("object");
				          expect(cv.dx).to.be.equal(7);
				          expect(cv.dy).to.be.equal(8);
				        });
				        
				      });
				
				      describe("#remove", function(){
				        
				        it ("should remove a component", function(){
				          expect(entity.remove).to.be.a("function");
				
				          entity.remove("velocity");
				
				          expect(entity.has("velocity")).to.be.equal(false);
				          expect(entity.get("velocity")).to.not.be.ok();
				          
				          expect(entity.has("position")).to.be.equal(true);
				        });
				
				      });
				    });
				
				    describe("#destroy", function(){
				      it('should allow to be destroyed', function(){
				        expect(entity.destroy).to.be.a("function");
				      });
				    });
				
				  });
				};
			},
			"EntityManager.specs.js": function (exports, module, require) {
				
				module.exports = function(){
				  var EntityManager = require("../lib/EntityManager");
				
				  describe("EntityManager", function(){
				    var entities;
				
				    before(function(){
				      entities = EntityManager.create();
				    });
				
				    describe("#make", function(){
				
				      it ("should create an Entity and return it", function(){
				        expect(entities.make).to.be.a("function");
				
				        var entity = entities.make();
				        expect(entity.id).to.be.greaterThan(0);
				
				        expect(entities.pool.elems).to.be.an("array");
				        expect(entities.pool.elems[0].id).to.be.equal(entity.id);
				      });
				
				    });
				
				    describe("#get", function(){
				      var ids = [];
				
				      before(function(){
				        var entity;
				        
				        entity = entities.make();
				        entity.add("position");
				        entity.add("size");
				        entity.add("velocity");
				        ids.push(entity.id);
				
				        entity = entities.make();
				        entity.add("position");
				        ids.push(entity.id);
				
				        entity = entities.make();
				        entity.add("controls");
				        ids.push(entity.id);
				      });
				
				      it("should return an entity by id if a integer is passed", function(){
				        expect(entities.get).to.be.a("function");
				
				        var found = entities.get(ids[0]);
				        expect(found.id).to.be.equal(ids[0]);
				      });
				
				      it("should return an array of entities by ONE component if a string is passed", function(){
				        expect(entities.get).to.be.a("function");
				
				        var found = entities.get("position");
				        expect(found).to.be.an("array");
				        expect(found.length).to.be.equal(2);
				        
				        found = entities.get("velocity");
				        expect(found).to.be.an("array");
				        expect(found.length).to.be.equal(1);
				      });
				
				      it("should return an array of entities by components if an array is passed", function(){
				        expect(entities.get).to.be.a("function");
				
				        var found = entities.get(["position"]);
				        expect(found).to.be.an("array");
				        expect(found.length).to.be.equal(2);
				
				        var found = entities.get(["position", "size"]);
				        expect(found).to.be.an("array");
				        expect(found.length).to.be.equal(1);
				      });
				
				      it("should allow to destroy an entity from the pool", function(){
				        for(var i=0; i < ids.length; i++){
				          var ent = entities.get(ids[i]);
				          ent.destroy();
				
				          expect(ent.id).to.be.equal(null);
				        }
				      });
				
				    });
				
				  });
				};
			},
			"Game.specs.js": function (exports, module, require) {
				
				var System = require('../lib/System');
				var MovementSystem = System.extend({
				
				  initialize: function(options){
				    this.gravity = options.gravity;
				  },
				
				  process: function(){ }
				
				});
				
				module.exports = function(){
				
				  var Game = require('../lib/Game');
				  
				  describe('Game', function(){
				    var game;
				
				    before(function(){
				      game = Game.create({
				        testOption: 12345,
				        testOptObj: {
				          x: 10,
				          y: 60
				        }
				      });
				
				      expect(game.testOption).to.be.equal(12345);
				      expect(game.testOptObj.x).to.be.equal(10);
				      expect(game.testOptObj.y).to.be.equal(60);
				    });
				
				    describe('#addSystem', function(){
				      
				      it ('should allow to add systems', function(){
				        expect(game.addSystem).to.be.a('function');
				
				        game.addSystem("movement", MovementSystem.create({ gravity: 1.5 }));
				
				        expect(game._systems).to.be.an('array');
				        expect(game._systems.length).to.be.equal(1);
				
				        expect(game._systemsByName["movement"]).to.be.ok();
				        expect(game._systems[0].gravity).to.be.equal(1.5);
				      });
				
				    });
				
				    describe('#use', function(){
				
				      it ('should allow to register one component', function(){
				        expect(game.use).to.be.a('function');
				
				        var defaultPosition = { x: 0, y:0 };
				        game.use('position', defaultPosition);
				        expect(game._components['position']).to.be.eql(defaultPosition);
				      });
				
				      it ('should throw an Error if the component already exists', function(){
				        expect(function(){
				          game.use('position', {});  
				        }).to.throwError();
				      });
				
				    });
				
				    describe('#disable', function(){
				      it ('should allow to disable a system by name', function(){
				        expect(game.disable).to.be.a('function');
				
				        game.disable("movement");
				        expect(game._systems[0].enabled).to.be.equal(false);
				      });
				    });
				
				    describe('#enable', function(){
				      it ('should allow to enable a system by name', function(){
				        expect(game.enable).to.be.a('function');
				
				        game.enable("movement");
				        expect(game._systems[0].enabled).to.be.equal(true);
				      });
				    });
				
				    describe('#start', function(){
				      it('should expose a start method to run the game loop', function(){
				        expect(game.start).to.be.a('function');
				      });
				    });
				
				    describe('#stop', function(){
				      it('should expose a stop method to stop the game loop', function(){
				        expect(game.stop).to.be.a('function');
				      });
				    });
				
				
				  });
				};
			},
			"System.specs.js": function (exports, module, require) {
				
				var Game = require('../lib/Game');
				var System = require('../lib/System');
				
				var SystemTest = System.extend({
				
				  uses: ['ca', 'cb'],
				
				  initialize: function(options) {
				    this.gravity = 0.5;
				  },
				
				  process: function(delta, entities) {
				
				  }
				
				});
				
				var SystemNoEntities = System.extend({
				
				  process: function(delta, entities) {
				
				  }
				
				});
				
				module.exports = function(){
				
				  describe("SystemSpec", function(){
				    var game, 
				      testSystem, 
				      testSystemNoEntities, 
				      entities = [], 
				      spyProcessNoEntities,
				      spyProcess;
				
				    before(function(){
				      
				      game = Game.create();
				      testSystem = SystemTest.create();
				      testSystemNoEntities = SystemNoEntities.create();
				
				      game.addSystem("test", testSystem);
				      game.addSystem("noEntities", testSystemNoEntities);
				
				      var entity;
				      entity = game.entities.make();
				      entity.add("ca");
				      entity.add("cb");
				      entity.add("cc");
				      entities.push(entity);
				
				      entity = game.entities.make();
				      entity.add("ca");
				      entity.add("cb");
				      entities.push(entity);
				
				      entity = game.entities.make();
				      entity.add("cd");
				      entities.push(entity);
				
				      spyProcess = sinon.spy(testSystem, "process");
				      spyProcessNoEntities = sinon.spy(testSystemNoEntities, "process");
				    });
				
				    describe('System', function(){
				
				      it ('should run the systems with the corresponding entities', function(done){
				        
				        game.start();
				
				        setTimeout(function(){
				          game.stop();
				          expect(spyProcess.called).to.be.ok();
				          expect(spyProcess.args[0][1].length).to.be.equal(2);
				
				          expect(spyProcessNoEntities.called).to.be.ok();
				          expect(spyProcessNoEntities.args[0][1]).to.be(undefined);
				          spyProcess.reset();
				          spyProcessNoEntities.reset();
				          done();
				        }, 100);
				
				      });
				  
				      it ('should run the system with the corresponding entities #2', function(done){
				        entities[0].remove("cb");
				
				        game.start();
				        setTimeout(function(){
				          game.stop();
				          expect(spyProcess.called).to.be.ok();
				          expect(spyProcess.args[0][1].length).to.be.equal(1);
				          spyProcess.reset();
				          done();
				        }, 100);
				
				      });
				
				      it ('should not run a disabled system', function(done){
				        
				        game.disable("test");
				        game.start();
				        setTimeout(function(){
				          game.stop();
				          expect(spyProcess.called).to.be.equal(false);
				          spyProcess.reset();
				          done();
				        }, 100);
				
				      });
				
				      it ('should run an enabled system', function(done){
				        
				        game.enable("test");
				        game.start();
				        setTimeout(function(){
				          game.stop();
				          expect(spyProcess.called).to.be.equal(true);
				          spyProcess.reset();
				          done();
				        }, 100);
				
				      });
				  
				    });
				  });
				};
			},
			"runner.js": function (exports, module, require) {
				
				require('./Entity.specs')();
				require('./EntityManager.specs')();
				require('./System.specs')();
				require('./Game.specs')();
				require('./Engine.specs')();
				
				if (window.mochaPhantomJS) { mochaPhantomJS.run(); }
				else { mocha.run(); }
			}
		}
	}
})("oaky/test/runner");
