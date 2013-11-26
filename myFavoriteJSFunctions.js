Object.prototype.create = function() {
	console.log("inside create");
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

function buildMonthNameModule() {
  var names = ["January", "February", "March", "April",
               "May", "June", "July", "August", "September",
               "October", "November", "December"];
  function getMonthName(number) {
    return names[number];
  }
  function getMonthNumber(name) {
    for (var number = 0; number < names.length; number++) {
      if (names[number] == name)
        return number;
    }
  }

  window.getMonthName = getMonthName;
  window.getMonthNumber = getMonthNumber;
}
function provide(values) {
  forEachIn(values, function(name, value) {
    window[name] = value;
  });
}
function positionOf( element, array, compare, start, end) { if (start == null) start = 0; if (end == null) end = array.length; for (; start < end; start ++) { var current = array[ start]; if (compare ? compare( element, current) : element == current) return start; } }
function defaultTo(object, values) {
  forEachIn(values, function(name, value) {
    if (!object.hasOwnProperty(name))
      object[name] = value;
  });
}
function range(args) {
  defaultTo(args, {start: 0, stepSize: 1});
  if (args.end == undefined)
    args.end = args.start + args.stepSize * (args.length - 1);

  var result = [];
  for (; args.start <= args.end; args.start += args.stepSize)
    result.push(args.start);
  return result;
}
function parseINI( string) { 
	var lines = splitLines( string); 
	var categories = []; function newCategory( name) { 
		var cat = {name: name, fields: []}; 
		categories.push( cat); 
		return cat; 
		} 
		var currentCategory = newCategory(" TOP"); 
		forEach( lines, function( line) { 
			var match; 
			if (/ ^\ s*(;.*)? $/. test( line)) 
			return; 
			else if (match = line.match(/ ^\[(.*)\] $/)) 
			currentCategory = newCategory( match[ 1]); 
			else if (match = line.match(/ ^(\ w +) =(.*) $/)) 
			currentCategory.fields.push({ name: match[ 1], value: match[ 2]}); 
			else throw new Error(" Line '" + line + "' is invalid."); 
			}); 
	return categories; 
}
function dom(name, attributes ) { 
	
	var node = document.createElement(name); 

	if (attributes) { forEachIn( attributes, function(name, value) { 
		node.setAttribute(name,value); }); 
		} 
		for (var i = 2; i < arguments.length; i ++) { 
			var child = arguments[ i]; 
			if (typeof child == "string") child = document.createTextNode( child); 
			node.appendChild( child); 
		} 
		
		return node; 
}
function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}
var output = dom("DIV", {id: "printOutput"}, dom("H1", null, "Print output:")); 
document.body.appendChild(output);
function print() { 
	var result = []; 
	forEach( arguments, function( arg){
		result.push( String( arg));
		}); 
		output.appendChild( dom("PRE", null, result.join(""))); 
		
}

function forEachIn(object, action) {
  for (var property in object) {
    if (object.hasOwnProperty(property))
      action(property, object[property]);
  }
}
function registerEventHandler( node, event, handler) { 
	if (typeof node.addEventListener == "function") node.addEventListener( event, handler, false);
	else node.attachEvent("on" + event, handler); 
	}
	
	
	function unregisterEventHandler( node, event, handler) { 
		if (typeof node.removeEventListener == "function") node.removeEventListener( event, handler,false); 
		else node.detachEvent(" on" + event, handler); 
		}
		registerEventHandler( document.body, "click", function( event) {
			 event = event || window.event;
			 print( event.clientX, ",", event.clientY); 
			 });
			 
			 
registerEventHandler ( document.body, "keypress", function( event) { 
	event = event || window.event; 
	var charCode = event.charCode || event.keyCode; 
	if (charCode) print("Character '", String.fromCharCode( charCode), "' was typed.");
	 });

function normalizeEvent( event) { 
	if (! event.stopPropagation) { 
		event.stopPropagation = function() {this.cancelBubble = true;}; 
		event.preventDefault = function() {this.returnValue = false;}; 
		} 
		if (! event.stop) event.stop = function() { 
			this.stopPropagation();this.preventDefault(); 
			}; 
			if (event.srcElement && !event.target) event.target = event.srcElement; 
			if (( event.toElement || event.fromElement) && !event.relatedTarget) event.relatedTarget = event.toElement || event.fromElement; 
			if (event.clientX != undefined && event.pageX == undefined) { 
				event.pageX = event.clientX + document.body.scrollLeft; 
				event.pageY = event.clientY + document.body.scrollTop; 
				} if (event.type == "keypress") event.character = String.fromCharCode( event.charCode || event.keyCode); 
				return event; 
				}
				
function addHandler(node, type, handler) { 
	function wrapHandler( event) { 
		handler( normalizeEvent( event || window.event)); 
		} 
		registerEventHandler( node, type, wrapHandler); 
		return {node: node, type: type, handler: wrapHandler}; 
		} 
function removeHandler( object) { 
	unregisterEventHandler( object.node, object.type, object.handler); 
	}
//addHandler(textfield, "focus", function( event) { event.target.style.backgroundColor = "yellow"; }); 
//addHandler(textfield, "blur", function( event) { event.target.style.backgroundColor = ""; });
//addHandler(textfield, "change", function( event) { print(" Content of text field changed to '", event.target.value, "'."); });
(function() {
  var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Friday", "Saturday"];
  provide({
    getDayName: function(number) {
      return names[number];
    },
    getDayNumber: function(name) {
      for (var number = 0; number < names.length; number++) {
        if (names[number] == name)
          return number;
      }
    }
  });
})();
function clone(object) {
  function OneShotConstructor(){}
  OneShotConstructor.prototype = object;
  return new OneShotConstructor();
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
Dictionary.prototype.names = function() {
  var names = [];
  this.each(function(name, value) {names.push(name);});
  return names;
};

function Point( x, y) { this.x = x; this.y = y; } 
Point.prototype.add = function( other) 
{ 
	return new Point( this.x + other.x, this.y + other.y); 	
};
function method(object, name) {
  return function() {
    return object[name].apply(object, arguments);
  };
}
function bind(func, object) {
  return function(){
    return func.apply(object, arguments);
  };
}
Object.prototype.hasPrototype = function(prototype) {
  function DummyConstructor() {}
  DummyConstructor.prototype = prototype;
  return this instanceof DummyConstructor;
};