	function alertMaze() {

	var maze = [['@','@','@','@','@','@','@','@','@','@','@'],
				['@','@','@','@','@','@','@','@','@','@','@'],
				['@','@','E','@','E','@','E','@','E','@','@'],
				['@','@','@','@','@','@','@','@','@','@','@'],
				['@','@','E','@','E','@','E','@','E','@','@'],
				['@','@','@','@','@','@','@','@','@','@','@'],
				['@','@','E','@','E','@','E','@','E','@','@'],
				['@','@','@','@','@','@','@','@','@','@','@'],
				['@','@','E','@','E','@','E','@','E','@','@'],
				['@','@','@','@','@','@','@','@','@','@','@'],
				['@','@','@','@','@','@','@','@','@','@','@']];
	var newMaze = makeMaze(maze, [2,2]);
	var temp="";
	for(var i = 0; i < newMaze[0].length; i++) {
 		for(var z = 0; z < newMaze.length; z++) {
 			 temp+=newMaze[i][z];
 		}
 		temp+="\n";
	}
	console.log(temp);

	}

	function makeScaleMaze(size) {

		var maze = [];
		for(var i = 0; i < size; i++)
		{
			maze[i] = [];
		}
		for(var i = 0; i < size; i++)
		{
			maze[0][i] = '@';
			maze[1][i] = '@';
			maze[i][0] = '@';
			maze[i][1] = '@';
			maze[size-2][i] = '@';
			maze[size-1][i] = '@';
			maze[i][size-2] = '@';
			maze[i][size-1] = '@';
		}
		for (var x = 2; x < size-2; x++)
		{
			for (var y = 2; y < size-2; y++)
			{
				if(x%2 != 0)
				{
					maze[x][y] = '@';
				}
				else{
					if(y%2 == 0){
						maze[x][y] = 'E';
					}
					else{
						maze[x][y] = '@';
					}
				}
			}
		}

		maze = makeMaze(maze, [2,2]);
		var startRow = randomIntFromInterval(2, size-2);
		var startCol = 1
		var endRow = randomIntFromInterval(2, size-2);
		var endCol = size-2;
		maze[startRow][startCol] = 'S';
		maze[endRow][endCol] = 'F';
		printMaze(maze);
		//return maze;

	}

	function printMaze(maze){
		var temp="";
		for(var i = 0; i < maze[0].length; i++) {
 			for(var z = 0; z < maze.length; z++) {
 				 temp+=maze[i][z];
 			}
 			temp+="\n";
		}
		console.log(temp);
	}

	function randomIntFromInterval(min,max)
	{
		var x = 0;
		do{
			x = Math.floor(Math.random()*(max-min+1)+min);
		}while(x % 2 != 0)
    	return x;
	}
	
	function makeMaze(maze, curCoords) {

		var curRow = curCoords[0];
		var curCol = curCoords[1];
		maze[curRow][curCol]='V';
		var moves = ['u','d','l','r'];
		var moveQueue = [];

		var firstMove;

		for(var i = 0; i < 4; i++)
		{
			firstMove = Math.floor(Math.random() * moves.length);
			moveQueue[i] = moves[firstMove];
			moves.splice(firstMove, 1);
		}
		for(var j = 0; j < 4; j++)
		{
			if(moveQueue[j]=='u')
			{
				if(maze[curRow-2][curCol] != '@' && maze[curRow-2][curCol] == 'E')
				{
					maze[curRow-1][curCol] = 'V';
					maze[curRow-2][curCol] = 'V';
					curRow = curRow-2;
					maze = makeMaze(maze, [curRow, curCol]);
					j = 0;
				}
			}
			else if(moveQueue[j]=='d')
			{
				if(maze[curRow+2][curCol] != '@' && maze[curRow+2][curCol] == 'E')
				{
					maze[curRow+1][curCol] = 'V';
					maze[curRow+2][curCol] = 'V';
					curRow = curRow+2;
					maze = makeMaze(maze, [curRow, curCol]);
					j = 0;
				}
			}
			else if(moveQueue[j]=='l')
			{
				if(maze[curRow][curCol-2] != '@' && maze[curRow][curCol-2] == 'E')
				{
					maze[curRow][curCol-1] = 'V';
					maze[curRow][curCol-2] = 'V';
					curCol = curCol-2;
					maze = makeMaze(maze, [curRow, curCol]);
					j = 0;
				}
			}
			else if(moveQueue[j]=='r')
			{
				if(maze[curRow][curCol+2] != '@' && maze[curRow][curCol+2] == 'E')
				{
					maze[curRow][curCol+1] = 'V';
					maze[curRow][curCol+2] = 'V';
					curCol = curCol+2;
					maze = makeMaze(maze, [curRow, curCol]);
					j = 0;
				}
			}
		}
		return maze;

	}
