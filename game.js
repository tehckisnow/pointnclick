
//settings
let settings = {
  debug: true,
};

let game1 = engine.newGame(settings);
let scene1 = game1.newScene();
scene1.setActive();

//assets
let background1 = engine.assets.image(scene1, "background1.png");
let playerSprite = engine.assets.spriteSheet(scene1, "playerSprite.png", 16 * 2, 32 * 2);

//let doorSfx = scene1.audio.manager.newTrack("sfx", "punch.wav");
//let dialogue = scene1.ui.manager.textbox.new("", dialogueTheme);
//scene1Fade = scene1.ui.manager.effect.new("fade", game1, "black", 100, 1);
//let music1 = scene1.audio.manager.newTrack("music", "music.mp3");
// let dialogueTheme = engine.ui.textbox.newTheme({
//   x: 10, y: 150, height: game1.settings.height - 160, width: game1.settings.width - 20,
//   //bgColor: colors[3], borderColor: colors[1], fontColor: colors[0],
//   charLength: 45, vertOffset: 15, horOffset: 10, lines: 2,
//   //overflowIconColor: colors[0],
//   font: 'ebrima',
// });

//entities
let roomBg1 = scene1.newEntity(0,0);
roomBg1.add.render(scene1, "image", background1, 0);

let player1 = scene1.newEntity(80, 110);
player1.add.render(scene1, "sprite", playerSprite, 0);
player1.facing = "right";
let playerAnims = {
  default: [0, 1, 2, 3],
  idle: [0, 1, 2, 3],
  idleLeft: [9, 10, 11, 12],
  idleRight: [0, 1, 2, 3],
  walkLeft: [9, 13, 14, 15, 16, 17],
  walkRight: [0, 4, 5, 6, 7, 8],
};
player1.add.animation(playerAnims, 10, "idle", "idle");


let camera = engine.render.camera.new(scene1);
let centerPosition = {x: 8 * 16, y: 6 * 16};
camera.follow(player1, -centerPosition.x, -centerPosition.y);

game1.frame = function(){
  game1.update();
};//game1.frame()

game1.start();

//ideas:
//  constructor for "rooms"?
//  room position is 0,0
