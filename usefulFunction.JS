function main()
{
	


	
	
	var terrarium= new LifeLikeTerrarium( lichenPlan); 
	
	for (var i = 0; i < 10; i ++) 
	{ 
		for (var i = 0; i < 20; i ++) 
		{
		terrarium.step(); document.getElementById("demo").innerHTML= terrarium;
		alert("try");
		}
	}


	
}
//var output = dom(" DIV", {id: "printOutput"}, dom(" H1", null, "Print output:")); document.body.appendChild( output);

var creatureTypes = new Dictionary(); 
	creatureTypes.register = function(constructor) {
  this.store(constructor.prototype.character, constructor);
};
var thePlan =
  ["############################",
   "#                      #####",
   "#    ##                 ####",
   "#   ####     ~ ~          ##",
   "#    ##       ~            #",
   "#                          #",
   "#                ###       #",
   "#               #####      #",
   "#                ###       #",
   "# %        ###        %    #",
   "#        #######           #",
   "############################"];
   
   var lichenPlan =
  ["############################",
   "#                     ######",
   "#    ***                **##",
   "#   *##**         **  c  *##",
   "#    ***     c    ##**    *#",
   "#       c         ##***   *#",
   "#                 ##**    *#",
   "#   c       #*            *#",
   "#*          #**       c   *#",
   "#***        ##**    c    **#",
   "#*****     ###***       *###",
   "############################"];


function StupidBug() {};
StupidBug.prototype.act = function(surroundings) {
  return {type: "move", direction: "s"};
};
function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}
function bind(func, object) {
  return function(){
    return func.apply(object, arguments);
  };
}
var directions = new Dictionary(
  {"n":  new Point( 0, -1),
   "ne": new Point( 1, -1),
   "e":  new Point( 1,  0),
   "se": new Point( 1,  1),
   "s":  new Point( 0,  1),
   "sw": new Point(-1,  1),
   "w":  new Point(-1,  0),
   "nw": new Point(-1, -1)});
   





function Grid( width, height) 
{ 
	this.width = width; this.height = height; 
	this.cells = new Array( width * height); 
} 
Grid.prototype.valueAt = function( point) 
{ 
	return this.cells[ point.y * this.width + point.x]; 
}; 
Grid.prototype.setValueAt = function( point, value) 
{ 
	this.cells[ point.y * this.width + point.x] = value; 
};
Grid.prototype.isInside = function( point) 
{ 
	return point.x >= 0 && point.y >= 0 && point.x < this.width && point.y < this.height; 
}; 
Grid.prototype.moveValue = function( from, to) 
{ 
	this.setValueAt( to, this.valueAt( from)); 
	this.setValueAt( from, undefined); 
};

Grid.prototype.each = function(action) 
{ for (var y = 0; y < this.height; y ++) 
	{ for (var x = 0; x < this.width; x ++) 
		{ 
			var point = new Point( x, y); 
			action ( point, this.valueAt( point)); 
		} 
	} 
};

var wall={};
function elementFromCharacter(character) {
  if (character == " ")
    return undefined;
  else if (character == "#")
    return wall;
  else if (creatureTypes.contains(character))
    return new (creatureTypes.lookup(character))();
  else
    throw new Error("Unknown character: " + character);
}
function Terrarium( plan) 
{ 
	
	var grid = new Grid( plan[ 0]. length, plan.length); 
	for (var y = 0; y < plan.length; y ++) 
	{ 
		var line = plan[ y]; for (var x = 0; x < line.length; x ++) 
		{ 
			grid.setValueAt( new Point( x, y), elementFromCharacter( line.charAt( x))); 
		} 
	} 
	this.grid = grid; 
}
wall.character = "#"; 
StupidBug.prototype.character = "o";

function characterFromElement( element) 
{ 
	if (element == undefined) 
	{
		return " "; 
	}
else return element.character; 
}
Terrarium.prototype.toString = function() 
{ 
	
	var characters = []; 
	var endOfLine = this.grid.width - 1; 
	this.grid.each( function( point, value) 
	{ 
		characters.push( characterFromElement( value)); 
		if (point.x == endOfLine) 
		{
			
			characters.push("\n"); 
		}
		
	}); 
	return characters.join(""); 
};

Terrarium.prototype.listActingCreatures = function() 
{ var found = []; 
	this.grid.each( function( point, value) 
	{ 
		if (value != undefined && value.act) 
		{
			found.push({ object: value, point: point}); 
		}
	}); 
	
	return found; 
};
Terrarium.prototype.listSurroundings = function( center) 
{ 
	var result = {}; 
	var grid = this.grid; 
	directions.each( function( name, direction) 
	{ 
		var place = center.add( direction); 
		if (grid.isInside( place)) 
		{
			result[ name] = characterFromElement( grid.valueAt( place));
		}else 
		{
			result[ name] = "#";
		}
	 }); 
	 return result; 
};
Terrarium.prototype.processCreature = function( creature) 
{ 
	var action = creature.object.act( this.listSurroundings( creature.point)); 
	if (action.type == "move" && directions.contains( action.direction)) 
	{ 
		var to = creature.point.add( directions.lookup( action.direction)); 
		if (this.grid.isInside( to) && this.grid.valueAt( to) == undefined) 
		{
			this.grid.moveValue( creature.point, to);
		}

	} else 
	{ throw new Error(" Unsupported action: " + action.type); }
 };
