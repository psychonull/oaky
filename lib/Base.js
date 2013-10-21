
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