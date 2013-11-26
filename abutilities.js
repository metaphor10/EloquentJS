
function main()
{
	console.log("inside main");
	
	var sokoban = SokobanGame(sokobanLevels,document.body);
	console.log("after game");
}

var sokobanLevels = [
  {field: ["######  ##### ",
           "#    #  #   # ",
           "# 0  #### 0 # ",
           "# 0 @    0  # ",
           "#  #######0 # ",
           "####   ### ###",
           "       #     #",
           "       #0    #",
           "       # 0   #",
           "      ## 0   #",
           "      #*0 0  #",
           "      ########"],
   boulders: 10},
  
  {field: ["###########   ",
           "#    #    #   ",
           "#  00#00 @#   ",
           "#     0   #   ",
           "#    #    #   ",
           "## #########  ",
           "#  0 #     #  ",
           "# 00 #0 0 0#  ",
           "#  0     0 #  ",
           "# 000#0  0 ###",
           "#    #  0 0 *#",
           "##############"],
   boulders: 20},
                                         
  {field: ["##########    ",
           "#@      *#    ",
           "#       ##    ",
           "####### ######",
           " #           #",
           " # 0 0 0 0 0 #",
           "######## #####",
           "#   0 0  0 0 #",
           "#   0        #",
           "##### ########",
           " #  0 0 0   # ",
           " #     0    # ",
           " # 0 0   0 ## ",
           "####### ####  ",
           "#  0     #    ",
           "#        #    ",
           "#   ######    ",
           "#####         "],
   boulders: 16},

  {field: [" ####         ",
           "## @########  ",
           "#          #  ",
           "# 0#####0# #  ",
           "#  #   # 0 #  ",
           "# 0 0    0##  ",
           "# 0  0  #  #  ",
           "# ####0 ## #  ",
           "#  0   0 # ## ",
           "# ###0#   0 ##",
           "#   #  0# 0 *#",
           "#  0      ####",
           "#####  #  #   ",
           "    #######   "],
   boulders: 12},

  {field: ["######    #####",
           "#  #*##  ##   #",
           "#     #### 0  #",
           "# 00  #  #  0 #",
           "##  00#   00 ##",
           " #0  0   #0  # ",
           " # 00 #  #  0# ",
           " # 0 0#### 0 # ",
           " #       #  ## ",
           " #### 0  # ##  ",
           "    ### ## #   ",
           "     # 0   #   ",
           "     #@ #  #   ",
           "     #######   "],
   boulders: 18}];

function Square( character, img) { 
	console.log("inside square");
	this.img = img; 
	var content = {"@": "player", "#": "wall", "*": "exit", " ": "empty", "0": "boulder"}[character]; 
	if (content == null) throw new Error("Unrecognized character: '" + character + "'"); 
	this.setContent(content); 
	
}
	Square.prototype.setContent = function(content) { this.content = content; this.img.src = "img/sokoban/" + content + ".png"; };
	
function SokobanField( level) { 
	
	console.log("inside SokobanField"+level);
	this.fieldDiv = dom("DIV"); 
	this.squares = []; 
	this.bouldersToGo = level.boulders; 
	for (var y = 0; y < level.field.length; y ++) { 
		var line = level.field[ y], squareRow = []; 
		for (var x = 0; x < line.length; x ++) { 
			var img = dom("IMG"); this.fieldDiv.appendChild( img); 
			squareRow.push( new Square( line.charAt( x), img)); 
			if (line.charAt( x) == "@") this.playerPos = new Point( x, y); 
			} 
			this.fieldDiv.appendChild( dom("BR")); this.squares.push( squareRow); 
		} 
	}
	
SokobanField.prototype.status = function() { 
	
	
	return this.bouldersToGo + "boulder" + (this.bouldersToGo == 1 ? "" : "s") + " to go."; 
	};
	SokobanField.prototype.won = function() { return this.bouldersToGo <= 0; };
	
	SokobanField.prototype.place = function( where) { 
		where.appendChild( this.fieldDiv); 
		}; 
		SokobanField.prototype.remove = function() { this.fieldDiv.parentNode.removeChild( this.fieldDiv); };

