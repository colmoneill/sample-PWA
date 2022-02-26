const canvas = document.getElementById("the_canvas")
const context = canvas.getContext("2d");

const scale = 2;
const width = 16;
const height = 18;
const scaledWidth = scale * width;
const scaledHeight = scale * height;
const walkLoop = [0, 1, 0, 2];
const frameLimit = 7;
const foodWidth = 32;
const foodHeight = 32;
const username = localStorage.getItem('username');
const score = localStorage.getItem('score');

let currentLoopIndex = 0;
let frameCount = 0;
let currentDirection = 0;
let speed = 2;
let randomX = Math.abs(Math.floor(Math.random() * 1099) - 50);
let randomY = Math.abs(Math.floor(Math.random() * 499) - 50);
let randomFoodX = Math.abs(Math.floor(Math.random() * 7));
let randomFoodXSelect = randomFoodX * 64;
let randomFoodY = Math.abs(Math.floor(Math.random() * 4));
let randomFoodYSelect = randomFoodY * 64;
let scoreCount = 0;
if (score){
    scoreCount = score;
}

function addName() {
    let header = document.getElementById("main-header");
    header.innerHTML = "Hello " + username;
}

addName();

function randoPos(rangeX, rangeY, delta){
    this.x = Math.abs(Math.floor(Math.random() * rangeX) - delta);
    this.y = Math.abs(Math.floor(Math.random() * rangeY) - delta);
}

function newFood(){
    randomFoodX = Math.abs(Math.floor(Math.random() * 7));
    randomFoodXSelect = randomFoodX * 64;
    randomFoodY = Math.abs(Math.floor(Math.random() * 4));
    randomFoodYSelect = randomFoodY * 64;
    foodPosition = new randoPos(1099, 499, 50);
}

let character = new Image();
character.src = "assets/img/Green-16x18-spritesheet.png";

let foodSprite = new Image();
foodSprite.src = "assets/img/fruitnveg64wh37.png";

// GameObject holds positional information
// Can be used to hold other information based on requirements
function GameObject(spritesheet, x, y, width, height) {
    this.spritesheet = spritesheet;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.mvmtDirection = "None";
}

// Default Player
let player = new GameObject(character, 0, 0, 200, 200);
let foods = new GameObject(foodSprite, randomX, randomY, 100, 100);

// The GamerInput is an Object that holds the Current
// GamerInput (Left, Right, Up, Down, MouseClicks)
function GamerInput(input) {
    this.action = input; // Hold the current input as a string
}

// Default GamerInput is set to None
let gamerInput = new GamerInput("None"); //No Input


function input(event) {
    // Take Input from the Player
    // console.log("Input");
    // console.log("Event type: " + event.type);
    //console.log("Keycode: " + event.keyCode);

    if (event.type === "keydown") {
        switch (event.keyCode) {
            case 37: // Left Arrow
                gamerInput = new GamerInput("Left");
                break; //Left key
            case 38: // Up Arrow
                gamerInput = new GamerInput("Up");
                break; //Up key
            case 39: // Right Arrow
                gamerInput = new GamerInput("Right");
                break; //Right key
            case 40: // Down Arrow
                gamerInput = new GamerInput("Down");
                break; //Down key
            case 83:
                speed = 4;
                break;
            default:
                gamerInput = new GamerInput("None"); //No Input
        }
    } else {
        gamerInput = new GamerInput("None");
        speed = 2;
    }
}


var dynamic = nipplejs.create({
    color: 'grey',
});

dynamic.on('added', function (evt, nipple) {
    //nipple.on('start move end dir plain', function (evt) {
    nipple.on('dir:up', function (evt, data) {
       //console.log("direction up");
       gamerInput = new GamerInput("Up");
    });
    nipple.on('dir:down', function (evt, data) {
        //console.log("direction down");
        gamerInput = new GamerInput("Down");
     });
     nipple.on('dir:left', function (evt, data) {
        //console.log("direction left");
        gamerInput = new GamerInput("Left");
     });
     nipple.on('dir:right', function (evt, data) {
        //console.log("direction right");
        gamerInput = new GamerInput("Right");
     });
     nipple.on('end', function (evt, data) {
        //console.log("mvmt stopped");
        gamerInput = new GamerInput("None");
     });
});

// Spritesheet atlas references
// row 0 down
// row 1 up
// row 2 left
// row 3 right


function update() {
    // console.log("Update");
    // Check Input
    if (gamerInput.action === "Up") {
        if (player.y < 0){
            console.log("player at top edge");
        }
        else{
            player.y -= speed; // Move Player Up
        }
        currentDirection = 1;
    } else if (gamerInput.action === "Down") {
        if (player.y + scaledHeight > canvas.height){
            console.log("player at bottom edge");
        }
        else{
            player.y += speed; // Move Player Down
        }
        currentDirection = 0;
    } else if (gamerInput.action === "Left") {
        if (player.x < 0){
            console.log("player at left edge");
        }
        else{
            player.x -= speed; // Move Player Left
        }
        currentDirection = 2;
    } else if (gamerInput.action === "Right") {
        if (player.x + scaledWidth > canvas.width){

        }
        else{
            player.x += speed; // Move Player Right
        }
        currentDirection = 3;
    } else if (gamerInput.action === "None") {
    }
}

function drawFrame(image, frameX, frameY, canvasX, canvasY) {
    context.drawImage(image,
                  frameX * width, frameY * height, width, height,
                  canvasX, canvasY, scaledWidth, scaledHeight);
}

function animate() {
    if (gamerInput.action != "None"){
        frameCount++;
        if (frameCount >= frameLimit) {
            frameCount = 0;
            currentLoopIndex++;
            if (currentLoopIndex >= walkLoop.length) {
                currentLoopIndex = 0;
            }
        }      
    }
    else{
        currentLoopIndex = 0;
    }
    drawFrame(player.spritesheet, walkLoop[currentLoopIndex], currentDirection, player.x, player.y);
}

foodPosition = new randoPos(1099, 499, 50);

function manageFood(){
    // place the piece of food
    context.drawImage(foodSprite, randomFoodX*64, randomFoodY*64, 64, 64, foodPosition.x, foodPosition.y, foodWidth, foodHeight);
    // check for collision (eating)

    //if (rect1.x < rect2.x + rect2.width && 
    //    rect1.x + rect1.width > rect2.x && 
    //    rect1.y < rect2.y + rect2.height &&
    //    rect1.y + rect1.height > rect2.y) {
    // collision detected!
    //}
    if (foodPosition.x < player.x + scaledWidth && //collision from left to right
        foodPosition.x + foodWidth > player.x && // collision from right to left
        foodPosition.y < player.y + scaledHeight && // collision from top to bottom
        foodPosition.y + foodHeight > player.y // collision from bottom to top
        ){
        console.log("collision!");
        scoreCount ++;
        localStorage.setItem("score", scoreCount);
        newFood();
    }
    
}

function writeScore(){
    let scoreString = "score: " + scoreCount;
    context.font = '22px sans-serif';
    context.fillText(scoreString, 1000, 20)
}

function draw() {
    context.clearRect(0,0, canvas.width, canvas.height);
    manageFood();
    animate();
    writeScore();
}

function gameloop() {
    update();
    draw();
    window.requestAnimationFrame(gameloop);
}

// Handle Active Browser Tag Animation
window.requestAnimationFrame(gameloop);

// https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

window.addEventListener('keydown', input);
// disable the second event listener if you want continuous movement
window.addEventListener('keyup', input);