
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

    describe("#getTagged", function(){
      var ids = [];

      before(function(){
        var entity;
        
        entity = entities.make();
        entity.addTag("animal");
        entity.addTag("bird");
        ids.push(entity.id);

        entity = entities.make();
        entity.addTag("animal");
        ids.push(entity.id);

        entity = entities.make();
        entity.addTag("dog");
        ids.push(entity.id);
      });

      it("should return an array of entities by tag", function(){
        expect(entities.getTagged).to.be.a("function");

        var found = entities.getTagged("animal");
        expect(found).to.be.an("array");
        expect(found.length).to.be.equal(2);

        found = entities.getTagged("bird");
        expect(found).to.be.an("array");
        expect(found.length).to.be.equal(1);

        found = entities.getTagged(["bird", "dog"]);
        expect(found).to.be.an("array");
        expect(found.length).to.be.equal(2);
      });

    });

  });
};
