Object.prototype.create = function() {
  var object = clone(this);
  if (typeof object.construct == "function")
    object.construct.apply(object, arguments);
  return object;
};
Object.prototype.extend = function(properties) {
  var result = clone(this);
  forEachIn(properties, function(name, value) {
    result[name] = value;
  });
  return result;
};
var Item = {
  construct: function(name) {
    this.name = name;
  },
  inspect: function() {
    alert("it is ", this.name, ".");
  },
  kick: function() {
    alert("klunk!");
  },
  take: function() {
    alert("you can not lift ", this.name, ".");
  }
};

var lantern = Item.create("the brass lantern");
lantern.kick();
var DetailedItem = Item.extend({
  construct: function(name, details) {
    Item.construct.call(this, name);
    this.details = details;
  },
  inspect: function() {
    alert("you see "+ this.name +", " + this.details +".");
  }
});

var giantSloth = DetailedItem.create(
  "the giant sloth",
  "it is quietly hanging from a tree, munching leaves");
  alert("giant sloth");
giantSloth.inspect();

function clone(object) {
  function OneShotConstructor(){}
  OneShotConstructor.prototype = object;
  return new OneShotConstructor();
}
function forEachIn(object, action) {
  for (var property in object) {
    if (object.hasOwnProperty(property))
      action(property, object[property]);
     }
}
Object.prototype.hasPrototype = function(prototype) {
  function DummyConstructor() {}
  DummyConstructor.prototype = prototype;
  return this instanceof DummyConstructor;
};
function mixInto(object, mixIn) {
  forEachIn(mixIn, function(name, value) {
    object[name] = value;
  });
};
var SmallItem = Item.extend({
  kick: function() {
    alert(this.name, " flies across the room.");
  },
  take: function() {
    // (imagine some code that moves the item to your pocket here)
    alert("you take ", this.name, ".");
  }
});
var SmallDetailedItem = clone(DetailedItem);
mixInto(SmallDetailedItem, SmallItem);

var deadMouse = SmallDetailedItem.create(
  "Fred the mouse",
  "he is dead");
deadMouse.inspect();
deadMouse.kick();
    