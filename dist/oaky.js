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
			},
			"EntityManager.js": function (exports, module, require) {
				
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
			},
			"Game.js": function (exports, module, require) {
				
				var Base = require('./Base')
				  , EntityManager = require('./EntityManager')
				  , GameTime = require('./GameTime');
				
				module.exports = Base.extend({
				
				  initialize: function(/*options*/){
				
				    this._components = {};
				    this._systems = [];
				
				    this.entities = EntityManager.create();
				    this.gameTime = new GameTime();
				
				    this.tLoop = null;
				    this.paused = false;
				    this.boundGameRun = this.gameRun.bind(this);
				  },
				
				  addSystem: function(system){
				    system.game = this;
				    this._systems.push(system);
				  },
				
				  use: function(name, component){
				    if (this._components.hasOwnProperty(name)){
				      throw new Error("component '" + name + "' already exist");
				    }
				
				    this._components[name] = component;
				  },
				
				  process: function(){
				    var time = this.gameTime.frameTime;
				
				    for(var i=0; i<this._systems.length; i++){
				      var system = this._systems[i];
				      var entities = this.entities._entities;
				
				      if (system.has && system.has.length > 0) {
				        entities = this.entities.get(system.has);
				      }
				
				      system.process(time, entities);
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
			"System.js": function (exports, module, require) {
				/*jslint unused: false */
				
				var Base = require('./Base');
				
				module.exports = Base.extend({
				
				  has: [],
				  
				  //TODO: build filters by Tag
				  //tagged: [],
				
				  initialize: function(options){ },
				  process: function(delta, entities) { }
				
				});
			},
			"index.js": function (exports, module, require) {
				
				var Game = require('./Game');
				
				window.oaky = {
				  createGame: function(options){
				    return Game.create(options);
				  },
				  System: require('./System')
				};
			}
		}
	}
})("oaky/lib/index");