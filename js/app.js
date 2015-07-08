// Enemies our player must avoid
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x; // x coord
    this.y = y; // y coord
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    // console.log(dt);
    this.x = this.x + (dt * 50);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y * 83);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x,y) {
    // assign image to Player
    this.sprite = 'images/char-princess-girl.png';
    this.x = x; // x coord
    this.y = y; // y coord
};

Player.prototype.update = function() {
    // movement will be by key inputs
};

// Draw the player on the screen, using the required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x * 101, this.y * 83);
};

Player.prototype.handleInput = function (input) {
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
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var enemy = new Enemy(0,1),
    enemy2 = new Enemy(0,2),
    enemy3 = new Enemy(0,3),
    allEnemies = [];

// Add enemies into array
allEnemies.push(enemy, enemy2, enemy3);

// Place the player object in a variable called player
var player = new Player(2,5);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
