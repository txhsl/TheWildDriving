//COLORS
var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    brownDark:0x23190f,
    pink:0xF5986E,
    yellow:0xf4ce93,
    blue:0x68c3c0,
    green:0x76ff03,
    purple:0x7c4dff,
    grey:0x212121,
};

//SKINS
var MainColors = [Colors.red, Colors.yellow, Colors.green, Colors.purple, Colors.grey];

///////////////

// GAME VARIABLES
var game;
var deltaTime = 0;
var newTime = new Date().getTime();
var oldTime = new Date().getTime();
var ennemiesPool = [];
var particlesPool = [];
var particlesInUse = [];
var model = new Model();

function resetGame(){
    game = {speed:0,
            initSpeed:.00045,
            baseSpeed:.00045,
            targetBaseSpeed:.00045,
            incrementSpeedByTime:.0000025,
            incrementSpeedByLevel:.000005,
            distanceForSpeedUpdate:100,
            speedLastUpdate:0,
  
            targetY:0,
            targetZ:0,
            distance:0,
            ratioSpeedDistance:50,
            energy:100,
            ratioSpeedEnergy:3,
  
            level:1,
            levelLastUpdate:0,
            distanceForLevelUpdate:1000,
  
            planeDefaultHeight:100,
            planeAmpHeight:80,
            planeAmpWidth:75,
            planeMoveSensivity:0.005,
            planeRotXSensivity:0.0008,
            planeRotZSensivity:0.0004,
            planeFallSpeed:.001,
            planeMinSpeed:1.2,
            planeMaxSpeed:1.6,
            planeSpeed:0,
            planeCollisionDisplacementX:0,
            planeCollisionSpeedX:0,
  
            planeCollisionDisplacementY:0,
            planeCollisionSpeedY:0,
  
            seaRadius:3000,
            seaLength:2000,
            //seaRotationSpeed:0.006,
            wavesMinAmp : 5,
            wavesMaxAmp : 20,
            wavesMinSpeed : 0.001,
            wavesMaxSpeed : 0.003,
  
            cameraFarPos:500,
            cameraNearPos:150,
            cameraSensivity:0.002,
  
            coinDistanceTolerance:30,
            coinValue:3,
            coinsSpeed:.5,
            coinLastSpawn:0,
            distanceForCoinsSpawn:100,
  
            ennemyInnerDistanceTolerance: 40,
            ennemyOutterDistanceTolerance: 60,
            ennemyValue:10,
            ennemiesSpeed:.6,
            ennemyLastSpawn:0,
            distanceForEnnemiesSpawn:150,

            usrDistanceTolerance:20,
  
            status : "waitingPlay",
    };
    fieldLevel.innerHTML = Math.floor(game.level);
}

//THREEJS RELATED VARIABLES

var scene, context, canvas, 
camera, fieldOfView, aspectRatio, nearPlane, farPlane,
renderer,
container,
controls;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH,
mousePos = { x: 0, y: 0 };

//INIT THREE JS, SCREEN AND MOUSE EVENTS

function createScene() {

    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
  
    scene = new THREE.Scene();
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 50;
    nearPlane = .1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
      );
    scene.fog = new THREE.Fog(0xf7d9aa, 100,2000);
 
    camera.position.x = -400;
    camera.position.z = 0;
    camera.position.y = 0;

    camera.lookAt(new THREE.Vector3(0, 0, 0));
  
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(WIDTH, HEIGHT);
  
    renderer.shadowMap.enabled = true;
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    canvas = document.createElement('canvas');
    context = canvas.getContext("2d");
  
    window.addEventListener('resize', handleWindowResize, false);
  
}
  
// MOUSE AND SCREEN EVENTS
  
function handleWindowResize() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}
  
function handleMouseMove(event) {
    var tx = -1 + (event.clientX / WIDTH)*2;
    var ty = 1 - (event.clientY / HEIGHT)*2;
    mousePos = {x:tx, y:ty};
}

