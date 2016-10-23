//Explanation of Maze Orientation

//["P","E","W","W","S","W","P","W","W","W","P","P","P","P","P","P","W","P","W","P","W","P","W","P","P","P","P","P","P","P","W","W","P","W","W","P"];
//			  North(N)
//		   [P,E,W,W,S,W,
//			P,W,W,W,P,P,
//	West(W)	P,P,P,P,W,P, East(E)
//			W,P,W,P,W,P,
//			P,P,P,P,P,P,
//			W,W,P,W,W,W]
//			  South(S)
//if offset = 0 then N = the player is facing north (Player perspective is north)
//if offset = 1 then N -> E = player is facing east (player perspective is east)
//if offset = 2 then N -> S = player is facing south (player perspective is south)
//if offset = 3 then N -> W = player is facing west (player perspective is west)
//if offset = 4 then N -> N = player is facing north ...
//...


/*-------------------------------------------------------------------------------------------------------------------------------------------
getValidMoves
---------------------------------------------------------------------------------------------------------------------------------------------
	this method checks the current position of the maze and each position around it (up(north) down(south) left(west) and right(east))
	if a position next to the current position is either a passageway(P), the start(S), or the end(E) and it is within the bounds of the maze then it is considered a valid move
	all valid spaces are added to the array validMoves (unnecessary?)
	all valid spaces(directions of movement) are added to the array cardnalDirections
		these directions are not in the perspective of the player 
		they are the directions the player may move with respect to the entire maze*/
function getValidMoves(){
	//if the current position is not on the top row
	if((curPosIndex/size !== 0) && ((maze[curPosIndex-size] == "P") || (maze[curPosIndex-size] == "E") || (maze[curPosIndex-size] == "S"))){
		validMoves.push(curPosIndex-size);
		cardnalDirections.push("N");
	}
	//if the current position is not on the leftmost column
	if((curPosIndex % size !== 0) && ((maze[curPosIndex-1] == "P") || (maze[curPosIndex-1] =="E") || (maze[curPosIndex-1] =="S"))){
		validMoves.push(curPosIndex-1);
		cardnalDirections.push("W");
	}
	//if the current position is not on the bottom row
	if((curPosIndex/size !== size-1) && ((maze[curPosIndex+size] == "P") || (maze[curPosIndex+size] == "E") || (maze[curPosIndex+size] == "S"))){
		validMoves.push(curPosIndex+size);
		cardnalDirections.push("S");
	}
	//if the current position if not on the the rightmost column
	if((curPosIndex % size !== size-1) && ((maze[curPosIndex+1] == "P") || (maze[curPosIndex+1] =="E") || (maze[curPosIndex+1] =="S"))){
		validMoves.push(curPosIndex+1);
		cardnalDirections.push("E");
	}	
}

/*-------------------------------------------------------------------------------------------------------------------------------------------
directionsToPerspective(offset)
---------------------------------------------------------------------------------------------------------------------------------------------
	this method takes the directions in cardnalDirections which are with respect to the maze and offsets them recursively to the perspective of the player inside the maze
	while offset is not equal to zero, each direction in cardnalDirections is shifted once clockwise
		EX. if the player is facing east(offset = 1) and moves north, the player believes that they have just moved west (only one shift is required)
		EX. if the player is facing west(offset = 3) and moves west, the player believes that they have just moved north (three shifts are required)
	this method changes the value of cardnalDirections so that when it is used by the GUI, it can draw the necessary doors in the player's perspective
	this method does not change the global value of offset */
function directionsToPerspective(offset){
	if(offset !== 0){
		for(var i = 0; i < cardnalDirections.length; i++){
			if(cardnalDirections[i] == "N") cardnalDirections[i] = "W";
			else if(cardnalDirections[i] == "E") cardnalDirections[i] = "N";
			else if(cardnalDirections[i] == "S") cardnalDirections[i] = "E";
			else if(cardnalDirections[i] == "W") cardnalDirections[i] = "S";
		}
		directionsToPerspective(offset-1);
	}
}

/*-------------------------------------------------------------------------------------------------------------------------------------------
perspectiveToDirection(dir, curoffset)
---------------------------------------------------------------------------------------------------------------------------------------------
	this method takes a single direction that the player has chosen and turns it back into a direction with respect to the maze (exactly the same process as directionsToPerspective without the recursion)
	while curoffset is greater than zero the direction is shifted counterclockwise
		Ex. if the player is facing east(offset = 1) and believes they have moved west, the player has actually moved north (only one shift is required)
		EX. if the player is facing south(offset = 2) and believes they have moved north, the player has actually moved south (two shifts are required)
	this method returns the offset direction so the game driver can move the player in the desired direction
	this method does not change the global value of offset */
