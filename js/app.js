/* App.js
 * This script defines the main classes of the game, updates
 * their position, and gives conditions and rules to the classes that
 * allow the game to play properly. It also contains a keyboard input
 * listener to allow the user to play the game.
 * - Nate Hadinata 7/20/15
 */
'use strict';

/*
 * The Enemy Class
 */

// Initialize Enemy position (x,y), velocity (v), and sprite image.
var Enemy = function(x,y,v) {
    // The image/sprite for enemies uses
    // a helper Udacity provided to easily load images.
    this.sprite = 'images/enemy-bug.png';
    // Position the enemy
    this.x = x; // x coord of enemy
    this.y = y; // y coord of enemy
    this.v = v; // velocity of enemy
};

// Update the position of Enemy by dt, a time delta between game-run ticks.
Enemy.prototype.update = function(dt) {
    // Movement is multiplied by the parameter dt to ensure the game
    // runs at the same speed for all computers.
    this.x = this.x + (dt * this.v);
    // When Enemy position reaches the right limit, restart to a
    // position offscreen.
    if (this.x > 8) {
        this.x = -1;
    }
};

// Draw the enemy on the screen using the required method for game.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 25);
};

/*
 * The Greenemy Subclass
 */

// Create subclass Greenemy based on superclass Enemy, initializing its
// position (x,y), velocity (v), and sprite image.
var Greenemy = function(x,y,v) {
    Enemy.call(this,x,y,v);
    this.sprite = 'images/enemy-bug-green.png';
};

// Copy Enemy objects into Greenemy.
Greenemy.prototype = Object.create(Enemy.prototype);
// Redirect Greenemy's constructor to the original subclass.
Greenemy.prototype.constructor = Greenemy;

// Customize the update function for Greenemy, because it moves the
// other way.
Greenemy.prototype.update = function(dt) {
    this.x = this.x + (dt * this.v);
    // When Greenemy position reaches the left limit, restart to a
    // position offscreen.
    if (this.x < -7) {
        this.x = 12;
    }
};

/*
 * The Player Class
 */

// Initialize Player position (x,y) and sprite image.
var Player = function(x,y) {
    // Assign image to Player.
    this.sprite = 'images/char-princess-girl.png';
    // Position the Player.
    this.x = x; // x coord of Player
    this.y = y; // y coord of Player
    // Add points system to Player object.
    this.points = 0; // Player's points initialized at zero.
};

// Update the player's
Player.prototype.update = function() {
    // Limit the player's movement at the borders.
    if (this.x < 0) { // left border
        this.x = 0;
    }
    if (this.x > 4) { // right border
        this.x = 4;
    }
    if (this.y > 5) { // bottom border
        this.y = 5;
    }
    // Move sprite back to start if player successfully jumps in the water.
    if (this.y < 1) { // Player reaches the water, top border
        this.x = 2;
        this.y = 5;
        // Reward Player for reaching the water with one point.
        this.points++;
    }
};

// Update Player's position based on keyboard inputs
Player.prototype.handleInput = function(input) {
    // Assign the inputs to change Player's x or y coordinates.
    if (input === 'left') {
        this.x = this.x - 1; // move left
    }
    if (input === 'up') {
        this.y = this.y - 1; // move up
    }
    if (input === 'right') {
        this.x = this.x + 1; // move right
    }
    if (input === 'down') {
        this.y = this.y + 1; // move down
    }
};

// Draw the player on the screen using the required method for game.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 25);
};

// Instantiate the enemy objects with position and velocity paramenters.
var enemy = new Enemy(-1,1,2.5),
    enemy2 = new Enemy(-1,2,3.3),
    enemy3 = new Enemy(-1,3,1.2),
    enemy4 = new Enemy(-3,1,1.7),
    enemy5 = new Enemy(-3,2,0.7),
    enemy6 = new Enemy(-3,3,2.7);

// Add meany greeny enemy, where Greenemy is a subclass of Enemy,
// but this guy goes the wrong way on the street (negative velocity).
var greenemy = new Greenemy(10,1,-4);

// Push all enemy objects, including greenemy, in an array called allEnemies,
// so that all enemies can be updated in a for loop in engine.js.
var allEnemies = [];
    allEnemies.push(enemy, enemy2, enemy3, enemy4, enemy5, enemy6,
        greenemy);

// Instantiate the player object in a variable called player
var player = new Player(2,5);

// This Udacity-coded listener listens for keyups and sends the inputs
// to the player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = { // Define the allowed keys.
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});