SokobanField.prototype.move = function( direction) { 
	var playerSquare = this.squares[ this.playerPos.y][this.playerPos.x], targetPos = this.playerPos.add( direction), targetSquare = this.squares[ targetPos.y] [targetPos.x]; 
	// First, see if the player can push a boulder... 
	if (targetSquare.content == "boulder") { var pushPos = targetPos.add( direction), pushSquare = this.squares[pushPos.y][pushPos.x]; 
		if (pushSquare.content == "empty") { targetSquare.setContent("empty"); pushSquare.setContent("boulder"); 
		}else if (pushSquare.content == "exit") { targetSquare.setContent("empty"); this.bouldersToGo--; 
		} 
		} 
		// Then, try to move... 
		if (targetSquare.content == "empty") { 
			playerSquare.setContent("empty"); targetSquare.setContent("player"); this.playerPos = targetPos; 
			} 
};

/*SokobanGame.prototype.newGame = function() { 
	this.level = 0; 
	this.resetLevel(); 
	}; */
function SokobanGame(levels, place) { 
	console.log("inside sokonab game");
	this.levels = levels; 
	var me=this;
	 var newGame = dom("BUTTON", null, "New game"); 
	addHandler(newGame, "click", method( this, "newGame")); 
	var reset = dom("BUTTON", null, "Reset level"); 
	addHandler(reset, "click", method( this, "resetLevel")); 
	this.status = dom("DIV"); 
	this.container = dom("DIV", null, dom("H1", null, "Sokoban"), dom("DIV", null, newGame, " ", reset), this.status); 
	place.appendChild( this.container); 
	addHandler(document, "keydown", method( this, "keyDown")); 
	
	this.newGame = function (){
		me.level = 0; 
		console.log(this.level);
		me.resetLevel(); 
	};
	
	this.resetLevel= function(){
		console.log("inside reset level");
		if (me.field) me.field.remove(); 
		me.field = new SokobanField( me.levels[ me.level]); me.field.place( me.container); me.updateStatus();
	};
	this.updateStatus = function(){
		me.status.innerHTML = "Level " + (1 + me.level) + ": " + me.field.status();
	};
	this.keyDown = function( event) { 
	if (arrowKeyCodes.hasOwnProperty( event.keyCode)) { 
		event.stop(); 
		me.field.move( arrowKeyCodes[ event.keyCode]); 
		me.updateStatus(); 
		if (me.field.won()) { 
			if (me.level < me.levels.length - 1) { 
				alert("Excellent! Going to the next level."); 
				me.level ++; me.resetLevel(); 
				} else { alert(" You win! Game over."); 
				me.newGame(); 
				} 
			} 
		} 
	};

	console.log("before new game");
	this.newGame();
	console.log("after new game");
	console.log(this.level);
}


/*SokobanGame.prototype.resetLevel = function() { 
		if (this.field) this.field.remove(); 
		this.field = new SokobanField( this.levels[ this.level]); this.field.place( this.container); this.updateStatus(); 
		}; 
SokobanGame.prototype.updateStatus = function() { 
			this.status.innerHTML = "Level " + (1 + this.level) + ": " + this.field.status(); 
			};*/


var arrowKeyCodes = { 
	37: new Point(-1, 0), // left 
	38: new Point( 0, -1), // up 39: 
	39: new Point( 1, 0), // right 40: 
	 40: new Point( 0, 1)  // down
	  };
	  
SokobanGame.prototype.keyDown = function( event) { 
	if (arrowKeyCodes.hasOwnProperty( event.keyCode)) { 
		event.stop(); 
		this.field.move( arrowKeyCodes[ event.keyCode]); 
		this.updateStatus(); 
		if (this.field.won()) { 
			if (this.level < this.levels.length - 1) { 
				alert("Excellent! Going to the next level."); 
				this.level ++; this.resetLevel(); 
				} else { alert(" You win! Game over."); 
				this.newGame(); 
				} 
			} 
		} 
	};
































	
	















 






