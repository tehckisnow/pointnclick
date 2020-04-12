//TODO:
//consider supporting mouseover?

//let one = "room: doctors_office, image: doctors_office.png, interactions: {}";


let pnc = {

  log: function(text){console.log("[PNC]: " + text)},

  default: {
    unit: "px",
    roomName: "room",
    roomImage: "not_found.png",
    eventName: "event",
    eventX: 0,
    eventY: 0,
    eventZ: 0,
    eventHeight: 50,
    eventWidth: 50,
    eventImage: "not_found.png",
    eventEffect: function(){engine.error("interaction effect not found")},
  },//pnc.defaults

  //container for rooms
  newMap: function(settings){
    let map = {
      nextRoomId: 0,
      nextInterId: 0,
      default: {},
      rooms: new Map(),
      newRoom: function(name, ...args){
        let room = pnc.newRoom(name, ...args);
        room.map = map;
        map.rooms.set(name, room);
        return room;
      },//map.newRoom()
    };//map
    //populate settings
    //  default
    for(let d in pnc.default){
      map.default[d] = pnc.default[d];
    };
    //  custom
    for(let i in settings){
      //check for setting and send error if not found
      if(!map.default[i]){
        pnc.log(i + " setting not found");
      };
      map.default[i] = settings[i];
    };
    //return
    return map;
  },//pnc.newMap()

  newRoom: function(name, image, interactions){
    let room = {
      name: name || engine.defaults.roomName,
      image: image || engine.defaults.roomImage,
      interactions: interactions || [],
      map: "unassigned",
    };//room()

    return room;
  },//pnc.newRoom()

  newEvent: function(x, y, width, height, image, effect){
    let event = {};
    event.x = x || engine.defaults.eventX;
    event.y = y || engine.defaults.eventY;
    event.z = z || engine.defaults.eventZ;
    event.width = width || engine.defaults.eventWidth;
    event.height = height || engine.defaults.eventHeight;
    event.image = image || engine.defaults.eventImage;
    event.effect = effect || engine.defaults.eventEffect;
    return event;
  },//pnc.newEvent()
  

};//pnc


let map1 = pnc.newMap({eventWidth: 100});
map1.newRoom("kitchen1", "kitchen1.png", {});


/*

interaction(x, y, image, effect)
exit(x, y, image)

actor(x, y, spriteAsset, sprite, animation)


*/