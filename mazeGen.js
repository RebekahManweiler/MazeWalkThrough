	/**
	 * Returns the size of the given maze
	 * @param {array} maze - The maze array
	 * @pre maze is a valid and filled array that is a perfect square length
	 * @return {int} size of the given maze
	 */
	function getMazeSize(maze){
		return Math.floor(Math.sqrt(maze.length));
	}

	/**
	 * Returns a randomized maze of the given size
	 * @param {int} size - The given size of the maze
	 * @pre size is not less than 7
	 * @return {array} the filled 1D maze array
	 */
	function getMaze(size) {

		var maze = [];
		for(var i = 0; i < size; i++)
		{
			maze[i] = [];
		}
		for(var i = 0; i < size; i++)
		{
			maze[0][i] = 'W';
			maze[1][i] = 'W';
			maze[i][0] = 'W';
			maze[i][1] = 'W';
			maze[size-2][i] = 'W';
			maze[size-1][i] = 'W';
			maze[i][size-2] = 'W';
			maze[i][size-1] = 'W';
		}
		for (var x = 2; x < size-2; x++)
		{
			for (var y = 2; y < size-2; y++)
			{
				if(x%2 != 0)
				{
					maze[x][y] = 'W';
				}
				else{
					if(y%2 == 0){
						maze[x][y] = 'U';
					}
					else{
						maze[x][y] = 'W';
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
		maze[endRow][endCol] = 'E';
		maze = recurseMaze(maze, startRow, startCol);
		maze = placeHoles(maze);
		maze[startRow][startCol] = 'S';
		maze[endRow][endCol] = 'E';
		return twoToOne(maze);

	}

	/**
	 * 
	 *
	 *
	 */
	function mazeSolver(maze){
		var curRow = 0;
		var curCol = 0;
		for (var i = 0; i < maze.length; i++)
		{
			if(maze[i][1] == 'S')
			{
				curRow = i;
				curCol = 1;
			}
		}
		var path = recurseMaze(maze, curRow, curCol);

		return path;


	}

	function placeHoles(maze){
		for(var i = 0; i < maze.length; i++)
		{
			for(var j = 0; j < maze[i].length; j++)
			{
				if(maze[i][j] == 'P')
				{
					maze[i][j] = 'H';
				}
			}
		}
		return maze;
	}

	function recurseMaze(maze, curRow, curCol){
		if((maze[curRow-1][curCol] == 'P' || maze[curRow-1][curCol] == 'E') && maze[curRow-1][curCol] != 'V'){
			maze[curRow][curCol] = 'V';
			maze = recurseMaze(maze, curRow-1, curCol);
		}
		if((maze[curRow][curCol+1] == 'P' || maze[curRow][curCol+1] == 'E') && maze[curRow][curCol+1] != 'V'){
			maze[curRow][curCol] = 'V';
			maze = recurseMaze(maze, curRow, curCol+1);
		}
		if((maze[curRow+1][curCol] == 'P' || maze[curRow+1][curCol] == 'E') && maze[curRow+1][curCol] != 'V'){
			maze[curRow][curCol] = 'V';
			maze = recurseMaze(maze, curRow+1, curCol);
		}
		if((maze[curRow][curCol-1] == 'P' || maze[curRow][curCol-1] == 'E') && maze[curRow][curCol-1] != 'V'){
			maze[curRow][curCol] = 'V';
			maze = recurseMaze(maze, curRow, curCol-1);
		}
		return maze;

	}

	function twoToOne(maze){
		var temp = [];
		var tempCount = 0;
		for (var i = 0; i < maze.length; i++)
		{
			for (var j = 0; j < maze[i].length; j++)
			{
				temp[tempCount] = maze[i][j];
				tempCount++;
			}
		}
		return temp;
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
		maze[curRow][curCol]='P';
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
				if(maze[curRow-2][curCol] != '@' && maze[curRow-2][curCol] == 'U')
				{
					maze[curRow-1][curCol] = 'P';
					maze[curRow-2][curCol] = 'P';
					curRow = curRow-2;
					maze = makeMaze(maze, [curRow, curCol]);
					j = 0;
				}
			}
			else if(moveQueue[j]=='d')
			{
				if(maze[curRow+2][curCol] != '@' && maze[curRow+2][curCol] == 'U')
				{
					maze[curRow+1][curCol] = 'P';
					maze[curRow+2][curCol] = 'P';
					curRow = curRow+2;
					maze = makeMaze(maze, [curRow, curCol]);
					j = 0;
				}
			}
			else if(moveQueue[j]=='l')
			{
				if(maze[curRow][curCol-2] != '@' && maze[curRow][curCol-2] == 'U')
				{
					maze[curRow][curCol-1] = 'P';
					maze[curRow][curCol-2] = 'P';
					curCol = curCol-2;
					maze = makeMaze(maze, [curRow, curCol]);
					j = 0;
				}
			}
			else if(moveQueue[j]=='r')
			{
				if(maze[curRow][curCol+2] != '@' && maze[curRow][curCol+2] == 'U')
				{
					maze[curRow][curCol+1] = 'P';
					maze[curRow][curCol+2] = 'P';
					curCol = curCol+2;
					maze = makeMaze(maze, [curRow, curCol]);
					j = 0;
				}
			}
		}
		return maze;

	}
	function pathFinder(){

		var path = [];
		var tempRow = curRow;
		var tempCol = curCol;
		if(maze[curRow][curCol] == 'E')
		{
			maze[curRow][curCol] = 'V';
			path.push([curRow, curCol]);
			return path;
		}
		if((maze[curRow-1][curCol] == 'P' || maze[curRow-1][curCol] == 'E') && maze[curRow-1][curCol] != 'V'){
			tempRow = curRow-1;
			maze[curRow][curCol] = 'V';
			deadEnd = false;
			path = recurseMaze(maze, tempRow, tempCol);
			if (path != true)
			{
				path.unshift([curRow, curCol]);
				return path;
			}
			else{
				tempRow = curRow;
			}
		}
		if((maze[curRow][curCol+1] == 'P' || maze[curRow][curCol+1] == 'E') && maze[curRow][curCol+1] != 'V'){
			tempCol = curCol+1;
			maze[curRow][curCol] = 'V';
			deadEnd = false;
			path = recurseMaze(maze, tempRow, tempCol);
			if (path != true)
			{
				path.unshift([curRow, curCol]);
				return path;
			}
			else{
				tempCol = curCol;
			}
		}
		if((maze[curRow+1][curCol] == 'P' || maze[curRow+1][curCol] == 'E') && maze[curRow+1][curCol] != 'V'){
			tempRow = curRow+1;
			maze[curRow][curCol] = 'V';
			deadEnd = false;
			path = recurseMaze(maze, tempRow, tempCol);
			if (path != true)
			{
				path.unshift([curRow, curCol]);
				return path;
			}else{
				tempRow = curRow;
			}
		}
		if((maze[curRow][curCol-1] == 'P' || maze[curRow][curCol-1] == 'E') && maze[curRow][curCol-1] != 'V'){
			tempCol = curCol-1;
			maze[curRow][curCol] = 'V';
			deadEnd = false;
			path = recurseMaze(maze, tempRow, tempCol);
			if (path != true)
			{
				path.unshift([curRow, curCol]);
				return path;
			}else{
				tempCol = curCol;
			}
		}
		if(path == true)
		{
			return true;
		}
		return true;
	}
