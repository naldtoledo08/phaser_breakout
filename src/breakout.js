function Breakout(){}

Breakout.prototype = {

    constructor: Breakout,

    preloadSFX : function(){

        game.load.audio('bgm'       , 'resource/audio/sneaky_sfx.mp3');
        game.load.audio('ping'      , 'resource/audio/p-ping.mp3');
        game.load.audio('out'       , 'resource/audio/player_death.wav');
        game.load.audio('gameover'  , 'resource/audio/gameover.mp3');
        game.load.audio('champ'     , 'resource/audio/champ.mp3');

    },

    loadSFX : function(){

        music = game.add.audio('bgm');
        music.loop = true;
        
        champ           = game.add.audio('champ');
        pingSound       = game.add.audio('ping');
        outSound        = game.add.audio('out');
        gameOverSound   = game.add.audio('gameover');

    },

    preloadImages : function(){

        game.load.image('background', 'resource/images/background/cloudy.jpg');
        game.load.image('paddle'    , 'resource/images/paddle/paddle_black.png');
        game.load.image('ball'      , 'resource/images/ball/pingpong.png');
        game.load.image('brick'     , 'resource/images/bricks/diamond-icon1.png');
        game.load.image('diamond' , 'resource/images/bricks/diamond-icon2.png');

    },

    loadPaddle: function(){
        paddle = game.add.sprite(game.world.centerX, 520, 'paddle');
        paddle.anchor.set(0.5, 0.5);
        game.physics.enable(paddle, Phaser.Physics.ARCADE);

        paddle.body.collideWorldBounds = true;
        paddle.body.bounce.set(1);
        paddle.body.immovable = true;
    },

    loadBall: function(){
        ball = game.add.sprite(game.world.centerX, (paddle.y - 35), 'ball');
        ball.anchor.set(0.5, 0.5);
        ball.checkWorldBounds = true;
        game.physics.enable(ball, Phaser.Physics.ARCADE); //////physics
        ball.body.collideWorldBounds = true;
        ball.body.bounce.set(1);
    },

    loadBricks: function(rowCount, colCount){
        var brick;

        bricks = game.add.group();
        bricks.enableBody = true;
        bricks.physicsBodyType = Phaser.Physics.ARCADE;

        for(y = 1; y < rowCount; y++){
            for(x= 1; x<= colCount; x++){
                brick = bricks.create(50 + (x * 70), 100 + (y * 52), 'brick');
                brick.body.bounce.set(1);
                brick.body.immovable = true;
            }
        }
    },

    loadText: function(x,y, text, styleObj = {}){
        if( typeof styleObj.font === 'undefined' || styleObj.font === null ){
            styleObj.font = "22px Arial";
        }

        if( typeof styleObj.fill === 'undefined' || styleObj.fill === null ){
            styleObj.fill = "#000";
        }
        
        return game.add.text(x, y, text, styleObj);
    },

    gameOver: function () {
        ball.body.velocity.setTo(0, 0);    
        introText.text = 'Game Over!';
        introText.visible = true;
        music.stop();
        gameOverSound.play();
    },

    displayContinue: function(){
        introText.text = '- Click to continue -';
        introText.visible = true;
    },

    particleBurst: function(pointer, particle) {
        particle.x = pointer.x;
        particle.y = (pointer.y+20);

        particle.start(true, 2000, null, 1);
    },

    nextLevel: function(level){
        
    }
}