var game = new Phaser.Game(800,600, Phaser.AUTO, 'gameCanvas',
{
	preload: preload,
	create: create,
	update: update
});

var paddle;
var ball;
var bHasLaunched = false;
var ballOnPaddle = true;

var lives = 3;
var score = 0;
var scoreText;
var livesText;
var introText;
var highScoreText;
var highScore = (document.cookie.indexOf('highscore=') === -1) ? 0 : getCookie('highscore');
var pingSound;
var outSound;
var gameOverSound;
var music;
var champ;

var level = 1;


function preload(){
	game.load.audio('bgm', 'resource/audio/sneaky_sfx.mp3');
	game.load.audio('ping', 'resource/audio/p-ping.mp3');
	game.load.audio('out', 'resource/audio/player_death.wav');
	game.load.audio('gameover', 'resource/audio/gameover.mp3');
	game.load.audio('champ', 'resource/audio/champ.mp3');

	game.load.image('background', 'resource/breakout1.jpg');
	game.load.image('paddle', 'resource/paddle.png');
	game.load.image('ball', 'resource/ball.png');
	game.load.image('brick', 'resource/bricks.png');
}

function getRandomInt(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}



function create(){ 

	
	game.physics.startSystem(Phaser.Physics.ARCADE);

    //  We check bounds collisions against all walls other than the bottom one
    game.physics.arcade.checkCollision.down = false;

	game.add.sprite(0,0, 'background');
	
	music = game.add.audio('bgm');
	champ = game.add.audio('champ');
	music.loop = true;

	bricks = game.add.group();
    bricks.enableBody = true;
    bricks.physicsBodyType = Phaser.Physics.ARCADE;

    var brick;
    var rowCount = 4;
    var colCount = 8;

    var powerUps = getRandomInt(1,rowCount) + getRandomInt(1,colCount);
    console.log(powerUps);
    for(y = 1; y < rowCount; y++){
    	for(x= 1; x<= colCount; x++){
    		brick = bricks.create(50 + (x * 70), 100 + (y * 52), 'brick');
            brick.body.bounce.set(1);
            brick.body.immovable = true;

            var checkP = rowCount.toString()+colCount.toString();
            if(checkP == powerUps){
            	console.log('powerUps')
            	brick.add.filter('BlurY');
            }
    	}
    }


	paddle = game.add.sprite(game.world.centerX, 500, 'paddle');
	paddle.anchor.set(0.5, 0.5);
	game.physics.enable(paddle, Phaser.Physics.ARCADE);

	paddle.body.collideWorldBounds = true;
	paddle.body.bounce.set(1);
	paddle.body.immovable = true;
	paddle.scale.x = 0.25;
	paddle.scale.y = 0.2;

	ball = game.add.sprite(game.world.centerX, (paddle.y - 35), 'ball');
	ball.anchor.set(0.5, 0.5);
	ball.checkWorldBounds = true;
	game.physics.enable(ball, Phaser.Physics.ARCADE); //////physics
	ball.scale.x = 0.1;
	ball.scale.y = 0.1;
	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1);	
	ball.events.onOutOfBounds.add(ballReset, this);


	scoreText = game.add.text(32, 50, 'Score: 0', { font: "20px Arial", fill: "#ffffff", align: "left" });
    livesText = game.add.text(680, 50, 'Lives: 3', { font: "20px Arial", fill: "#ffffff", align: "right" });
    highScoreText = game.add.text(600, 550, 'Highest Score: '+ highScore, { font: "20px Arial", fill: "#ffffff", align: "right" });

    introText = game.add.text(game.world.centerX, 400, '- Click to Start -', { font: "40px Arial", fill: "#ffffff", align: "center" });
    introText.anchor.setTo(0.5, 0.5);


    pingSound = game.add.audio('ping');
    pingSound.volume = 0.5;
    outSound = game.add.audio('out');
    gameOverSound = game.add.audio('gameover');

	game.input.onDown.add(launchBall, this);
}

function update(){
	paddle.x = game.input.x;

	if(!bHasLaunched){
		ball.x = paddle.x;
	}else{

        game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
        game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
	}
}


function ballHitBrick (_ball, _brick) {

    _brick.kill();
    pingSound.play();
    score++;
    scoreText.text = 'Score: ' + score;
    if(score > highScore){
    	setCookie('highscore', score);
    	highScoreText.text = 'Highest Score: ' + getCookie('highscore');
    }


    if (bricks.countLiving() == 0 || score >= 24)
    {	
    	music.stop();
    	
        score += 10;
        setCookie('highscore', score);
        scoreText.text = 'Score: ' + score;
        champion();
       // introText.text = '- Congratulations -';
    }
}

function champion(){
	champ.play();
	ball.body.velocity.setTo(0, 0);    
	introText.text = '--- Congratulations ---';
	introText.visible = true;
}

function ballHitPaddle (_ball, _paddle) {

    var diff = 0;

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

        introText.visible = false;
	}
}


function ballReset(){
	
	lives--;
    livesText.text = 'Lives: ' + lives;
    music.stop();
    if (lives === 0)
    {
        gameOver();
    }
    else
    {    
    	outSound.play();
    	displayContinue();
        bHasLaunched = false;
		ball.reset(paddle.body.x, paddle.body.y - 35);
    }
}

	
function displayContinue(){
    introText.text = '- click to continue -';
    introText.visible = true;
}


function gameOver () {
    ball.body.velocity.setTo(0, 0);    
    introText.text = 'Game Over!';
    introText.visible = true;

    gameOverSound.play();
}



function setCookie(c_name,value,exdays  = 1)
{
  var exdate=new Date();
  exdate.setDate(exdate.getDate() + exdays);
  var c_value=escape(value) + 
    ((exdays==null) ? "" : ("; expires="+exdate.toUTCString()));
  document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
 var i,x,y,ARRcookies=document.cookie.split(";");
 for (i=0;i<ARRcookies.length;i++)
 {
  x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  x=x.replace(/^\s+|\s+$/g,"");
  if (x==c_name)
  {
   return unescape(y);
  }
 }
}