function handleMousewheel(e) {
  e.preventDefault();
  var fov = camera.fov;
  
  if (e.wheelDelta) { //IE and Chrome
      if (e.wheelDelta > 0) { //up
          fov -= (40 < fov ? 3 : 0);
      }
      if (e.wheelDelta < 0) { //down
          fov += (fov < 80 ? 3 : 0);
      }
  } else if (e.detail) {  //Firefox
      if (e.detail > 0) { //up
          fov -= 3;
      }
      if (e.detail < 0) { //down
          fov += 3;
      }
  }

  //camera.fov = fov;
  camera.fov = normalize(fov,-1,1,40, 80);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
  //updateinfo();
}
  
function handleTouchMove(event) {
    event.preventDefault();
    var tx = -1 + (event.touches[0].pageX / WIDTH)*2;
    var ty = 1 - (event.touches[0].pageY / HEIGHT)*2;
    mousePos = {x:tx, y:ty};
}
  
function handleMouseUp(event){
    if (game.status == "waitingReplay"){
      resetGame();
      hideReplay();
      game.status = "playing";
    }else if(game.status == "waitingPlay"){
      resetGame();
      hidePlay();
      game.status = "playing";
    }
}
  
  
function handleTouchEnd(event){
    if (game.status == "waitingReplay"){
      resetGame();
      hideReplay();
      game.status = "playing";
    }else if(game.status == "waitingPlay"){
      resetGame();
      hidePlay();
      game.status = "playing";
    }
}

// CHAT

var messages = [];


// LIGHTS

var ambientLight, hemisphereLight, shadowLight;

