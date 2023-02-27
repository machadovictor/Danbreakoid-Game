//Variables
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let ballRadius = 8;
let x = canvas.width/2;
let y = canvas.height - 60;
let dx = 2;
let dy = -2;
let paddleHeight  = 20;
let paddleWidth = 115;
let ballHeight = 32;
let ballWidth = 32;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleY = 450;
let rightPressed = false;
let leftPressed = false;
let brickRowCount = 6;
let brickColumnCount = 10;
let brickWidth = 40;
let brickHeight = 10;
let brickSWidth = 82;
let brickSHeight = 32;
let brickPadding = 10;
let brickOffsetTop = 75;
let brickOffsetLeft = 80;
let score = 0;
let lives = 3;
let lifeFrame = 0;
let isSpacePressed = false;
let lifeWidth = 800;
let lifeHeight = 800/3;


//Images
let ballImg = new Image();
ballImg.src = "image/ball.png"
ballImg.onload = function() {
    window.requestAnimationFrame(drawBall);
};

let paddleImg = new Image();
paddleImg.src = "image/paddle.png"
paddleImg.onload = function() {
    window.requestAnimationFrame(drawPaddle);
};

let brickImg = new Image();
brickImg.src = "image/sprite_briques.png"
brickImg.onload = function() {
    window.requestAnimationFrame(drawBricks);
};

let livesImg = new Image();
livesImg.src = "image/life_level.png"
livesImg.onload = function() {
    window.requestAnimationFrame(drawLives);
};

function startGame() {
    document.getElementById("start-container").hidden = true;
    document.getElementById("loader").hidden = false;

    setTimeout(startCanvas, 5000);
}

function startCanvas() {
    document.getElementById("loader").hidden = true;
    document.getElementById("Canvas-Container").hidden = false;
}

//Brick counter
let bricks = [];
for (let c=0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(let r = 0; r < brickRowCount; r++){
        bricks[c][r] = {x:0,y:0,status:1}
    }
}

//Keyboard Game Control 
const keyDownHandler = e =>{
    if(e.key === "Right" || e.key === "ArrowRight"){
        rightPressed = true;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft"){
        leftPressed = true;
    }
}

const keyUpHandler = e =>{
    if(e.key === "Right" || e.key === "ArrowRight"){
        rightPressed = false;
    }
    else if(e.key === "Left" || e.key === "ArrowLeft"){
        leftPressed = false;
    }

    if(e.key === " " && !isSpacePressed) {
        draw();
        isSpacePressed = true;
    }
}

//Collision Detector
const collisionDetector = ()=>{
    for(let c = 0; c < brickColumnCount; c++){
       for(let r = 0; r < brickRowCount; r++){
        let b = bricks[c][r];
        if(b.status == 1){
          if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
            dy = -dy;
            b.status = 0; 
            score+=10; //Add 10 pts ench brick hit

            if(score === brickRowCount * brickColumnCount * 10){ //Player wins scenario
                ctx.clearRect(0,0,canvas.width,canvas.height);
                document.getElementById("Canvas-Container").hidden = true;
                document.getElementById("win-container").hidden = false;
            }
          }   
        }
       } 
    }
}

//Mouse Game Control
const mouseMoveHandler = e =>{
    let relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX - paddleWidth > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth;
    }
}

//Declaration of control events: press and release key and move mouse
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

//Draw the ball
const drawBall = ()=>{
    ctx.drawImage(ballImg, 0, 0, ballWidth, ballHeight, x, y, ballWidth/2, ballHeight/2);
}

//Draw the paddle
const drawPaddle = () => {
    ctx.drawImage(paddleImg, 0, 0, paddleWidth, paddleHeight, paddleX, paddleY, paddleWidth, paddleHeight);
}

//Draw the brick
const drawBricks = ()=>{
    for(let i = 0; i < brickColumnCount; i++){
        for(let r = 0; r < brickRowCount; r++){
            if(bricks[i][r].status == 1){
                let brickX = (
                    i*(brickWidth + brickPadding)
                ) + brickOffsetLeft;
                let brickY = (
                    r*(brickHeight + brickPadding)
                ) + brickOffsetTop;

                bricks[i][r].x = brickX;
                bricks[i][r].y = brickY;

                ctx.drawImage(brickImg, r * brickSWidth, 0, brickSWidth, brickSHeight, brickX, brickY, brickWidth, brickHeight);
            }
        }
    }
}

//Draw the score
const drawScore = ()=>{
    if(score % 100 === 0) {
        ctx.font = "bold 30px serif";
        ctx.fillStyle = 'white';
        ctx.fillText("Score: " + score, 40, 40);
    } else {
        ctx.font = "bold 24px serif";
        ctx.fillStyle = 'white';
        ctx.fillText("Score: " + score, 40, 40);
    }
}

//Draw the life bar
const drawLives = ()=>{
    ctx.drawImage(livesImg, 0, lifeFrame * lifeHeight, lifeWidth, lifeHeight, 550, 0, 100, 50);
}

//Clean canvas e draw new frame
const draw = ()=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetector();
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius){        
        dx = -dx;
    }
    
    if(y + dy < ballRadius){        
        dy = -dy;
    
    } else if((y + dy > paddleY - ballRadius) && (x >paddleX && x < paddleX + paddleWidth)){
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        lives--; //Player loses a life if the ball hits the bottom. 
        lifeFrame++;
        if(lives === 0){
            document.getElementById("Canvas-Container").hidden = true;
            document.getElementById("end-container").hidden = false;
        
        } else{ //But if there is more lifes, the player continues the game.
            x = canvas.width / 2;
            y = canvas.height / 2;
            dx = 3;
            dy = -3;
            paddleX = (canvas.width - paddleWidth);
        }
    }
    
    if(rightPressed && paddleX < canvas.width - paddleWidth){
        paddleX += 7;
    }
    else if(leftPressed && paddleX > canvas.width - canvas.width){
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

function initialState() {
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
}

initialState();