function perspectiveToDirection(dir, curoffset){
	while(curoffset > 0){
			if(dir == "N") dir = "E";
			else if(dir == "E") dir = "S";
			else if(dir == "S") dir = "W";
			else if(dir == "W") dir = "N";
			console.log("offset: " + curoffset + "  dir: " + dir);
			curoffset--;
	}
	return dir;
}

/*-------------------------------------------------------------------------------------------------------------------------------------------
directionToPosition(dir, offset)
---------------------------------------------------------------------------------------------------------------------------------------------
	this method takes a single direction with respect to the maze and turns it into an index based on the current position
	this method returns the value of the desired postion as an index of the maze */
function directionToPosition(dir, offset){
	console.log("current offset: " + offset + "  current dir: " + dir);
	dir = perspectiveToDirection(dir, offset);
	if(dir == "N") return (curPosIndex-size);
	else if(dir == "E") return (curPosIndex+1);
	else if(dir == "S") return (curPosIndex+size);
	else if(dir == "W") return (curPosIndex-1);
}

/*-------------------------------------------------------------------------------------------------------------------------------------------
checkOrientation(newpos)
---------------------------------------------------------------------------------------------------------------------------------------------
	this method takes in an index for the new postion and determines if the new position requires the player to turn (change their orientation)
	after the offset has been increased, the offset becomes the modulus of offset and four
		this will give us the smallest value of the offset and still retain the direction of the player's perspective 
	this method changes the global value of offset
	this method does not change the value of the new position*/
function checkOrientation(newpos){
	if(offset % 4 === 0){
		//orientation is north
		if(newpos == curPosIndex+1) offset += 1;
		else if(newpos == curPosIndex+size) offset += 2;
		else if(newpos == curPosIndex-1) offset += 3;
	}
	else if(offset % 4 == 1){
		//orientation is east
		if(newpos == curPosIndex+size) offset += 1;
		else if(newpos == curPosIndex-1) offset += 2;
		else if(newpos == curPosIndex-size) offset += 3;
	}
	else if(offset % 4 == 2){
		//orientation is south
		if(newpos == curPosIndex-1) offset += 1;
		else if(newpos == curPosIndex-size) offset += 2;
		else if(newpos == curPosIndex+1) offset += 3;
	}
	else{
		//orienation is west
		if(newpos == curPosIndex-size) offset += 1;
		else if(newpos == curPosIndex+1) offset += 2;
		else if(newpos == curPosIndex+size) offset += 3;
	}
	offset = offset % 4;
}


/*-------------------------------------------------------------------------------------------------------------------------------------------
gameDriver loop
---------------------------------------------------------------------------------------------------------------------------------------------
	assume that the loop is being called by the key down operation (user input)
	1)directionToPosition(chosenDirection, offset) changes the user input into an index of the maze for the desired position
	2)checkOrientation(newPosIndex) changes the user perspective based on the new position
	3)set the current position index to the new position index (move the player)
	4)reset variables for new position
	5)getValidMoves() gets the available moves for the new position
	6)directionsToPerspective(offset) changes the directions with respect to the maze to direction with respect to the user perspective
	7)draw() draws the doors for the user to choose which direction they would like to go
	8)wait for user input */
maze = getMaze();
showCurrentMaze();
var count = 0;
while(curPosSpace != "E" && count != 10){
	getValidMoves();
	console.log("valid moves: " + validMoves.toString());
	console.log("cardnal directions: " + cardnalDirections.toString());
	directionsToPerspective(offset);
	console.log("offset cardnal directions: " + cardnalDirections.toString());
	//chosenDirection = sendTOGUI(cardnalDirections);
	var chosenDirection = cardnalDirections.pop();
	console.log("chosen direction: " + chosenDirection);
	var newPosIndex = directionToPosition(chosenDirection, offset);
	console.log("new current position: " + newPosIndex);
	checkOrientation(newPosIndex);
	console.log("new offset: " + offset);
	curPosIndex = newPosIndex;
	validMoves = [];
	cardnalDirections = [];
	showCurrentMaze();
	count++;
}

