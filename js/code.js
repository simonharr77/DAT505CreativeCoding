var action;
var INTERSECTED;
var clock;
var scene;
var camera;
var raycaster;
var mouse;
var renderer;
var mixer;


function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function init() {
	clock = new THREE.Clock();
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
 	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	renderer.setClearColor(0x606060);

	animationGroup = new THREE.Object3D();

	var loader = new THREE.GLTFLoader();
	loader.load(
		'models/gltf/untitled.glb',
		function ( gltf ) {
		  var model = gltf.scene;
		  // scene.add(model);
		  mixer = new THREE.AnimationMixer(model);
		  action = mixer.clipAction(gltf.animations[0]);
		  action.setLoop( THREE.LoopOnce );

		  gltf.scene.position.set(0, -1, 0);
			animationGroup.add(model);
			scene.add(model);
		}
	);
 	var loader = new THREE.GLTFLoader();
  loader.load(
		'models/gltf/untitled.glb',
		function ( gltf ) {
			var model = gltf.scene;
			// scene.add(model);
			mixer = new THREE.AnimationMixer(model);
			action = mixer.clipAction(gltf.animations[0]);
			action.setLoop( THREE.LoopOnce );

			gltf.scene.position.set(4, -1, 0);
			animationGroup.add(model);
			scene.add(model);
		},
	);

	var box = new THREE.BoxGeometry(1, 1, 1)
	var material = new THREE.MeshBasicMaterial({ color: 'blue'})
	var mesh = new THREE.Mesh(box, material)
	scene.add(mesh)
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false )

	//LIGHT
	var ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
	scene.add(ambientLight);
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(0,2,4);
	light.castShadow = true;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);

	camera.position.z = 5;
	camera.position.set( 0, 0, 5 );

	var controls = new THREE.OrbitControls( camera );
	controls.update();
}


function onDocumentMouseDown( event ) {
	event.preventDefault();
	// mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	// mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	// raycaster.setFromCamera(mouse, camera);
	// var intersects = raycaster.intersectObjects(animationGroup.children);

  if ( action !== null ) {
		console.log({INTERSECTED})
    action.stop();
    action.play();
  }
}

console.log('function 1');

var animate = function () {
	// var intersects = raycaster.intersectObjects(animationGroup.children);
	raycaster.setFromCamera( mouse, camera );
	var intersects = raycaster.intersectObjects( scene.children );
	if ( intersects.length > 0 ) {
		console.log({ intersects })
		var object = intersects[ 0 ].object;
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

  requestAnimationFrame( animate );

  var delta = clock.getDelta();

  if (mixer !== null) {
    mixer.update(delta);
  };

  renderer.render( scene, camera );
};

window.onload = function () {
	init();
	animate();
}