function createLights() {

  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

  ambientLight = new THREE.AmbientLight(0xdc8874, .5);

  shadowLight = new THREE.DirectionalLight(0xffffff, .9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;
  shadowLight.shadow.mapSize.width = 4096;
  shadowLight.shadow.mapSize.height = 4096;

  var ch = new THREE.CameraHelper(shadowLight.shadow.camera);

  //scene.add(ch);
  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(ambientLight);

}

// 3D Models
var sea;
var airplane;

function createUserPlane(){
  airplane = new AirPlane(0);
  airplane.mesh.scale.set(.25,.25,.25);
  airplane.mesh.position.y = game.planeDefaultHeight;

  // add into model
  model.userPlane = airplane;
  model.userPlane.id = -1;
  model.planes[model.userPlane.id] = model.userPlane;
  scene.add(airplane.mesh);
}

function createSea(){
  sea = new Sea();
  sea.mesh.position.y = -game.seaRadius;
  scene.add(sea.mesh);
}

function createSky(){
  sky = new Sky();
  sky.mesh.position.y = -game.seaRadius;
  scene.add(sky.mesh);
}

function createCoins(){

  coinsHolder = new CoinsHolder(20);
  scene.add(coinsHolder.mesh)
}

function createEnnemies(){
  for (var i=0; i<10; i++){
    var ennemy = new Ennemy();
    ennemiesPool.push(ennemy);
  }
  ennemiesHolder = new EnnemiesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(ennemiesHolder.mesh)
}

function createParticles(){
  for (var i=0; i<10; i++){
    var particle = new Particle();
    particlesPool.push(particle);
  }
  particlesHolder = new ParticlesHolder();
  //ennemiesHolder.mesh.position.y = -game.seaRadius;
  scene.add(particlesHolder.mesh)
}

function makeTextSprite( message, parameters )
{
    if ( parameters === undefined ) parameters = {};
    var fontface = parameters.hasOwnProperty("fontface") ? parameters["fontface"] : "Arial";
    var fontsize = parameters.hasOwnProperty("fontsize") ? parameters["fontsize"] : 18;
    var borderThickness = parameters.hasOwnProperty("borderThickness") ? parameters["borderThickness"] : 1;
    var textColor = parameters.hasOwnProperty("textColor") ?parameters["textColor"] : { r:226, g:219, b:226, a:1.0 };

    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText( message );
    var textWidth = metrics.width;

    context.lineWidth = 0.5;

    var opacity = Math.max(Math.min(20 / Math.max(this.timeSinceLastServerUpdate-300,1),1),.2).toFixed(3);
    context.fillStyle = "rgba("+textColor.r+", "+textColor.g+", "+textColor.b+", "+opacity+")";
    context.fillText( message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas);
    texture.needsUpdate = false;
    texture.minFilter = THREE.LinearFilter;

    var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
    var sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(2.0 * fontsize, 1.0 * fontsize, 3.0 * fontsize);
    return sprite;
}

// NETWORK
var webSocket, webSocketService, messageQuota = 25, settings;

function onSocketOpen(e){
  console.log('Socket opened!', e);
  
  //FIXIT: Proof of concept. refactor!
  uri = parseUri(document.location)
  if ( uri.queryKey.oauth_token ) {
    app.authorize(uri.queryKey.oauth_token, uri.queryKey.oauth_verifier)						
  }
  // end of proof of concept code.
};

function onSocketClose(e) {
  console.log('Socket closed!', e);
  webSocketService.connectionClosed();
};

function onSocketMessage(e) {
  try {
    var data = JSON.parse(e.data);
    webSocketService.processMessage(data);
  } catch(e) {
    console.log(e);
  }
};

function sendMessage(msg) {
  
  if (messageQuota>0) {
    messageQuota--;
    webSocketService.sendMessage(msg);
  }
  
}

function authorize(token,verifier) {
  webSocketService.authorize(token,verifier);
}

function loop(){

  newTime = new Date().getTime();
  deltaTime = newTime-oldTime;
  oldTime = newTime;

  if (game.status=="playing" || game.status=="waitingPlay"){

    // Add energy coins every 100m;
    if (Math.floor(game.distance)%game.distanceForCoinsSpawn == 0 && Math.floor(game.distance) > game.coinLastSpawn){
      game.coinLastSpawn = Math.floor(game.distance);
      coinsHolder.spawnCoins();
    }

    if (Math.floor(game.distance)%game.distanceForSpeedUpdate == 0 && Math.floor(game.distance) > game.speedLastUpdate){
      game.speedLastUpdate = Math.floor(game.distance);
      game.targetBaseSpeed += game.incrementSpeedByTime*deltaTime;
    }


    if (Math.floor(game.distance)%game.distanceForEnnemiesSpawn == 0 && Math.floor(game.distance) > game.ennemyLastSpawn){
      game.ennemyLastSpawn = Math.floor(game.distance);
      ennemiesHolder.spawnEnnemies();
    }

    if (Math.floor(game.distance)%game.distanceForLevelUpdate == 0 && Math.floor(game.distance) > game.levelLastUpdate){
      game.levelLastUpdate = Math.floor(game.distance);
      game.level++;
      fieldLevel.innerHTML = Math.floor(game.level);

      game.targetBaseSpeed = game.initSpeed + game.incrementSpeedByLevel*game.level
    }

    updatePlane();
    updateDistance();
    updateEnergy();
    updateScoreList();
    updateMessages();

    game.baseSpeed += (game.targetBaseSpeed - game.baseSpeed) * deltaTime * 0.02;
    game.speed = game.baseSpeed * game.planeSpeed * 0.2;

  }else if(game.status=="gameover"){
    game.speed *= .99;
    airplane.mesh.rotation.z += (-Math.PI/2 - airplane.mesh.rotation.z)*.0002*deltaTime;
    airplane.mesh.rotation.x += 0.0003*deltaTime;
    game.planeFallSpeed *= 1.05;
    airplane.mesh.position.y -= game.planeFallSpeed*deltaTime;

    if (airplane.mesh.position.y <-200){
      showReplay();
      game.status = "waitingReplay";

    }
  }else if(game.status=="waitingReplay"){
  }

  for (var id in model.planes){
		if (id != model.userPlane.id){

      var otherPlane = model.planes[id];

      if (otherPlane.status == "playing"){
        otherPlane.mesh.position.y += (otherPlane.targetY-otherPlane.mesh.position.y)*deltaTime*game.planeMoveSensivity;
        otherPlane.mesh.position.z += (otherPlane.targetZ-otherPlane.mesh.position.z)*deltaTime*game.planeMoveSensivity*0.1;
    
        otherPlane.mesh.rotation.z = (otherPlane.targetY-otherPlane.mesh.position.y)*deltaTime*game.planeRotXSensivity;
        otherPlane.mesh.rotation.x = -(otherPlane.mesh.position.z-otherPlane.targetZ)*deltaTime*game.planeRotZSensivity*0.1;
      }
      else if (otherPlane.status == "gameover"){
        otherPlane.mesh.rotation.z += (-Math.PI/2 - airplane.mesh.rotation.z)*.0002*deltaTime;
        otherPlane.mesh.rotation.x += 0.0003*deltaTime;
        otherPlane.mesh.position.y -= otherPlane.planeFallSpeed*deltaTime;
      }
    }
  }

  if(webSocketService.hasConnection) {
    webSocketService.sendUpdate(model.userPlane, targetY, targetZ);
  }

  for (id in model.planes){
    model.planes[id].propeller.rotation.x +=.2 + game.planeSpeed * deltaTime*.005;
    model.planes[id].update();
  }
  //airplane.propeller.rotation.x +=.2 + game.planeSpeed * deltaTime*.005;

  sea.mesh.rotation.z += game.speed*deltaTime;//*game.seaRotationSpeed;

  if ( sea.mesh.rotation.z > 2*Math.PI)  sea.mesh.rotation.z -= 2*Math.PI;

  ambientLight.intensity += (.5 - ambientLight.intensity)*deltaTime*0.005;

  coinsHolder.rotateCoins();
  ennemiesHolder.rotateEnnemies();
  model.checkUserCollision();

  sky.moveClouds();
  sea.moveWaves();

  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

function updateDistance(){
  game.distance += game.speed*deltaTime*game.ratioSpeedDistance;
  fieldDistance.innerHTML = Math.floor(game.distance);
  var d = 502*(1-(game.distance%game.distanceForLevelUpdate)/game.distanceForLevelUpdate);
  levelCircle.setAttribute("stroke-dashoffset", d);

}

var blinkEnergy=false;

function updateEnergy(){
  game.energy -= game.speed*deltaTime*game.ratioSpeedEnergy;
  game.energy = Math.max(0, game.energy);
  energyBar.style.right = (100-game.energy)+"%";
  energyBar.style.backgroundColor = (game.energy<50)? "#f25346" : "#68c3c0";

  if (game.energy<30){
    energyBar.style.animationName = "blinking";
  }else{
    energyBar.style.animationName = "none";
  }

  if (game.energy <1){
    game.status = "gameover";
  }
}

function addEnergy(){
  game.energy += game.coinValue;
  game.energy = Math.min(game.energy, 100);
}

function removeEnergy(){
  game.energy -= game.ennemyValue;
  game.energy = Math.max(0, game.energy);
}

function updatePlane(){

  game.planeSpeed = normalize(mousePos.x,-.5,.5,game.planeMinSpeed, game.planeMaxSpeed);
  targetY = normalize(mousePos.y,-.75,.75,25, 225);
  targetZ = normalize(mousePos.x,-.75,.75,-500, 500);

  game.planeCollisionDisplacementX += game.planeCollisionSpeedX;
  targetZ += game.planeCollisionDisplacementX;

  game.planeCollisionDisplacementY += game.planeCollisionSpeedY;
  targetY += game.planeCollisionDisplacementY;

  airplane.mesh.position.y += (targetY-airplane.mesh.position.y)*deltaTime*game.planeMoveSensivity;
  airplane.mesh.position.z += (targetZ-airplane.mesh.position.z)*deltaTime*game.planeMoveSensivity*0.1;

  airplane.mesh.rotation.z = (targetY-airplane.mesh.position.y)*deltaTime*game.planeRotXSensivity;
  airplane.mesh.rotation.x = -(airplane.mesh.position.z-targetZ)*deltaTime*game.planeRotZSensivity*0.1;

  game.planeCollisionSpeedX += (0-game.planeCollisionSpeedX)*deltaTime * 0.03;
  game.planeCollisionDisplacementX += (0-game.planeCollisionDisplacementX)*deltaTime *0.01;
  game.planeCollisionSpeedY += (0-game.planeCollisionSpeedY)*deltaTime * 0.03;
  game.planeCollisionDisplacementY += (0-game.planeCollisionDisplacementY)*deltaTime *0.01;

  var targetCameraZ = normalize(game.planeSpeed, game.planeMinSpeed, game.planeMaxSpeed, game.cameraNearPos, game.cameraFarPos);
  //camera.fov = normalize(airplane.mesh.position.y - game.planeDefaultHeight,-1,1,40, 80);
  camera.fov = normalize(-mousePos.y,-1,1,50, 70);
  camera.updateProjectionMatrix();
  camera.position.y += (airplane.mesh.position.y - camera.position.y)*deltaTime*game.cameraSensivity;
  camera.position.z += (airplane.mesh.position.z - camera.position.z)*deltaTime*game.cameraSensivity;

  //airplane.pilot.updateHairs();
}

function showReplay(){
  replayMessage.style.display="block";
  instructionsMessage.style.display="block";
}

function hideReplay(){
  replayMessage.style.display="none";
  instructionsMessage.style.display="none";
}

function showPlay(){
  playMessage.style.display="block";
  instructionsMessage.style.display="block";
}

function hidePlay(){
  playMessage.style.display="none";
  instructionsMessage.style.display="none";

  meta.style.display="block";

  document.addEventListener('mousemove', handleMouseMove, false);
  document.addEventListener('touchmove', handleTouchMove, false);

  loop();
}

function updateScoreList(){
  model.updateScore();
}

function updateMessages(){
  // Update messages
  messageBox.innerHTML = '';
  for (var i = messages.length - 1; i >= 0; i--) {
    var msg = messages[i];
    msg.update();

    msg.draw();
    if(msg.age == msg.maxAge) {
      messages.splice(i,1);
    }
  }
}

function normalize(v,vmin,vmax,tmin, tmax){
  var nv = Math.max(Math.min(v,vmax), vmin);
  var dv = vmax-vmin;
  var pc = (nv-vmin)/dv;
  var dt = tmax-tmin;
  var tv = tmin + (pc*dt);
  return tv;
}

function compare(property){
  return function(a,b){
      var value1 = a[property];
      var value2 = b[property];
      return value1 - value2;
  }
}

function sortBy(attr,rev){
  if(rev ==  undefined){
      rev = 1;
  }else{
      rev = (rev) ? 1 : -1;
  }
  return function(a,b){
      a = a[attr];
      b = b[attr];
      if(a < b){
          return rev * -1;
      }
      if(a > b){
          return rev * 1;
      }
      return 0;
  }
}

var fieldDistance, energyBar, replayMessage, instructionsMessage, playMessage, fieldLevel, levelCircle, meta, scoreList, messageBox;

function init(event){

  // UI

  fieldDistance = document.getElementById("distValue");
  energyBar = document.getElementById("energyBar");
  replayMessage = document.getElementById("replayMessage");
  instructionsMessage = document.getElementById("instructions");
  playMessage = document.getElementById("playMessage");
  fieldLevel = document.getElementById("levelValue");
  levelCircle = document.getElementById("levelCircleStroke");
  header = document.getElementById("header");
  instructions = document.getElementById("instructions");
  partisan = document.getElementById("partisan");
  meta = document.getElementById("meta");
  scoreList = document.getElementById("scoreList");
  messageBox = document.getElementById("messageBox");
  nameValue = document.getElementById("nameValue");

  resetGame();
  createScene();

  createLights();
  createUserPlane();
  createSea();
  createSky();
  createCoins();
  createEnnemies();
  createParticles();

  //NETWORK
  model.settings    = new Settings();
  webSocket 				= new WebSocket( model.settings.socketServer );
  webSocket.onopen 		= onSocketOpen;
  webSocket.onclose		= onSocketClose;
  webSocket.onmessage 	= onSocketMessage;
  
  webSocketService		= new WebSocketService(model, webSocket);

  document.addEventListener('mouseup', handleMouseUp, false);
  document.addEventListener('touchend', handleTouchEnd, false);
  //document.addEventListener('mousewheel', handleMousewheel, false);
  //loop();
}

window.addEventListener('load', init, false);
