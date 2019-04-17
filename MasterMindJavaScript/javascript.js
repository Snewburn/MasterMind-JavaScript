/*This is the javascript control logic*/
//global variable for target storage
var TARGETCODE = generateTargetCode();
var GUESSNUMBER = 1;

//method is called from img ondrag. takes an event and sets the data for that event. 
function drag(ev)
{
	ev.dataTransfer.setData("text", ev.target.id);
}

//function is called from div ondragover. 
function allowDrop(ev)
{
	ev.preventDefault();
}

function drop(ev)
{
	ev.preventDefault();
	
	//get the dragged img data
	var data = ev.dataTransfer.getData("text");
	//convert data to element so that id string will be available
	var elem = document.getElementById(data);
	
	//based on the id of the peg, set the background color of the hole
	switch(elem.id)
	{
		case "redpeg":
			ev.target.style.backgroundColor="red";
			break;
		case "bluepeg":
			ev.target.style.backgroundColor="blue";
			break;
		case "greenpeg":
			ev.target.style.backgroundColor="green";
			break;
		case "whitepeg":
			ev.target.style.backgroundColor="white";
			break;
		case "blackpeg":
			ev.target.style.backgroundColor="black";
			break;
		case "orangepeg":
			ev.target.style.backgroundColor="orange";
			break;					
	}	
}

//method processes drag selection and returns the guess as an array
function evalClick()
{
	//get strings for the hole colors
	var hole1Color = document.getElementById("drophole1").style.backgroundColor;
	var hole2Color = document.getElementById("drophole2").style.backgroundColor;
	var hole3Color = document.getElementById("drophole3").style.backgroundColor;
	var hole4Color = document.getElementById("drophole4").style.backgroundColor;

	
	//ensure that all holes are filled by checking for empty strings
	if( hole1Color == "grey" || hole2Color == "grey" || hole3Color == "grey" || hole4Color == "grey" )
	{
		
		
		document.getElementById("instructionprompt").innerHTML="You must choose for every hole";
	}else	//if all pegs are full, put into array and pass on to evaluate. 
	{	
		
		var guess = new Array(hole1Color, hole2Color, hole3Color, hole4Color);
		
		evaluateGuess(guess);
	}
}

//method will reset the peg holes but not the game
function holeReset()
{
	document.getElementById("drophole1").style.backgroundColor="grey";
	document.getElementById("drophole2").style.backgroundColor="grey";
	document.getElementById("drophole3").style.backgroundColor="grey";
	document.getElementById("drophole4").style.backgroundColor="grey";
}

//method generates the code that the player is attempting to match
function generateTargetCode()
{
	
	//target array stores the random target
	var target = new Array();
	
	//generate a random number betwee 1-6, change to a color, assign to array elem 0-3
	for (var i = 0; i < 4; i++)
	{
		var ranNum = Math.floor((Math.random() * 6) + 1);
		var ranColor;
		
		switch(ranNum)
		{
			case 1:
				ranColor = "red";
				break;
			case 2:
				ranColor = "blue";
				break;
			case 3:
				ranColor = "green";
				break;
			case 4:
				ranColor = "orange";
				break;
			case 5:
				ranColor = "black";
				break;
			case 6:
				ranColor = "white";
				break;
		}
		target[i] = ranColor;
	}	
	
	
	return target;
}

function evaluateGuess(guess)
{	
	console.log("target: " + TARGETCODE);
	
	var grade = gradeGuess(guess);
	
	//have guess and grade displayed in results page
	displayGuessGrade(guess, grade);
	
	//print insturuction
	document.getElementById("instructionprompt").innerHTML="Guess number " + GUESSNUMBER + " has been evaluated";
	
	
	//check for win
	if(grade[0] == 4)
	{
		document.getElementById("instructionprompt").innerHTML="YOU WON!!!";
		
		holeReset();
		
		GUESSNUMBER = 1;
		
		//document.getElementById("resultsdisplay").innerHTML=" ";
	
	}else if(GUESSNUMBER < 10) //if player has more guesses left
	{
		//update guess number
		GUESSNUMBER++;
		
		//reset the holes
		holeReset();
	}else	//game over on max tries
	{
		document.getElementById("instructionprompt").innerHTML += "i'm sorry, you lost after max tries";
	}
}


//guess is the players guess, grade is an array of two elements [0]: red pegs and [1] white pegs
function displayGuessGrade(guessParam, gradeParam)
{
	//find results display and append to it
	var resultsDisplay = document.getElementById("resultsdisplay");
	resultsDisplay.innerHTML += GUESSNUMBER + ": ";
	
	
	//loop through guess and append images to line
	for (var i = 0; i < 4; i++)
	{
		var img = document.createElement("IMG");
		img.src = "images/" + guessParam[i] + "peg.jpg";
		img.style.width="20px";
		img.style.height="20px";
		resultsDisplay.appendChild(img);
	}
	
	//display line break and grade
	resultsDisplay.innerHTML += "-----";
	
	//reed pegs grade
	for(var i = 0; i < gradeParam[0]; i++)
	{
		var img = document.createElement("IMG");
		img.src = "images/redpeg.jpg";
		img.style.width="10px";
		img.style.height="10px";
		resultsDisplay.appendChild(img);
	}
	
	//white peg grade
	for(var i = 0; i < gradeParam[1]; i++)
	{
		var img = document.createElement("IMG");
		img.src = "images/whitepeg.jpg";
		img.style.width="10px";
		img.style.height="10px";
		resultsDisplay.appendChild(img);
	}
	
	resultsDisplay.innerHTML += "<br/>";
	
}

//gradeGuess compares the target and the guess and 
// returns a peg array [0]Red pegs, [1]White pegs 
function gradeGuess(userGuess)
{	
   var pegs = [0, 0];	//array to return
   
   //these arrays track if a symbol has been matched.        
   var playerSymbolMatched = [' ', ' ', ' ', ' '];      
   var targetSymbolMatched = [' ', ' ', ' ', ' '];	
   
   //First look for red pegs - compare each player guess with corresponding target
   for(var i = 0; i < 4; i++)
   {
	   //if a match is found: mark each match array with 'M' and increment the red peg count (pegs[0]) 
	   if (userGuess[i] == TARGETCODE[i])
	   {
		   playerSymbolMatched[i] = 'M';
		   targetSymbolMatched[i] = 'M';
		   pegs[0]++;
	   }
   }               
   
   //Look for white pegs
   //compare each guess symbol with each target symbol
   for(var i = 0; i < 4; i++)	//outer loop iterates through player symbols
   {
	   for (var j = 0; j < 4; j++)	//inner loop iterates through target symbols
	   {
		   //if symbol has been matched already, do nothing    		   
		   var symbolTakenCondition = false;
					   
		   if (playerSymbolMatched[i] == 'M' || targetSymbolMatched[j] == 'M')
		   {
			   symbolTakenCondition = true;
		   }
		   
		   //if there is a match and symbol has not been taken,
		   //increment white pegs and mark both symbols as matched.  
		   if (userGuess[i] == TARGETCODE[j] && symbolTakenCondition == false) //player symbol matches a target symbol
		   {    			  
			   pegs[1]++;
			   playerSymbolMatched[i] = 'M';
			   targetSymbolMatched[j] = 'M';    			   
		   }    		   
	   }
   }       
   
   return pegs;
}