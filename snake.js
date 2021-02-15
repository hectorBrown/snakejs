const canvas = document.getElementById('game-panel');
const scoreBox = document.getElementById('score-counter');
document.addEventListener('keydown', function(event) { keyDown(event); } );
const ctx = canvas.getContext('2d');
const CANVASWIDTH = canvas.width; 
const CANVASHEIGHT = canvas.height;
const CELLSIZE = 20;
const CELLSINX = CANVASWIDTH / CELLSIZE;
const CELLSINY = CANVASHEIGHT / CELLSIZE;
const INITSNAKELENGTH = 5; //5

const GAMEOVERSTRING = "GAME OVER";
const GAMEOVERFONTSIZE = 30;
const GAMEOVERRECTPADDING = 10;
const GAMEOVERTEXTPUSH = 23;

var clock = 0;
var loopTime = 7;

var gameOver = false;
var score = 0;

var directionChangeUsed = false;
var directionChangeQueue = [];

var DirectionEnum = {
	UP: 1,
	RIGHT: 2,
	DOWN: 3,
	LEFT: 4,
};
var direction = DirectionEnum.RIGHT;

var snake = [];
var left = Math.floor(CELLSINX / 2) * CELLSIZE; 
var Top = Math.floor(CELLSINY / 2) * CELLSIZE;
for (var i = 0; i <= INITSNAKELENGTH - 1; i++) {
	var rect = {};
	rect.left = left; 
	rect.Top = Top;
	snake.push(rect);
	left -= CELLSIZE;
}

var apple = {};

function keyDown(event) {
	if (!(directionChangeUsed)) {
		if (event.keyCode == 37 && !(direction == DirectionEnum.RIGHT)) {
			directionChangeUsed = true;
			directionChangeQueue = [];
			directionChangeQueue.push(DirectionEnum.LEFT);
		} else if (event.keyCode == 38 && !(direction == DirectionEnum.DOWN)) {
			directionChangeUsed = true;
			directionChangeQueue = [];
			directionChangeQueue.push(DirectionEnum.UP);
		} else if (event.keyCode == 39 && !(direction == DirectionEnum.LEFT)) {
			directionChangeUsed = true;
			directionChangeQueue = [];
			directionChangeQueue.push(DirectionEnum.RIGHT);
		} else if (event.keyCode == 40 && !(direction == DirectionEnum.UP)) {
			directionChangeUsed = true;
			directionChangeQueue = [];
			directionChangeQueue.push(DirectionEnum.DOWN);
		}
	} else {
		if (event.keyCode == 37 && !(directionChangeQueue[directionChangeQueue.length - 1] == DirectionEnum.RIGHT)) {
			directionChangeQueue.push(DirectionEnum.LEFT);
		} else if (event.keyCode == 38 && !(directionChangeQueue[directionChangeQueue.length - 1] == DirectionEnum.DOWN)) {
			directionChangeQueue.push(DirectionEnum.UP);
		} else if (event.keyCode == 39 && !(directionChangeQueue[directionChangeQueue.length - 1] == DirectionEnum.LEFT)) {
			directionChangeQueue.push(DirectionEnum.RIGHT);
		} else if (event.keyCode == 40 && !(directionChangeQueue[directionChangeQueue.length - 1] == DirectionEnum.UP)) {
			directionChangeQueue.push(DirectionEnum.DOWN);
		}
	}
}

function update() {
	var temp = {};
	temp.left = snake[snake.length - 1].left;
	temp.Top = snake[snake.length - 1].Top;
	for (var i = snake.length - 1; i >= 1; i--) {
		snake[i].left = snake[i - 1].left;
		snake[i].Top = snake[i - 1].Top;
	}
	
	if (directionChangeQueue.length > 0) {
		direction = directionChangeQueue.shift();
	}
	
	switch (direction) {
		case 1:
			snake[0].Top -= CELLSIZE;
			break;
		case 2:
			snake[0].left += CELLSIZE;
			break;
		case 3:
			snake[0].Top += CELLSIZE;
			break;
		case 4:
			snake[0].left -= CELLSIZE;
			break;
		default:
			break;
	}
	if (snake[0].Top == -CELLSIZE) {
		snake[0].Top = CANVASHEIGHT - CELLSIZE;
	} else if (snake[0].Top == CANVASHEIGHT) {
		snake[0].Top = 0;
	} else if (snake[0].left == CANVASWIDTH) {
		snake[0].left = 0;
	} else if (snake[0].left == -CELLSIZE) {
		snake[0].left = CANVASWIDTH - CELLSIZE;
	}
	
	for (var i = 1; i <= snake.length - 1; i++) {
		if (snake[i].Top == snake[0].Top && snake[i].left == snake[0].left) {
			gameOver = true;
		}
	}
	if (snake[0].left == apple.left && snake[0].Top == apple.Top) {
		score++;
		placeApple();
		snake.push(temp);
		if (score % 10 == 0 && !(loopTime == 1)) {
			loopTime--;
		}
	}
	
	scoreBox.innerHTML = 'Score: '.concat(score.toString());
}
function draw() {
	ctx.beginPath();
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,CANVASWIDTH,CANVASHEIGHT);
	
	ctx.fillStyle = 'red';
	ctx.fillRect(apple.left, apple.Top, CELLSIZE, CELLSIZE);
	
	ctx.fillStyle = 'green';
	for (var i = 0; i <= snake.length - 1; i++) {
		ctx.fillRect(snake[i].left, snake[i].Top, CELLSIZE, CELLSIZE);
	}
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = 'white';
	for (var x = 0; x <= CANVASHEIGHT; x += CELLSIZE) {
		ctx.moveTo(x,0);
		ctx.lineTo(x,CANVASHEIGHT);
		ctx.stroke();
	}
	for (var y = 0; y <= CANVASWIDTH; y += CELLSIZE) {
		ctx.moveTo(0,y);
		ctx.lineTo(CANVASWIDTH,y);
		ctx.stroke();
	}
	
	if (gameOver) {
		ctx.font = GAMEOVERFONTSIZE.toString().concat('px Arial');
		ctx.fillStyle = 'red';
		var left = Math.floor(CANVASWIDTH / 2 - ctx.measureText(GAMEOVERSTRING).width / 2);
		var Top = Math.floor(CANVASHEIGHT / 2 - GAMEOVERFONTSIZE / 2);
		ctx.fillRect(left - GAMEOVERRECTPADDING, Top - GAMEOVERRECTPADDING, ctx.measureText(GAMEOVERSTRING).width + 2 * GAMEOVERRECTPADDING, GAMEOVERFONTSIZE + 2 * GAMEOVERRECTPADDING);
		ctx.fillStyle = 'white';
		ctx.fillText(GAMEOVERSTRING, left, Top + GAMEOVERTEXTPUSH);
	}
}
function placeApple() {
	apple.left = ranint(0,CELLSINX - 1) * CELLSIZE;
	apple.Top = ranint(0, CELLSINY - 1) * CELLSIZE;
	for (var i = 0; i <= snake.length - 1; i++) {
		if (apple.left == snake[i].left && apple.Top == snake[i].Top) {
			placeApple();
		}
	}
}
function ranint(min, max) {
	max++;
	var random = Math.floor(Math.random() * (max - min)) + min;
	return random;
}
function gameLoop() {
	if (clock == loopTime) {
		update();
		draw();
		directionChangeUsed = false;
		clock = 0;
	}
	clock++;
	if (!(gameOver)) {
		requestAnimationFrame(gameLoop);
	}
}
placeApple();
requestAnimationFrame(gameLoop);
