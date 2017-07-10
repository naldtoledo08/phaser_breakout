function Breakout(){}

Breakout.prototype = {

    constructor: Breakout,

    hitCount : -1,
    scoreAdd : 1,
    scoretMultiplier : 2,

    incrementtHitCount: function(){
        this.hitCount++;
    },
    resetHitCount: function(){
        this.hitCount = -1;
    },
    getScore: function(){
        if(this.hitCount > 0 ){
            return ((this.hitCount * this.scoretMultiplier) + this.scoreAdd);
        }
        return this.scoreAdd;
    },

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

    loadText: function(x,y, text, styleObj = {}){
        if( typeof styleObj.font === 'undefined' || styleObj.font === null ){
            styleObj.font = "20px Arial";
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
        this.introTextVisibility(true);
    },

    particleBurst: function(pointer, particle) {
        particle.x = pointer.body.x;
        particle.y = (pointer.body.y+20);

        particle.start(true, 2000, null, 1);
    },

    nextLevel: function(_level){
        level           = _level+1;
        levelText.text  = "Level: "+level;
        console.log("nextLevel: "+level);
        var loadBrick   = "loadBricks"+level;
        
        brick[loadBrick]();

        this.introTextVisibility(true, "Level " + level, "--- Click to Start ---");
        this.ballReset();
    },

    ballReset: function(){        
        bHasLaunched = false;
        ball.body.velocity.setTo(0, 0);  
        ball.reset(paddle.body.x, paddle.body.y - 35);
    },

    introTextVisibility: function(value = false, _levelIntroText, _introText){
        introText.visible       = value;
        levelIntroText.visible  = value;

        if( typeof _levelIntroText !== 'undefined' && _levelIntroText !== null ){
            levelIntroText.text = _levelIntroText;
        }

        if( typeof _introText !== 'undefined' && _introText !== null ){
            introText.text = _introText;
        }
    }
}