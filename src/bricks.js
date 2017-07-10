function Bricks(){}

Bricks.prototype = {

    constructor: Bricks,

    loadBricks1: function(){
        var _brick;
        var rowCount = 3;
        var colCount = 3;

        bricks = game.add.group();
        bricks.enableBody = true;
        bricks.physicsBodyType = Phaser.Physics.ARCADE;

        for(y = 1; y < rowCount; y++){
            for(x= 1; x<= colCount; x++){
                _brick = bricks.create(50 + (x * 70), 100 + (y * 52), 'brick');
                _brick.body.bounce.set(1);
                _brick.body.immovable = true;
            }
        }
    },

    loadBricks3: function(){
        var _brick;
        var rowCount = 3;
        var colCount = 3;
        bricks = game.add.group();
        bricks.enableBody = true;
        bricks.physicsBodyType = Phaser.Physics.ARCADE;

        for(y = 1; y < rowCount; y++){
            for(x= 1; x<= colCount; x++){
                _brick = bricks.create((x * 70), (y * 52), 'brick');
                _brick.anchor.setTo(0.5, 0.5);
                _brick.body.bounce.set(1);
                _brick.body.immovable = true;
                _brick.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
                _brick.play('fly');
                _brick.body.moves = false;
            }
        }

        bricks.x = 100;
        bricks.y = 50;

        //  All this does is basically start the invaders moving. Notice we're moving the Group they belong to, rather than the invaders directly.
        var tween = game.add.tween(bricks).to( { x: 200 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

        //  When the tween loops it calls descend
        tween.onLoop.add(descend, this);
    },

}