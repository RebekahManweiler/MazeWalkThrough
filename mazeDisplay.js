
//Parts of code based off of HTML Game Example from W3Schools http://www.w3schools.com/graphics/game_intro.asp
var myGamePiece;
var forwardView;
var leftView;
var rightView;

document.onkeyup = updateGameArea;

/**
 * Starts and runs the game
 * @post Game is up and running in a loaded canvas
 */
function startGame() {

    myGameArea.start();
    myGameArea.loadMaze();
	myGamePiece = new component(30, 30, "player", myGameArea.startRow*30, myGameArea.startCol*30, "east");
	myGameArea.loadMaze();
	myGameArea.loadWalls();
}

/**
 * Creates the game area that the player will be playing the maze game inside of
 * @post A game area is created with its components and functions
 */
var myGameArea = {
    canvas : document.createElement("canvas"),
    mazes : [getMaze(19)],
    level : 0,
    /**
     * Creates the canvas
     * @post a canvas is created
     */
    start : function() {
        this.canvas.width = 570;
        this.canvas.height = 570;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        },
    /**
     * Clears the canvas of all rectangles
     * @post every rectangle is cleared from the canvas
     */
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    /**
     * Loads the maze into the canvas
     * @post the maze is in the canvas
     */
    loadMaze : function() {
    	this.holes = [];
    	for (var i = 0; i < 19; i++)
    	{
    		for (var j = 0; j < 19; j++)
    		{
    			if(this.mazes[this.level][j*19+i] == 'H' && this.level != 0)
    			{
    				this.holes.push(new component(30, 30, "hole", i*30, j*30, 0));
    			}
    			else if(this.mazes[this.level][j*19+i] == "E")
    			{
    				this.endComponent = new component(30, 30, "end", i*30, j*30, 0);
    			}
    			else if(this.mazes[this.level][j*19+i] == "S")
    			{
    				this.startRow = i;
    				this.startCol = j;
    			}
    		}
    	}

    },

    /**
     * Calls getMaze to set up the maze for the next level
     * @post the maze for the next level is set up
     */
    loadNextMaze : function() {
    	this.mazes.push(getMaze(19));
    },

    /**
     * Creates the walls for the maze
     * @post the walls are created 
     */
    loadWalls : function() {
    	this.walls = [];
    	for (var i = 0; i < 19; i++)
    	{
    		for (var j = 0; j < 19; j++)
    		{
    			if(this.mazes[this.level][j*19+i] == "W")
    			{
    				this.walls.push(new component(30, 30, "wall", i*30, j*30, 0));
    			}
    		}
    	}
    	this.context.fillStyle = "white";
    	this.context.font="20px Times New Roman";
    	this.context.fillText("Level: " + (this.level+1), 10, 50);
    }
    
}


/**
 * Creates an individual component for a grid space
 * @pre all values are valid (direction only needed for player piece)
 * @param width is the width of the component in the y direction
 * @param height is the height of the component in the x direction
 * @param id is the id of the object to determine what it is
 * @param x is the x coordinate of the top left corner of the component
 * @param y is the y coordinate of the top left corner of the component
 * @param direction is the direction of a player component is facing
 * @post a component is created and added to the canvas
 */
