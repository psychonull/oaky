
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

      describe("#add", function(){
        
        it ("should add a component", function(){
          expect(entity.add).to.be.a("function");

          entity.add("position", { x:0, y: 0 });
          expect(entity._components).to.be.a("object");
          expect(entity._components["position"]).to.be.eql({ x:0, y: 0 });
        });

        it ("should validate if the component exists");
        it ("should create a component with default values");

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

        it ("should validate the data");
        
      });

      describe("#remove", function(){
        
        it ("should remove a component", function(){
          expect(entity.remove).to.be.a("function");

          entity.remove("velocity");

          expect(entity.has("velocity")).to.be.equal(false);
          expect(entity.get("velocity")).to.not.be.ok();
          
          expect(entity.has("position")).to.be.equal(true);
        });

        it ("should validate the data");
        
      });
    });

    describe("Tags", function(){

      describe("#addTag", function(){
        
        it ("should add a tag", function(){
          expect(entity.addTag).to.be.a("function");

          entity.addTag("player");
          entity.addTag("monster");
          expect(entity.tags).to.be.an("array");
          expect(entity.tags.length).to.be.equal(2);
        });

      });

      describe("#removeTag", function(){
        
        it ("should remove a tag", function(){
          expect(entity.removeTag).to.be.a("function");

          entity.removeTag("player");
          expect(entity.tags).to.be.an("array");
          expect(entity.tags.length).to.be.equal(1);
        });

      });

      describe("#hasTag", function(){
        
        it ("should tell if it has a tag", function(){
          expect(entity.hasTag).to.be.a("function");

          expect(entity.hasTag("player")).to.be.equal(false);
          expect(entity.hasTag("monster")).to.be.equal(true);
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
