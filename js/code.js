var shelfAction;
var chairAction;
var doorAction;

var INTERSECTED;
var clock;
var scene;
var camera;
var raycaster;
var mouse;
var renderer;
var mixer;
var referenceThing = {}
var outputEncoding = true
var gammaOutput = true

function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


function init() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );
  // camera.position.set( - 5, -5, 10 );
  camera.lookAt( new THREE.Vector3( 0, 2, 0 ) );


  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  renderer.setClearColor(0x606060);

  animationGroup = new THREE.Object3D();

  // create an AudioListener and add it to the camera
  var listener = new THREE.AudioListener();
  camera.add( listener );

  // create the PositionalAudio object (passing in the listener)
  var sound = new THREE.PositionalAudio( listener );

  // load a sound and set it as the PositionalAudio object's buffer
  // var audioLoader = new THREE.AudioLoader();
  // audioLoader.load( 'sounds/spinning.mp3', function( buffer ) {
  // 	sound.setBuffer( buffer );
  // 	sound.setRefDistance( 2 );
  //   actionsound1 = sound.play();
  // });

  var loader = new THREE.GLTFLoader();
  loader.load(
    'models/gltf/Room2.glb',
    function ( gltf ) {
      var model = gltf.scene;
      // scene.add(model);
      mixer = new THREE.AnimationMixer(model);
      console.log({ mixer })

console.log(gltf.animations);

      shelfAction = mixer.clipAction(gltf.animations[0]);
      shelfAction.setLoop( THREE.LoopOnce );

      chairAction = mixer.clipAction(gltf.animations[1])
      chairAction.setLoop(THREE.LoopOnce)

      doorAction = mixer.clipAction(gltf.animations[2])
      doorAction.setLoop(THREE.LoopOnce)

      gltf.scene.position.set(0, -1, 0);
      animationGroup.add(model);
      scene.add(model);
    }
  );

  //	LIGHT
  // var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 10 );
  // scene.add( light );
  light = new THREE.PointLight(0xffffff, 0.8, 5);
  light.position.set(0, 0, 5);
  scene.add(light);
  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 0, 5, 10 );
  scene.add( spotLight );

  // var spotLightHelper = new THREE.SpotLightHelper( spotLight );
  // scene.add( spotLightHelper );

  camera.position.z = 5;
  camera.position.set( 0, 0, 5 );

  var controls = new THREE.OrbitControls( camera );
  controls.update();
}
console.log('function 1');


var animate = function () {

  document.addEventListener( 'mouseup', onDocumentMouseUp, false )
  // var intersects = raycaster.intersectObjects(animationGroup.children);

  requestAnimationFrame( animate );

  var delta = clock.getDelta();

  if (mixer != null) {
    mixer.update(delta);
  };

  renderer.render( scene, camera );

};

window.onload = function () {
  init();
  animate();
  // renderer.gammaInput = true;
  renderer.gammaOutput = true;
}

function onDocumentMouseUp( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children, true );

  if ( intersects.length > 0 ) {

    var object = intersects[ 0 ].object;
    console.log('intersecting with', object)
    if (object.name == 'Cube.006_3' || object.name == 'Cube.006_1') {
  


      shelfAction.stop();
      shelfAction.play();
      //shelfAction.clampWhenFinished = true;

      // actionsound1.stop();
      // actionsound1.play();
    } else if (object.name == '') {
      chairAction.stop();
      chairAction.play();

    }  else if (object.name == 'hinge.001Action') {
      doorAction.stop();
      door.play();

    }

    if (mixer) {
      console.log(object.uuid, mixer.getRoot())
    }

    if ( INTERSECTED !== object ) {

      // if ( INTERSECTED ) INTERSECTED.material.program = programStroke;
      INTERSECTED = object;
      // INTERSECTED.material.program = programFill;
    }
  } else if ( INTERSECTED ) {
    // INTERSECTED.material.program = programStroke;
    INTERSECTED = null;
  }
  // renderer.render( scene, camera );

}
