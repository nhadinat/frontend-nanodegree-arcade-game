/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire 'scene'
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */
'use strict';
var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'white';

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0; // div1000 to get seconds

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt); //change positions
        render(); //draw positions

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
    }


    /* This algorithm checks for collisions by checking if bounding boxes
     * of the enemies and player collide.
     */
    function checkCollisions(enemy, player) {

        // Detect enemy hitbox values, subtracting 'air' around the sprite.
        enemy.left = enemy.x * 101 - 50;
        enemy.top = enemy.y * 83 - 125;
        enemy.right = Resources.get(enemy.sprite).width - 50 + enemy.left;
        enemy.bottom = Resources.get(enemy.sprite).height - 125 + enemy.top;

        // Detect player hitbox values, subtracting 'air' around the sprite.
        player.left = player.x * 101 - 50;
        player.top = player.y * 83 - 125;
        player.right = Resources.get(player.sprite).width - 50 + player.left;
        player.bottom = Resources.get(player.sprite).height - 125 + player.top;

        // Define the hitbox limits and trigger if all conditions apply.
        if (enemy.left < player.right &&
            enemy.right > player.left &&
            enemy.top < player.bottom &&
            enemy.bottom > player.top) {
            // Game over, put player back to start.
            reset();
        }
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
            // Add collision detection after each enemy update
            checkCollisions(enemy, player);
        });
        player.update();
    }

    /* This function initially draws the 'game level', it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the 'grid'
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();

        // Add text to tell player how to begin
        splashScreen();
        // Add title text to the top of the screen, then add points text
        titleText(player.points);
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        // Reset player's position
        player.x = 2;
        player.y = 5;
        // Reset player's points
        player.points = 0;
    }

    /* This function serves as a player starting point. It gives some help text
     * on how to begin.
     * TODO: add listener to splashscreen, place f somewhere in init
     */
    function splashScreen() {
        // Add written content here
        var text = 'Press an arrow key to begin!';
        // Style font here
        ctx.font = "1em 'Press Start 2P'";
        ctx.textAlign = 'center';
        // Render here
        if (player.x === 2 && player.y === 5) {
          ctx.strokeText(text, canvas.width / 2, canvas.height - 175);
          ctx.fillText(text, canvas.width / 2, canvas.height - 175);
        }
    }

    /* This function adds title level text and the point system
     */
    function titleText(points) {
        // Add written content here
        var text = 'Points:';
        // Style font here
        ctx.font = "0.8em 'Press Start 2P'";
        ctx.textAlign = 'left';
        // Render here
        ctx.strokeText(text + ' ' + points, 10, 75);
        ctx.fillText(text + ' ' + points, 10, 75);
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/enemy-bug-green.png', // Add new green bug 'Greenemy'
        'images/char-princess-girl.png' // Change to princess, looks cooler
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);