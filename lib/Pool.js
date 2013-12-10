
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
  },

  destroy: function(){
    this.elems.length = 0;
    this.freeElems.length = 0;
  }

});
