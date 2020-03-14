//TODO:
//implement renderScale
//fill in empty sections from js80
//constructors for:
//    rooms
//    items
//    exits
//    events (what's an event?)


const engine = {

  defaultSettings: {
    debug: false,
    canvas: {},
    ctx: {},
    canvasName: "gameCanvas",
    width: 300,
    height: 200,
    unit: "px",
    marginTop: 40,
    defaultColor: "gray",
    defaultBgColor: "black",
    defaultFont: "Ariel",
    defaultFontColor: "white",
    defaultFontSize: "14px",
    frameRate: 60,
    defaultTileSize: 16,
    renderScale: 1,
    //systemOrder: ["input", "entities", "assets", "collisions", "events", "save", "animations", "render"],
    systemOrder: ["input", "collision", "events", "animation", "render"],
  },//defaultSettings

  log: function(message){console.log('[ENGINE] ' + message)},

  random: function(num){
    return Math.floor(Math.random() * num) + 1;
  },//random()

  start: function(game){
    setInterval(game.frame, 1000 / game.settings.frameRate);
  },//start()

  DOM: {
    create: function(type){
      return document.createElement(type);
    },
    append: function(element, parent){
      parent ? parent.appendChild(element) : document.body.appendChild(element);
    },
    buildCanvas: function(game){
      let newCanvas = engine.DOM.create("canvas");
      engine.DOM.append(newCanvas);
      newCanvas.style.width = game.settings.width + game.settings.unit;
      newCanvas.style.height = game.settings.height + game.settings.unit;
      newCanvas.width = game.settings.width;
      newCanvas.height = game.settings.height;
      newCanvas.style.border = "solid black";
      newCanvas.style.margin = "auto";
      newCanvas.style.marginTop = game.settings.marginTop + game.settings.unit;
      newCanvas.style.display = "block";
      game.settings.canvas = newCanvas;
      newCanvas.ctx = newCanvas.getContext("2d");
      newCanvas.ctx.fillStyle = game.settings.defaultBgColor;
      return newCanvas;
    },
  },//engine.DOM

  //engine.newGame()
  newGame: function(settings){
    let game = {
      canvas: {},
      frame: function(){console.log("GAME.frame() has not yet been defined.")},
      start: function(){engine.start(game)},
      settings: {},
      newScene: function(){
        return game.scenes.new();
      },
      scenes: {
        new: function(){
          return engine.scenes.new(game);
        },
        current: {},
        setCurrent: function(scene){game.scenes.current = scene},
        active: [],
        inactive: [],
      },
      save: {
        //!

      },
      input: {update: function(){}},
      update: function(){
        game.input.update();
        engine.update(game.scenes.active);
      },
    };
    for(i in engine.defaultSettings){
      game.settings[i] = engine.defaultSettings[i];
    };
    if(settings){
      for(i in settings){
        game.settings[i] = settings[i];
      };
    };
    game.canvas = engine.DOM.buildCanvas(game);
    return game;
  },//engine.newGame()

  update: function(scenes){
    for(i in scenes){
      scenes[i].update();
    };
  },//engine.update()

  //engine.scenes
  scenes: {
    new: function(game){
      let scene = {
        nextId: 0,
        parent: game,
        entities: [],
        active: false,
        setActive: function(){
          engine.log("setting scene active");
          if(scene.parent.scenes.active.indexOf(scene) < 0){
            scene.parent.scenes.active.push(scene);
            scene.active = true;
            let index = scene.parent.scenes.inactive.indexOf(scene);
            index > -1 ? scene.parent.scenes.inactive.splice(index, 1) : 1;
          };
        },
        setInactive: function(){
          //!

        },
        newEntity: function(...args){
          let entity = engine.entities.new(scene, ...args);
          entity.id = scene.nextId++;
          scene.entities.push(entity);
          return entity;
        },//scene.newEntity()
        animation: {
          entities: [],
          update: function(){
            engine.animation.update(scene.animation.entities);
          },
        },//scene.animation
        render: {
          entities: [],
          update: function(){
            engine.log("scene.render.update()");
            engine.render.update(scene.parent, scene.render.entities);
          },
        },//scene.render
        //collision{}
        //timer{}
        //map{}
        //audio{}
        //ui{}
        update: function(){
          //timers
          //triggers
          //animation
          scene.animation.update();
          //collision

          //render
          scene.frame();
          if(scene.camera){
            scene.camera.update();
          }else{
            scene.render.update();
          };
        },//scene.update()
        frame: function(){},//scene.frame()
      };
      game.scenes.inactive.push(scene);
      return scene;
    },//engine.scenes.new()
  },//engine.scenes

  entities: {
    new: function(scene, x, y, z){
      let entity = {
        assets: [],
        //
        destroy: function(){},//entity.destroy()
        add: {
          assets: function(scene, assetType, ...args){
            let asset = engine.assets.new(scene, assetType, ...args);
            asset.parent = newEntity;
            newEntity.assets.push(asset);//!
            //! the above line allows multiple assets to be attached to an entity
            //! is this good?  it deviates from the pattern
            return asset;
          },//entity.add.assets()
          render: function(scene, type, ...args){//asset, sprite, xOffset, yOffset, zOffset){
            let render = engine.render.new(scene, type, ...args);
            render.parent = entity;
            entity.render = render;
            scene.render.entities.push(entity);
            engine.render.sort(scene.render.entities);
            return render;
          },//entity.add.render()
          animation: function(...args){
            let animation = engine.animation.new(...args);
            animation.parent = entity;
            scene.animation.entities.push(entity);
            entity.animation = animation;
            return animation;
          },//entity.add.animation()
          collision: function(...args){
            let collision = engine.collision.new(...args);
            collision.parent = entity;
            scene.collision.entities.push(entity);
            entity.collision = collision;
            return collision;
          },//entity.add.collision()
        },//entity.add

      };//entity
      entity.x = x || 0;
      entity.y = y || 0;
      entity.z = z || 0;
      return entity;
    },//engine.entities.new()

  },//engine.entities

  assets: {
    new: function(){},//engine.assets.new()
    image: function(scene, file){
      let newAsset = engine.DOM.create("img");
      newAsset.setAttribute("src", file);
      return newAsset;
    },//engine.assets.image()
    //sound: 

    //tileSet:
    
    sprite: function(x, y, width, height){
      let sprite = {
        x: x,
        y: y,
        width: width,
        height: height,
      };
      return sprite;
    },//engine.assets.sprite()
    genSprites: function(asset){
      let sprites = [];
      let currentX = 0; 
      let currentY = 0;
      while(currentY < asset.height){
        let newSprite = engine.assets.sprite(currentX, currentY, asset.spriteWidth, asset.spriteHeight);
        sprites.push(newSprite);
        currentX += asset.spriteWidth;
        if(currentX >= asset.width){
          currentX = 0;
          currentY += asset.spriteHeight;
        };
      };
      return sprites;
    },//engine.assets.genSprites()
    spriteSheet: function(scene, file, width, height){
      let newSpriteSheet = engine.DOM.create("img");
      newSpriteSheet.setAttribute("src", file);
      newSpriteSheet.spriteWidth = width || scene.parent.settings.defaultTileSize;
      newSpriteSheet.spriteHeight = height || scene.parent.settings.defaultTileSize;

      //! SHOULD NOT HAVE TO declare these dimensions!!! why are they 0?
      newSpriteSheet.height = 32 * 2;
      newSpriteSheet.width = 288 * 2;
      
      newSpriteSheet.sprites = engine.assets.genSprites(newSpriteSheet);
      return newSpriteSheet;
    },//engine.assets.spriteSheet()
    //getMapProperties
    //checkMapObject
    //map
    //mapObjectLayer
    //mapTileLayer
    update: function(){},//engine.assets.update()
  },//engine.assets

    render: {
      new: function(scene, type, asset, sprite, xOffset, yOffset, zOffset){
        let component = {
          type: type,
          asset: asset,
          sprite: sprite || 0,
          xOffset: xOffset,
          yOffset: yOffset,
          zOffset: zOffset,
          flipH: 1,
          flipV: 1,
          visible: true,
        };

        return component;
      },//engine.render.new()
      image: function(game, image, x, y){
        game.settings.canvas.ctx.drawImage(image, x || 0, y || 0);
      },//engine.render.image()
      spr: function(game, spriteSheet, spr, x, y, flipH, flipV){
        //if(flipH !== undefined){game.settings.canvas.ctx.scale(flipH, flipV)};
        game.settings.canvas.ctx.drawImage(
          spriteSheet,
          spriteSheet.sprites[spr].x,
          spriteSheet.sprites[spr].y,
          spriteSheet.sprites[spr].width,
          spriteSheet.sprites[spr].height,
          x || 0,
          y || 0,
          spriteSheet.sprites[spr].width * game.settings.renderScale,
          spriteSheet.sprites[spr].height * game.settings.renderScale
        );
      },//engine.render.spr()
      
      map: function(){},//engine.render.map()
      
      //render utility methods
      //draw a filled rectangle to the screen
      rect: function(game, x, y, x2, y2, color){
        game.canvas.ctx.beginPath();
        game.canvas.ctx.fillStyle = color || game.settings.defaultColor;
        game.canvas.ctx.fillRect(x, y, x2, y2);
      },//engine.render.rect()
      //draw a rectangular outline to the screen
      rectb: function(game, x, y, x2, y2, color){
        game.canvas.ctx.beginPath();
        game.canvas.ctx.strokeStyle = color || game.settings.defaultColor;
        game.canvas.ctx.strokeRect(x, y, x2, y2);
      },//engine.render.rectb()
      //fill screen with a color; defaults to settings.defaultBgColor
      cls: function(game, color){
        let colorUsed;
      if(color){
        colorUsed = color;
      }else{
        colorUsed = game.settings.defaultBgColor;
      };
      engine.render.rect(game, 0, 0, game.settings.width, game.settings.height, colorUsed);
      },//engine.render.cls()
      line: function(game, x, y, x2, y2, color){
        game.canvas.ctx.beginPath();
        game.canvas.ctx.strokeStyle = color || game.settings.defaultColor;
        game.canvas.ctx.moveTo(x, y);
        game.canvas.ctx.lineTo(x2, y2);
        game.canvas.ctx.stroke();
      },//engine.render.line()
      circ: function(game, x, y, radius, color, startAngle, endAngle, counterClockwise){
        game.canvas.ctx.beginPath();
        game.canvas.ctx.fillStyle = color || game.settings.defaultColor;
        game.canvas.ctx.arc(x, y, radius, startAngle || 0, endAngle || 2 * Math.PI);
        game.canvas.ctx.fill();
      },
      circb: function(game, x, y, radius, color, startAngle, endAngle, counterClockwise){
        game.canvas.ctx.beginPath();
        game.canvas.ctx.strokeStyle = color || game.settings.defaultColor;
        game.canvas.ctx.arc(x, y, radius, startAngle || 0, endAngle || 2 * Math.PI);
        game.canvas.ctx.stroke();
      },
      text: function(game, text, x, y, color, font, fontSize){
        game.canvas.ctx.beginPath();
        //game.canvas.ctx.textAlign = "center";
        game.canvas.ctx.font = (fontSize || game.settings.defaultFontSize) + "px " + (font || game.settings.defaultFont);
        game.canvas.ctx.fillStyle = color || game.settings.defaultFontColor;
        game.canvas.ctx.fillText(text || "", x || 0, y || 0);
      },
      textb: function(game, text, x, y, color, font, fontSize){
        game.canvas.ctx.beginPath();
        game.canvas.ctx.font = (fontSize || game.settings.defaultFontSize) + " " + (font || game.settings.defaultFont);
        game.canvas.ctx.strokeStyle = color || game.settings.defaultFontColor;
        game.canvas.ctx.strokeText(text || "", x || 0, y || 0);
      },

      camera: {
        new: function(scene){
          let camera = {
            scene: scene,
            game: scene.parent,
            x: 0,
            y: 0,
            z: 0,
            following: "none",
            xOffset: 0, yOffset: 0, zOffset: 0,//used for following
            position: {
              //translate between screen and map coordinates
              get: function(entity){
                let map = scene.map.current;
                return {x: -map.x + entity.x, y: -map.y + entity.y};
              },
              set: function(entity, x, y){
                entity.x = -x + entity.x;
                entity.y = -y + entity.y;
              },
            },
            pan: function(x, y, speed, duration){},
            follow: function(target, xOffset, yOffset, zOffset){
              if(!target){
                camera.x = 0; camera.y = 0; camera.z = 100;
              }else{
                camera.following = target;
                camera.xOffset = xOffset;
                camera.yOffset = yOffset;
                camera.zOffset = zOffset;
                camera.x = target.x + (xOffset || 0);
                camera.y = target.y + (yOffset || 0);
                camera.z = target.z + (zOffset || 0);
              };
            },
            //if you want to use camera controls, call this instead of engine.render.all()
            update: function(){
              if(camera.following !== "none"){
                camera.follow(camera.following, camera.xOffset, camera.yOffset, camera.zOffset);
              };
              engine.render.update(camera.game, camera.scene.render.entities, -camera.x, -camera.y);
            },
          };
          camera.scene.camera = camera;
          return camera;
        },
      },//camera

      sort: function(collection){
        //sort by z-axis
        collection.sort(function(a, b){return a.z - b.z});

      },
      //pass an array of entities with render components to draw all of them to the screen
      update: function(game, collection, xOffset, yOffset){
        engine.render.cls(game, game.settings.defaultBgColor);
        for(let i in collection){
          let current = collection[i];
          if(!current.render.visible){continue};
          switch(current.render.type){
            case "image":
              engine.render.image(game, current.render.asset, current.x + (xOffset || 0), current.y + (yOffset || 0));
              break;
            case "sprite":
              engine.render.spr(game, current.render.asset, current.render.sprite, current.x + (xOffset || 0), current.y + (yOffset || 0), current.render.flipH, current.render.flipV);
              break;
            case "map":
              engine.render.map(game, current, current.x + (xOffset || 0), current.y + (yOffset || 0));
              break;
            default:
              engine.log("render.type not found for ", collection[i]);
          };
        };
      },//engine.render.update()
    },//engine.render

  animation: {
    new: function(anims, frameRate, defaultAnim, startingAnim){
      let newComponent = {};
      newComponent.anims = anims;
      newComponent.default = defaultAnim || "default";
      newComponent.anims.default = [newComponent.anims[newComponent.default]] || "default";
      newComponent.currentAnim = startingAnim || defaultAnim || "default";
      newComponent.frame = 0;
      newComponent.frameRate = frameRate || 20;
      newComponent.animTimer = frameRate || 20;
      newComponent.setAnim = function(anim){
        if(newComponent.currentAnim !== anim){
          newComponent.currentAnim = anim;
          newComponent.frame = 0;
          newComponent.parent.render.sprite = newComponent.anims[newComponent.currentAnim][newComponent.frame];
        };
      };
      newComponent.animate = function(){
        newComponent.animTimer--;
        if(newComponent.animTimer < 0){
          newComponent.animTimer = newComponent.frameRate;
          newComponent.frame++;
          if(newComponent.frame > newComponent.anims[newComponent.currentAnim].length - 1){
            newComponent.frame = 0;
          };

          //!
          engine.log(newComponent.currentAnim + " : " + newComponent.frame + " : " + newComponent.anims[newComponent.currentAnim][newComponent.frame]);

          newComponent.parent.render.sprite = newComponent.anims[newComponent.currentAnim][newComponent.frame];
        };
      };
      return newComponent;
    },

    //!this structure is different from sprite animations
    //each animation holds anim logic instead of the animation component
    //this is to facilitate multiple simultaneous animations for the map
    newMapAnimationComponent: function(){
      let component = {};
      component.anims = [];
      component.activeAnims = [];
      component.newAnim = function(name, time, frames, tiles){
        let anim = {};
        anim.time = time;
        anim.name = name;
        anim.frames = frames;
        anim.currentFrame = 0;
        anim.tiles = tiles;
        anim.frameRate = time;
        anim.timer = time;
        component.anims.push(anim);
        return anim;
      };
      component.update = function(){
        for(a in component.activeAnims){
          let curr = component.activeAnims[a];
          curr.timer--;
          if(curr.timer < 0){
            curr.timer = curr.frameRate;
            curr.currentFrame++;
            if(curr.currentFrame > curr.frames.length -1){
              curr.currentFrame = 0;
            };
            for(t in tiles){
              //edit map tile tiles[t] to have tile curr.frames[curr.currentFrame];
              //tiles[t]
              //curr.frames[curr.currentFrame];
            };
          };
        };
      };
      return component;
    },

    update: function(collection){
      for(i in collection){
        collection[i].animation.animate();
      };
    },
  },//engine.animation

  collision: {},//engine.collision

  timer: {},//engine.timer

  events: {},//engine.events

  sequences: {},//engine.sequences

  input: {
    newManager: function(game){
      let inputManager = {
        type: "inputManager",
        modes: [],
        currentMode: "",
        enabled: true,
        disable: function(){for(i in modes){modes[i].disable()}},
        enable: function(){for(i in modes){modes[i].enable()}},
        keyDown: function(event){
          let key = inputManager.currentMode.keys.findIndex(function(element){return element.key === event.key})
          if(key !== -1) inputManager.currentMode.keys[key].state = true;
        },
        keyUp: function(event){
          for(i in inputManager.modes){
            let keyIndex = inputManager.modes[i].keys.findIndex(function(element){return element.key === event.key})
          if(keyIndex !== -1){
            inputManager.modes[i].keys[keyIndex].state = false;
            //reset repeatCount
            inputManager.modes[i].keys.find(function(element){return element.key === event.key}).repeatCount = 0;
            //remove key from pressed
            if(inputManager.modes[i].pressed.includes(event.key)){
              let pressedKey = inputManager.modes[i].pressed.indexOf(event.key);
              inputManager.modes[i].pressed.splice(pressedKey, 1);
            };
          };
          };//for(i in inputManager.modes){};
        },
        newMode: function(name){
          let newMode = {
            enabled: true,
            disable: function(){newMode.enabled = false},
            enable: function(){newMode.enabled = true},
            keys: [],
            pressed: [],
            noKeyEffect: function(){},
            newKey: function(key, effect, exclusive, repeatLimit){
              let newKey = {
                state: false,
              };
              newKey.key = key;
              newKey.effect = effect || function(){};
              newKey.exclusive = exclusive || false;
              
              newKey.repeatLimit = 0;
              newKey.repeatCount = 0;
              if(repeatLimit){
                newKey.repeatLimit = repeatLimit;
              };
              
              newMode.keys.push(newKey);
            },
            noKey: function(effect){
              newMode.noKeyEffect = effect;
            },
            noKeyTest: function(){
              let nokeys = true;
              if(newMode.keys.length > 0){
                for(i in newMode.keys){
                  if(newMode.keys[i].state){
                    nokeys = false;
                  };
                };
              };
              if(nokeys){
                newMode.noKeyEffect();
              };
            },
            btn: function(inp){
              let key = newMode.keys.findIndex(function(element){return element.key === inp});
              if(key != -1) return newMode.keys[key].state;
            },
            btnp: function(inp){
              let key = newMode.keys.findIndex(function(element){return element.key === inp});
              if(key != -1 && newMode.keys[key].state){
                if(!(newMode.pressed.includes(inp))){
                  newMode.pressed.push(inp);
                  return true;
                };
              }else return false;
            },
          };
          newMode.name = name;
          inputManager.modes.push(newMode);
          //if no currentMode has yet been specified, this one is set
          if(inputManager.currentMode === ""){
            inputManager.setMode(newMode);
            inputManager.currentMode = newMode;
          };
          return newMode;
        },
        setMode: function(mode){
          inputManager.modeToSet = mode;
        },
        update: function(){engine.input.update(inputManager)},
      };
      document.body.setAttribute("onkeydown", "inputManager.keyDown(event)");
      document.body.setAttribute("onkeyup", "inputManager.keyUp(event)");
      return inputManager;
    },

    update: function(inputManager){
      if(inputManager.currentMode.enabled){
        for(z in inputManager.currentMode.keys){
          if(inputManager.currentMode.keys[z].state){
            //!when an effect changes the mode, things can break; created inputManager.setMode to fix
            
            if(inputManager.currentMode.keys[z].repeatLimit === 0){
              inputManager.currentMode.keys[z].effect();
            }else{
              inputManager.currentMode.keys[z].repeatCount--;
              if(inputManager.currentMode.keys[z].repeatCount < 0){
                inputManager.currentMode.keys[z].repeatCount = inputManager.currentMode.keys[z].repeatLimit;
                inputManager.currentMode.keys[z].effect();
              };
              
            };

            if(inputManager.currentMode.keys[z].exclusive){
              break;
            };

          };
        };
      };
      inputManager.currentMode.noKeyTest();
      inputManager.currentMode = inputManager.modeToSet;
    },
  },//engine.input

  //menu
  //ui
  //effects
  save: {},//engine.save
  audio: {},//engine.audio


};//engine