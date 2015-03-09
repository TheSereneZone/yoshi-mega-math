// Initialize Phaser, and create a 400x490px game
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');

var player;
var platforms;

var blocks;

// Create our 'main' state that will contain the game
var mainState = {

  preload: function() {
    // Load game assets.
    game.load.image('sky', 'sky.png');
    game.load.image('ground', 'platform.png');
    game.load.spritesheet('binary-block', 'binary-block.png', 36, 36);
    game.load.spritesheet('yoshi', 'yellow-yoshi-kid.png', 40, 43);
  },

  create: function() {  
    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
 
    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');
 
    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();
 
    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;
 
    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');
 
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);
 
    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;
 
    //  Now let's create two ledges
    var ledge = platforms.create(400, 400, 'ground');
 
    ledge.body.immovable = true;
 
    ledge = platforms.create(-150, 250, 'ground');
 
    ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'yoshi');

    player.anchor.y=1;
 
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
 
    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
 
    //  Player animations
    player.animations.add('left', [0, 1, 2], 10, true);
    player.animations.add('right', [0, 1, 2], 10, true);
    player.animations.add('jump', [3], 10, true);

    //  Block
    blocks = game.add.group();
    blocks.enableBody = true;
    var block = blocks.create(150, game.world.height - 200, 'binary-block');
    block.body.immovable = true;

    cursors = game.input.keyboard.createCursorKeys();
  },

  update: function() {  
    //  Collisions
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(player, blocks);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
 
    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -150;
 
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 150;
 
        player.animations.play('right');
    } else {
        //  Stand still
        player.animations.stop();
 
        player.frame = 6;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (player.body.touching.down) {
      if (cursors.up.isDown) {
        player.body.velocity.y = -350;
      }
    } else {
      player.animations.play('jump');
    }
  },

  // Restart the game
  restartGame: function() {  
    // Start the 'main' state, which restarts the game
    game.state.start('main');
  },
};

// Add and start the 'main' state to start the game
game.state.add('main', mainState);  
game.state.start('main');