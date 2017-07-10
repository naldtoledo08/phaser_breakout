var game = new Phaser.Game(800,600, Phaser.AUTO, 'gameCanvas',
{
	preload: preload,
	create: create,
	update: update
});


var utils       = new Utils();


var paddle;
var ball;
var bHasLaunched = false;
var ballOnPaddle = true;

var level = 1;
var lives = 3;
var score = 0;
var scoreText;
var livesText;
var introText;
var levelIntroText;
var highScoreText;
var levelText;
var highScore = (document.cookie.indexOf('highscore=') === -1) ? 0 : utils.getCookie('highscore');
var pingSound;
var outSound;
var gameOverSound;
var music;
var champ;
var emitter;


var level = 1;

var breakout = new Breakout();
var brick    = new Bricks();

function preload(){
    breakout.preloadSFX();
    breakout.preloadImages();
}

function create(){	
	game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We check bounds collisions against all walls other than the bottom one
    game.physics.arcade.checkCollision.down = false;

	game.add.sprite(0,0, 'background');

    breakout.loadSFX();

    brick.loadBricks1();

    breakout.loadPaddle();

	breakout.loadBall();
		
	ball.events.onOutOfBounds.add(ballLost, this);

    //scoreText       = breakout.loadText(32, 50, 'Score: 1', {   });
    highScoreText   = breakout.loadText(25, 20, 'Highest Score: '+ highScore);
    levelText       = breakout.loadText(25, 50, 'Level: 1');

	scoreText       = breakout.loadText(680, 555, 'Score: 0');
    livesText       = breakout.loadText(25, 555, 'Lives: 3');
    //livesText       = breakout.loadText(680, 50, 'Lives: 3');    

    levelIntroText   = game.add.text(game.world.centerX, 350, 'Level 1', { font: "30px Arial", align: "center" });
    introText       = game.add.text(game.world.centerX, 400, '--- Click to Start ---', { font: "40px Arial", align: "center" });
    introText.anchor.setTo(0.5, 0.5);
    levelIntroText.anchor.setTo(0.5, 0.5);

    /*** Particles ***/
    emitter = game.add.emitter(0, 0, 100);
    emitter.makeParticles('brick');
    emitter.gravity = 2000;

	game.input.onDown.add(launchBall, this);
}


function update(){
	paddle.x = game.input.x;

    var paddleWidthHalf = paddle.width / 2;
    if (paddle.x < paddleWidthHalf)
    {
        paddle.x = paddleWidthHalf;
    }
    else if (paddle.x > game.width - paddleWidthHalf)
    {
        paddle.x = game.width - paddleWidthHalf;
    }

	if(!bHasLaunched){
		ball.x = paddle.x;
	}else{
        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
	}
}


function ballHitBrick (_ball, _brick) {    
    breakout.incrementtHitCount();
    breakout.particleBurst(_brick, emitter);
    score += breakout.getScore();
    _brick.kill();
    pingSound.play();
    
    scoreText.text = 'Score: ' + score;

    if(score > highScore){
    	utils.setCookie('highscore', score);
    	highScoreText.text = 'Highest Score: ' + utils.getCookie('highscore');
    }

    if (bricks.countLiving() == 0)
    {
    	music.stop();    	
        score += 10;
        utils.setCookie('highscore', score);
        scoreText.text = 'Score: ' + score;
        breakout.nextLevel(level);
    }
}


function descend() {
    bricks.y += 10;
}

function champion(){
	champ.play();
	ball.body.velocity.setTo(0, 0);    
	introText.text = '--- Congratulations ---';
	introText.visible = true;
}

function ballHitPaddle (_ball, _paddle) {
    var diff = 0;
    breakout.resetHitCount();

    if (_ball.x < _paddle.x)
    {
        //  Ball is on the left-hand side of the paddle
        diff = _paddle.x - _ball.x;
        _ball.body.velocity.x = (-10 * diff);
    }
    else if (_ball.x > _paddle.x)
    {
        //  Ball is on the right-hand side of the paddle
        diff = _ball.x -_paddle.x;
        _ball.body.velocity.x = (10 * diff);
    }
    else
    {
        //  Ball is perfectly in the middle
        //  Add a little random X to stop it bouncing straight up!
        _ball.body.velocity.x = 2 + Math.random() * 8;
    }
}

function launchBall(){
	if(lives > 0){
	 	music.play();
	}
	
	if(!bHasLaunched){
		bHasLaunched = true;
		ball.body.velocity.y = -250;
		ball.body.velocity.x = 75;

        breakout.introTextVisibility(false);
	}
}


function ballLost(){
    lives--;
    livesText.text = 'Lives: ' + lives;
    game.camera.shake(0.001, 800);
    if (lives === 0)
    {
        breakout.gameOver();
    }
    else
    {
        breakout.displayContinue();
        outSound.play();       

        breakout.ballReset();
    }
}


