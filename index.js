// Select all the required DOM elements
const grid = document.querySelector('.grid');
const startButton = document.querySelector('.start');
const scoreDisplay = document.querySelector('#score');
const gameOver = document.querySelector('.game-over');

// Global Variable Declaration
const squares = [];
let currentSnake = [2, 1, 0];
let direction = 1;
const width =20;
let appleIndex = 0;
let score = 0;
let intervalTime = 600;
let speedFactor = 0.85;
let timerId = 0;

// Creates a square Grid of side 'width'
function createGrid() {
    for (let i = 0; i < width * width; i++) {
        // create a div element
        const square = document.createElement('div');
        square.classList.add('square');

        // add the element to the DOM
        grid.appendChild(square);

        // add it to the squares array
        squares.push(square);
    }
}

// Create/Recreate original conditions for the game
function startGame() {
    // incase of restart - remove the snake and apple
    currentSnake.forEach(index => squares[index].classList.remove('snake'));
    squares[currentSnake[0]].classList.remove('head');

    squares[appleIndex].classList.remove('apple');
    clearInterval(timerId);
    gameOver.textContent = '';

    // initial values of global variables
    currentSnake = [2, 1, 0];
    score = 0;
    scoreDisplay.textContent = score;
    direction = 1;
    intervalTime = 1000;
    generateApple();

    // create the snake again
    createSnake();
    timerId = setInterval(move, intervalTime);
}

// Create snake
function createSnake() {
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    squares[currentSnake[0]].classList.add('head');
}

// Move snake based on the arrows
function move() {
    if (
        // conditions for ending game
        (currentSnake[0] + width > width * width && direction === width) ||
        (currentSnake[0] - width < 0 && direction === -width) ||
        (currentSnake[0] % width === 0 && direction === -1) ||
        (currentSnake[0] % width === width - 1 && direction === 1) ||
        squares[currentSnake[0] + direction].classList.contains('snake')
    ) {
        gameOver.textContent = `Game over! Your score is ${score}.`;
        return clearInterval(timerId);
    }

    // remove tail
    const tail = currentSnake.pop();
    squares[tail].classList.remove('snake');

    // add new head
    squares[currentSnake[0]].classList.remove('head');

    currentSnake.unshift(currentSnake[0] + direction);
    squares[currentSnake[0]].classList.add('snake');
    squares[currentSnake[0]].classList.add('head');


    // if snake finds apple
    if (currentSnake[0] == appleIndex) {
        // remove apple if snake eats it
        squares[appleIndex].classList.remove('apple');

        // add length
        squares[tail].classList.add('snake');

        // grow array of snake
        currentSnake.push(tail);

        // generate a new apple
        generateApple();

        // add one to score
        score++;

        // display score
        scoreDisplay.textContent = score;

        // speed up our snake
        clearInterval(timerId);
        intervalTime *= speedFactor;
        timerId = setInterval(move, intervalTime);
    }
}

// generate apple at random location
function generateApple() {
    do {
        appleIndex = Math.floor(Math.random() * squares.length) - 1;
    } while (squares[appleIndex].classList.contains('snake'));

    squares[appleIndex].classList.add('apple');
}

// 37 - left arrow
// 38 - up arrow 
// 39 - right arrow 
// 40 - down arrow

// changes direction based on the 'keyup' event
function control(e) {
    if (e.keyCode === 39) {
        direction = 1;
    } else if (e.keyCode === 38) {
        direction = -width;
    } else if (e.keyCode === 37) {
        direction = -1;
    } else if (e.keyCode === 40) {
        direction = width;
    }
}


createGrid();
createSnake();

document.addEventListener('keyup', control);
startButton.addEventListener('click', startGame);