Terrarium.prototype.step = function() {forEach( this.listActingCreatures(), bind( this.processCreature, this)); };
function BouncingBug() {
  this.direction = "ne";
}
Terrarium.prototype.start = function() {
  if (!this.running)
    this.running = setInterval(bind(this.step, this), 500);
};
Terrarium.prototype.stop = function() {
  if (this.running) {
    clearInterval(this.running);
    this.running = null;
  }
};
BouncingBug.prototype.act = function(surroundings) {
  if (surroundings[this.direction] != " ")
    this.direction = (this.direction == "ne" ? "sw" : "ne");
  return {type: "move", direction: this.direction};
};
BouncingBug.prototype.character = "%";

creatureTypes.register(BouncingBug);
function randomElement(array) {
  if (array.length == 0)
    throw new Error("The array is empty.");
  return array[Math.floor(Math.random() * array.length)];
}
function DrunkBug() {};
DrunkBug.prototype.act = function(surroundings) {
  return {type: "move",
          direction: randomElement(directions.names())};
};
DrunkBug.prototype.character = "~";

creatureTypes.register(DrunkBug);


function LifeLikeTerrarium(plan) {
	
  Terrarium.call(this, plan);
  
}
LifeLikeTerrarium.prototype = clone(Terrarium.prototype);
LifeLikeTerrarium.prototype.constructor = LifeLikeTerrarium;
 

LifeLikeTerrarium.prototype.processCreature = function(creature) {
  if (creature.object.energy <= 0) return;
  var surroundings = this.listSurroundings(creature.point);
  var action = creature.object.act(surroundings);

  var target = undefined;
  var valueAtTarget = undefined;
  if (action.direction && directions.contains(action.direction)) {
    var direction = directions.lookup(action.direction);
    var maybe = creature.point.add(direction);
    if (this.grid.isInside(maybe)) {
      target = maybe;
      valueAtTarget = this.grid.valueAt(target);
    }
  }

  if (action.type == "move") {
    if (target && !valueAtTarget) {
      this.grid.moveValue(creature.point, target);
      creature.point = target;
      creature.object.energy -= 1;
    }
  }
  else if (action.type == "eat") {
    if (valueAtTarget && valueAtTarget.energy) {
      this.grid.setValueAt(target, undefined);
      creature.object.energy += valueAtTarget.energy;
      valueAtTarget.energy = 0;
    }
  }
  else if (action.type == "photosynthese") {
    creature.object.energy += 1;
  }
  else if (action.type == "reproduce") {
    if (target && !valueAtTarget) {
      var species = characterFromElement(creature.object);
      var baby = elementFromCharacter(species);
      creature.object.energy -= baby.energy * 2;
      if (creature.object.energy > 0)
        this.grid.setValueAt(target, baby);
    }
  }
  else if (action.type == "wait") {
    creature.object.energy -= 0.2;
  }
  else {
    throw new Error("Unsupported action: " + action.type);
  }

  if (creature.object.energy <= 0)
    this.grid.setValueAt(creature.point, undefined);
};
LifeLikeTerrarium.prototype.creatureMove = function( creature, from, to) { if (to != null || this.grid.valueAt( to) == undefined) { this.grid.moveValue( from, to); from.x = to.x; from.y = to.y; } return 1; };
LifeLikeTerrarium.prototype.creatureEat = function( creature, source) { var energy = 1; if (source != null) { var meal = this.grid.valueAt( source); if (meal != undefined && meal.energy) { this.grid.setValueAt( source, undefined); energy -= meal.energy; } } return energy; };
LifeLikeTerrarium.prototype.creatureReproduce = function( creature, target) { var energy = 1; if (target != null && this.grid.valueAt( target) == undefined) { var species = characterFromElement( creature); var baby = elementFromCharacter( species); energy = baby.energy * 2; if (creature.energy >= energy) this.grid.setValueAt( target, baby); } return energy; };
function Lichen() {

  this.energy = 5;
}
Lichen.prototype.act = function(surroundings) {
  var emptySpace = findDirections(surroundings, " ");
  if (this.energy >= 13 && emptySpace.length > 0)
    return {type: "reproduce", direction: randomElement(emptySpace)};
  else if (this.energy < 20)
    return {type: "photosynthese"};
  else
    return {type: "wait"};
};
Lichen.prototype.character = "*";

creatureTypes.register(Lichen);

function findDirections(surroundings, wanted) {
  var found = [];
  directions.each(function(name) {
    if (surroundings[name] == wanted)
      found.push(name);
  });
  return found;
}
function LichenEater() {
  this.energy = 10;
}
LichenEater.prototype.act = function(surroundings) {
  var emptySpace = findDirections(surroundings, " ");
  var lichen = findDirections(surroundings, "*");

  if (this.energy >= 30 && emptySpace.length > 0)
    return {type: "reproduce", direction: randomElement(emptySpace)};
  else if (lichen.length > 0)
    return {type: "eat", direction: randomElement(lichen)};
  else if (emptySpace.length > 0)
    return {type: "move", direction: randomElement(emptySpace)};
  else
    return {type: "wait"};
};
LichenEater.prototype.character = "c";

creatureTypes.register(LichenEater);





 



















