const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
let score = 0;
let snake = [{x: 9 * gridSize, y: 9 * gridSize}];
let food = {x: 5 * gridSize, y: 5 * gridSize};
let direction = "RIGHT";
let gameInterval;

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    moveSnake();
    checkCollisions();
    updateScore();
}

function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "#1abc9c" : "#16a085";
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = "#e74c3c";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = { ...snake[0] };

    if (direction === "RIGHT") head.x += gridSize;
    if (direction === "LEFT") head.x -= gridSize;
    if (direction === "UP") head.y -= gridSize;
    if (direction === "DOWN") head.y += gridSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        spawnFood();
    } else {
        snake.pop();
    }
}

function spawnFood() {
    const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
    food = { x, y };
}

function checkCollisions() {
    const head = snake[0];

    // Collision with walls
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        endGame();
    }

    // Collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function updateScore() {
    document.getElementById("score").textContent = score;
}

function endGame() {
    clearInterval(gameInterval);
    alert("Game Over! Your final score is " + score);
    document.getElementById("restartButton").disabled = false;
}

function startGame() {
    snake = [{x: 9 * gridSize, y: 9 * gridSize}];
    score = 0;
    direction = "RIGHT";
    spawnFood();
    gameInterval = setInterval(drawGame, 100);
    document.getElementById("restartButton").disabled = true;
}

function changeDirection(event) {
    if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        if (direction !== "LEFT") direction = "RIGHT";
    }
    if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        if (direction !== "RIGHT") direction = "LEFT";
    }
    if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        if (direction !== "DOWN") direction = "UP";
    }
    if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
        if (direction !== "UP") direction = "DOWN";
    }
}

// Touch controls for mobile devices
let touchStartX = 0;
let touchStartY = 0;

function touchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function touchMove(event) {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0 && direction !== "LEFT") direction = "RIGHT";
        if (deltaX < 0 && direction !== "RIGHT") direction = "LEFT";
    } else {
        if (deltaY > 0 && direction !== "UP") direction = "DOWN";
        if (deltaY < 0 && direction !== "DOWN") direction = "UP";
    }

    touchStartX = touchEndX;
    touchStartY = touchEndY;
}

document.getElementById("restartButton").addEventListener("click", () => {
    startGame();
});

document.addEventListener("keydown", changeDirection);
canvas.addEventListener("touchstart", touchStart);
canvas.addEventListener("touchmove", touchMove);

startGame();
