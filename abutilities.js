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
buildMonthNameModule();

function provide(values) {
  forEachIn(values, function(name, value) {
    window[name] = value;
  });
}
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


