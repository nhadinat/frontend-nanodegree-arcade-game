// Enemies our player must avoid
var Enemy = function(x,y,v) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // Position the enemy
    this.x = x; // x coord of enemy
    this.y = y; // y coord of enemy
    this.v = v; // velocity of enemy
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Multiply movement by the dt parameter which will ensure the game
    // runs at the same speed for all computers.
    this.x = this.x + (dt * this.v);
    // Rerun the enemies
    if (this.x > 8) {
        this.x = -1;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 25);
};

// Create subclass Greenemy
var Greenemy = function(x,y,v) {
    Enemy.call(this,x,y,v);
    this.sprite = 'images/enemy-bug-green.png';
};

Greenemy.prototype = Object.create(Enemy.prototype);
Greenemy.prototype.constructor = Greenemy;
Greenemy.prototype.update = function(dt) {
    this.x = this.x + (dt * this.v);
    // Rerun the other way
    if (this.x < -7) {
        this.x = 12;
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x,y) {
    // assign image to Player
    this.sprite = 'images/char-princess-girl.png';
    // Position the player
    this.x = x; // x coord of player
    this.y = y; // y coord of player
    this.points = 0 // player's points initialized at zero
};

Player.prototype.update = function() {
    // Limit the player's movement at the borders
    if (this.x < 0) {
        this.x = 0;
    }
    if (this.x > 4) {
        this.x = 4;
    }
    if (this.y > 5) {
        this.y = 5;
    }
    // Move sprite back to start if player successfully jumps in the water.
    // TODO: add point system
    if (this.y < 1) {
        this.x = 2;
        this.y = 5;
        this.points = this.points + 1;
    }
};

// Draw the player on the screen, using the required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83 - 25);
};

Player.prototype.handleInput = function(input) {
    // Gather key inputs and assign them to change player x or y coordinates
    if (input === 'left') {
        this.x = this.x - 1;
    }
    if (input === 'up') {
        this.y = this.y - 1;
    }
    if (input === 'right') {
        this.x = this.x + 1;
    }
    if (input === 'down') {
        this.y = this.y + 1;
    }
};

// Now instantiate your objects, and add speed values to enemies
var enemy = new Enemy(-1,1,2.5),
    enemy2 = new Enemy(-1,2,3.3),
    enemy3 = new Enemy(-1,3,1.2),
    enemy4 = new Enemy(-3,1,1.7),
    enemy5 = new Enemy(-3,2,0.7),
    enemy6 = new Enemy(-3,3,2.7);

// Add meany greeny enemy, where Greenemy is a subclass of Enemy,
// but this guy goes the wrong way on the street
var greenemy = new Greenemy(10,1,-4);

// Place all enemy objects in an array called allEnemies
var allEnemies = [];
    allEnemies.push(enemy, enemy2, enemy3, enemy4, enemy5, enemy6,
        greenemy);

// Place the player object in a variable called player
var player = new Player(2,5);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
