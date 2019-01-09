//var shelfAction;
var chairAction;
var boxAction;
var doorAction;
var certAction;
var boxlidAction;
var shelfAction;

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

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  renderer.setClearColor(0x606060);

  animationGroup = new THREE.Object3D();

  var loader = new THREE.GLTFLoader();
  loader.load(
    'models/gltf/Room.glb',
    function ( gltf ) {
      var model = gltf.scene;

      // scene.add(model);
      mixer = new THREE.AnimationMixer(model);
      console.log({ mixer })


      console.log(gltf.animations);
      doorAction = mixer.clipAction(gltf.animations[0])
      doorAction.setLoop(THREE.LoopOnce)

      chairAction = mixer.clipAction(gltf.animations[1]);
      chairAction.setLoop( THREE.LoopOnce );

      boxAction = mixer.clipAction(gltf.animations[2])
      boxAction.setLoop(THREE.LoopOnce)

      bookAction = mixer.clipAction(gltf.animations[3])
      bookAction.setLoop(THREE.LoopOnce)

      boxlidAction = mixer.clipAction(gltf.animations[4])
      boxlidAction.setLoop(THREE.LoopOnce)

      certAction = mixer.clipAction(gltf.animations[5])
      certAction.setLoop(THREE.LoopOnce)

      shelfAction = mixer.clipAction(gltf.animations[6])
      shelfAction.setLoop(THREE.LoopOnce)


      gltf.scene.position.set(2, -3, 0);
      animationGroup.add(model);
      scene.add(model);

    }
  );


  var spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set(  4,  4,  4 );
  spotLight.intensity = 1;
  spotLight.penumbra = 1.2;
  scene.add( spotLight );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100 );
  camera.position.set( 4,  1,  4);
  camera.rotation.set(-0.2,0.8,0.2);



}
console.log('function 1');


var animate = function () {

  document.addEventListener( 'mouseup', onDocumentMouseUp, false )


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
  renderer.capabilities.getMaxAnisotropy()
  renderer.gammaFactor = 2;
  renderer.gammaOutput = true;

}


function onDocumentMouseUp( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children, true );
  raycaster.linePrecision = 1;
  if ( intersects.length > 0 ) {

    var object = intersects[ 0 ].object;
    console.log('intersecting with', object)
    if (object.name == 'Cube.009_2' || object.name == 'Cube.009_0') {
      chairAction.stop();
      chairAction.play();

    } else if (object.name == 'Cert02') {
      certAction.stop();
      certAction.play();
      certAction.clampWhenFinished = true;

    }  else if (object.name == 'Box_lid02' || object.name == 'Box02') {
      boxlidAction.stop();
      boxlidAction.play();
      boxlidAction.clampWhenFinished = true;

    } else if (object.name == 'Plane.000_2' || object.name == 'Plane.000_0' ) {
      bookAction.stop();
      bookAction.play();

    } else if (object.name == 'Box01') {
      boxAction.stop();
      boxAction.play();

    }else if (object.name == 'Cube.006_1' || object.name == 'Cube.006_3') {
      shelfAction.stop();
      shelfAction.play();

    } else if (object.name == 'Cylinder.001_0') {
      doorAction.stop();
      doorAction.play();

    }

    if (mixer) {
      console.log(object.uuid, mixer.getRoot())
    }


    if ( INTERSECTED !== object ) {


      INTERSECTED = object;

    }
  } else if ( INTERSECTED ) {


    INTERSECTED = null;
  }


}