function component(width, height, id, x, y, direction) {
    this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.direction = direction;
	ctx = myGameArea.context;
	this.id = id;
	if(id == "player")
	{
		this.color = "red";
	}
	else if(id == "perspective")
	{
		this.color = "white";
	}
	else if(id == "wall")
	{
		this.color = "gray";
	}
	else if(id == "end")
	{
		this.color = "blue";
	}
	else if(id == "hole")
	{
		this.color = "black";
	}
	else if(id == "prime")
	{
		this.color = "yellow";
	}
	else if(id == "triggered")
	{
		this.color = "green";
	}
	else{this.color = "black";}
	ctx.fillStyle = this.color;
	ctx.fillRect(this.x, this.y, this.width, this.height);
	if(this.direction == "north"){
		forwardView = new component(this.width, this.height, "prime", this.x, this.y - 30, 0);
		leftView = new component(this.width, this.height, "perspective", this.x - 30, this.y, 0);
		rightView = new component(this.width, this.height, "perspective", this.x + 30, this.y, 0);
	}
	if(this.direction == "east"){
		forwardView = new component(this.width, this.height, "prime", this.x + 30, this.y, 0);
		leftView = new component(this.width, this.height, "perspective", this.x, this.y - 30, 0);
		rightView = new component(this.width, this.height, "perspective", this.x, this.y + 30, 0);
	}
	if(this.direction == "south"){
		forwardView = new component(this.width, this.height, "prime", this.x, this.y + 30, 0);
		leftView = new component(this.width, this.height, "perspective", this.x + 30, this.y, 0);
		rightView = new component(this.width, this.height, "perspective", this.x -30, this.y, 0);
	}
	if(this.direction == "west"){
		forwardView = new component(this.width, this.height, "prime", this.x - 30, this.y, 0);
		leftView = new component(this.width, this.height, "perspective", this.x, this.y + 30, 0);
		rightView = new component(this.width, this.height, "perspective", this.x, this.y - 30, 0);
	}
	/**
	 * A player piece is given a new position on the canvas
	 * @param dir is the direction the player piece is facing
	 * @post the player piece is given a new position based on where it was facing
	 */
	this.newPos = function(dir) {
		this.direction = dir;
		var move = true;
		if(dir == "north"){
			for(var i = 0; i < myGameArea.walls.length; i++)
			{
				if(myGameArea.walls[i].y == this.y-30 && myGameArea.walls[i].x == this.x)
				{
					move = false;
				}
			}
			for(var i = 0; i < myGameArea.holes.length; i++)
			{
				if(myGameArea.holes[i].y == this.y-30 && myGameArea.holes[i].x == this.x)
				{
					if(myGameArea.level != 0)
					{
						alert("You fell in a hole and went down a level!");
						myGameArea.level -= 1;
						myGameArea.loadMaze();
						myGameArea.clear();
						startGame();
					}else{};
				}
			}
			if(move){
				this.y -= 30;
			}
		}
		if(dir == "south"){
			for(var i = 0; i < myGameArea.walls.length; i++)
			{
				if(myGameArea.walls[i].y == this.y+30 && myGameArea.walls[i].x == this.x)
				{
					move = false;
				}
			}
			for(var i = 0; i < myGameArea.holes.length; i++)
			{
				if(myGameArea.holes[i].y == this.y+30 && myGameArea.holes[i].x == this.x)
				{
					if(myGameArea.level != 0)
					{
						alert("You fell in a hole and went down a level!");
						myGameArea.level -= 1;
						myGameArea.loadMaze();
						myGameArea.clear();
						startGame();
					}else{};
				}
			}
			if(move){
				this.y += 30;
			}
		}
		if(dir == "east"){
			for(var i = 0; i < myGameArea.walls.length; i++)
			{
				if(myGameArea.walls[i].x == this.x+30 && myGameArea.walls[i].y == this.y)
				{
					move = false;
				}
			}
			for(var i = 0; i < myGameArea.holes.length; i++)
			{
				if(myGameArea.holes[i].x == this.x+30 && myGameArea.holes[i].y == this.y)
				{
					if(myGameArea.level != 0)
					{
						alert("You fell in a hole and went down a level!");
						myGameArea.level -= 1;
						myGameArea.loadMaze();
						myGameArea.clear();
						startGame();
					}else{};
				}
			}
			if(move){
				this.x += 30;
			}
		}
		if(dir == "west"){
			for(var i = 0; i < myGameArea.walls.length; i++)
			{
				if(myGameArea.walls[i].x == this.x-30 && myGameArea.walls[i].y == this.y)
				{
					move = false;
				}
			}
			for(var i = 0; i < myGameArea.holes.length; i++)
			{
				if(myGameArea.holes[i].x == this.x-30 && myGameArea.holes[i].y == this.y)
				{
					if(myGameArea.level != 0)
					{
						alert("You fell in a hole and went down a level!");
						myGameArea.level -= 1;
						myGameArea.loadMaze();
						myGameArea.clear();
						startGame();
					}else{};
				}
			}
			if(move){
				this.x -= 30;
			}
		}
	}
	/**
	 * A player piece is given a new direction to face
	 * @param dir is the new direction the player piece is given based on already facing north
	 * @post the player piece is facing a new direction
	 */
	this.setNewDirection = function(dir){
		if(dir == "west")
		{
			if(this.direction == "north"){this.direction = "west"}
			else if(this.direction == "west"){this.direction = "south"}
			else if(this.direction == "south"){this.direction = "east"}
			else {this.direction = "north"}
		}
		else if(dir == "east")
		{
			if(this.direction == "north"){this.direction = "east"}
			else if(this.direction == "east"){this.direction = "south"}
			else if(this.direction == "south"){this.direction = "west"}
			else{this.direction = "north"}
		}
		else if(dir == "south")
		{
			if(this.direction == "north"){this.direction = "south"}
			else if(this.direction == "east"){this.direction = "west"}
			else if(this.direction == "south"){this.direction = "north"}
			else{this.direction = "east"}
		}

	}
	/**
	 * Updates the canvas with the new components
	 * @post the canvas is updated and redrawn
	 */
	this.update = function(){
		ctx = myGameArea.context;
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
		myGameArea.loadMaze();
		if(this.direction == "north"){
			forwardView = new component(this.width, this.height, "prime", this.x, this.y - 30, 0);
			leftView = new component(this.width, this.height, "perspective", this.x - 30, this.y, 0);
			rightView = new component(this.width, this.height, "perspective", this.x + 30, this.y, 0);
		}
		if(this.direction == "east"){
			forwardView = new component(this.width, this.height, "prime", this.x + 30, this.y, 0);
			leftView = new component(this.width, this.height, "perspective", this.x, this.y - 30, 0);
			rightView = new component(this.width, this.height, "perspective", this.x, this.y + 30, 0);
		}
		if(this.direction == "south"){
			forwardView = new component(this.width, this.height, "prime", this.x, this.y + 30, 0);
			leftView = new component(this.width, this.height, "perspective", this.x + 30, this.y, 0);
			rightView = new component(this.width, this.height, "perspective", this.x - 30, this.y, 0);
		}
		if(this.direction == "west"){
			forwardView = new component(this.width, this.height, "prime", this.x - 30, this.y, 0);
			leftView = new component(this.width, this.height, "perspective", this.x, this.y + 30, 0);
			rightView = new component(this.width, this.height, "perspective", this.x, this.y - 30, 0);
		}
		myGameArea.loadWalls();
	}
	
}

