var game = new Phaser.Game(800,600, Phaser.AUTO, 'gameCanvas',
{
	preload: preload,
	create: create,
	update: update
});

var sampleSprite;
function preload(){
	console.log("preload");
	game.load.image('chess', 'resource/chess.jpg');
}
function create(){
	console.log("create");
	sampleSprite = game.add.sprite(0,0, 'chess');
	console.log(sampleSprite);
}
function update(){
	sampleSprite.angle += 1;
}