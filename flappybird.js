let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

// Bird
let birdWidth = 50;
let birdHeight = 20;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;
let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

// Pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

// Physics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    const startButton = document.getElementById("start");
    const retryButton = document.getElementById("retry");
    const bgMusic = document.getElementById("bg-music");

    startButton.addEventListener("click", function () {
        startGame();
        bgMusic.play();
        startButton.style.display = "none";
    });

    retryButton.addEventListener("click", function () {
        resetGame();
        retryButton.style.display = "none";
    });

    document.addEventListener("mousedown", moveBird);
    document.addEventListener("keydown", moveBird);
};

function update() {
    if (gameOver) {
        displayGameOver();
        return;
    }

    requestAnimationFrame(update);
    context.clearRect(0, 0, board.width, board.height);

    // Bird movement
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0);
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
        highScore = Math.max(highScore, score);
        localStorage.setItem("highScore", highScore);
    }

    // Pipes and collision detection
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
            highScore = Math.max(highScore, score);
            localStorage.setItem("highScore", highScore);
        }
    }

    // Remove off-screen pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Draw score and high score
    context.fillStyle = "white";
    context.font = "30px sans-serif";
    context.fillText("Score: " + score, 10, 40);
    context.fillText("High Score: " + highScore, 10, 80);
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;

    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    };
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.type === "mousedown" || e.key === " ") {
        velocityY = -6;
        if (gameOver) {
            resetGame();
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}

function resetGame() {
    bird.y = birdY;
    pipeArray = [];
    score = 0;
    velocityY = 0;
    gameOver = false;
    requestAnimationFrame(update);
}

function startGame() {
    requestAnimationFrame(update);
    setInterval(placePipes, 2000);
}

function displayGameOver() {
    const retryButton = document.getElementById("retry");
    retryButton.style.display = "block";

    context.fillStyle = "black";
    context.font = "40px sans-serif";
    context.fillText("Game Over!", 70, 200);
    context.fillText("Score: " + score, 70, 260);
    context.fillText("High Score: " + highScore, 70, 320);
}
