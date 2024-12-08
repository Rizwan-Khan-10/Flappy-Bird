//Game BackGround
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//Game Bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImage;

let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImage;
let bottomPipeImage;

//Game Physics
let velocityX = -2;//Pipe speed moving towards bird
let velocityY = 0;//bird jumping speed
let gravity = 0.4;

//Game
let gameOver = false;
let score = 0;

//Game on Load Function
window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth
    context = board.getContext("2d");

    //Drawing Bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //Loading Bird Image
    birdImage = new Image();
    birdImage.src = "Images/flappybird.png";
    birdImage.onload = function () {
        context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }

    //Loading Pipe
    topPipeImage = new Image();
    topPipeImage.src = "Images/toppipe.png";
    bottomPipeImage = new Image();
    bottomPipeImage.src = "Images/bottompipe.png";

    requestAnimationFrame(update);
    setInterval(() => {
        placePipe();
    }, 1500);
    document.addEventListener('keydown', moveBird)
    document.addEventListener('touchstart', () => {
        velocityY = -6;
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    });
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;//Applying gravity in game 
    bird.y = Math.max(bird.y + velocityY, 0);//Making bird to not jump over game board
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        const pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    //clearing pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();//Removing pipe
    }

    //showing score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(`Score: ${score}`, 5, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 45, 300);
    }
}

function placePipe() {
    if (gameOver) {
        return;
    }
    let openingSpace = board.height / 4;
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);

    let toppipe = {
        img: topPipeImage,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(toppipe);

    let bottompipe = {
        img: bottomPipeImage,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottompipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp") {
        //Jump
        velocityY = -6;
        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }

    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}