/**
 * Updates the game area based on user input
 * @param e is the window event activated when someone presses a button
 * @post the game area is updated
 */
function updateGameArea(e) {
    e = e || window.event;
	if(e.keyCode >= '37' && e.keyCode <= '40')
	{
		myGameArea.clear()
		if(e.keyCode == '38')
		{
			myGamePiece.newPos(myGamePiece.direction);
			myGamePiece.update();
		}
		if(e.keyCode == '40')
		{
			myGamePiece.setNewDirection("south");
			//myGamePiece.newPos(myGamePiece.direction);
			myGamePiece.update();
		}
		if(e.keyCode == '37')
		{
			myGamePiece.setNewDirection("west");
			//myGamePiece.newPos(myGamePiece.direction);
			myGamePiece.update();
		}
		if(e.keyCode == '39')
		{
			myGamePiece.setNewDirection("east");
			//myGamePiece.newPos(myGamePiece.direction);
			myGamePiece.update();
		}
		
	}
	if(myGamePiece.x == myGameArea.endComponent.x && myGamePiece.y == myGameArea.endComponent.y)
	{
		myGameArea.level += 1;
		if(myGameArea.mazes[myGameArea.level] == null)
		{
			myGameArea.loadNextMaze();
		}
		myGameArea.clear();
		startGame();
	}
}