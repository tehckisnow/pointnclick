

let inputManager = engine.input.newManager(game1);
game1.input = inputManager;
let playMode = inputManager.newMode("play");

function left(){
  player1.facing = "left";
  player1.x -= 1.5;
  player1.animation.setAnim("walkLeft");
};
function right(){
  player1.facing = "right";
  player1.x += 1.5;
  player1.animation.setAnim("walkRight");
};
function up(){
  player1.y--;

};
function down(){
  player1.y++;

};
function idle(){
  switch(player1.facing){
    case "right":
      player1.animation.setAnim("idleRight");
      break;
    case "left":
      player1.animation.setAnim("idleLeft");
      break;
    default:
      player1.animation.setAnim("default");
  };
};

playMode.newKey("a", function(){left()});
playMode.newKey("d", function(){right()});
playMode.newKey("w", function(){up()});
playMode.newKey("s", function(){down()});

playMode.noKey(function(){idle()});

