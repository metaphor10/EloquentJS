function main()
{
	alert(zeroPad(10,10));
}




function zeroPad(number, width)
{
	var string = String(Math.round(number));
	while(string.length<width)
	{
		string = "0"+string;
	}
	return string;
	
}
function Dictionary(startValues) {
  this.values = startValues || {};
}
Dictionary.prototype.store = function(name, value) {
  this.values[name] = value;
};
Dictionary.prototype.lookup = function(name) {
  return this.values[name];
};
Dictionary.prototype.contains = function(name) {
  return Object.prototype.hasOwnProperty.call(this.values, name) &&
    Object.prototype.propertyIsEnumerable.call(this.values, name);
};
Dictionary.prototype.each = function(action) {
  forEachIn(this.values, action);
};

function Point( x, y) { this.x = x; this.y = y; } 
Point.prototype.add = function( other) 
{ 
	return new Point( this.x + other.x, this.y + other.y); 	
};

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
function elementFromCharacter( character) 
{
	if (character == " ") 
	{
		return undefined; 
	}else if (character == "#") 
	{
		return wall;
	}else if (character == "o") 
	{
		return new StupidBug(); 
	}
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
		if (point.x == endOfLine) characters.push("\ n"); 
	}); 
	return characters.join(""); 
};

Terrarium.prototype.listActingCreatures = function() 
{ var found = []; this.grid.each( function( point, value) { if (value != undefined && value.act) found.push({ object: value, point: point}); }); return found; };


















