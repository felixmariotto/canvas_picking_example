
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import modelURL from './model.glb';
import textureURL from './texture.png';

//

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x999999 );
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild( renderer.domElement );

camera.position.z = 5;
const controls = new OrbitControls( camera, renderer.domElement );

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
const light = new THREE.AmbientLight( 0x404040 );
scene.add( light, directionalLight );

const raycaster = new THREE.Raycaster();
const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

//

let obj;

gltfLoader.load( modelURL, (glb) => {
	obj = glb.scene;
	scene.add( obj );
});

textureLoader.load( textureURL, (texture) => {

	const mouse = new THREE.Vector2();
	const img = texture.image;

	// make canvas for later pixel value query

	const textureCanvas = document.createElement('canvas');
	textureCanvas.width = img.width;
	textureCanvas.height = img.height;
	textureCanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

	// add global listener for click event, will check intersection here

	window.addEventListener( 'click', (event) => {

		// check intersections with imported model

		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		raycaster.setFromCamera( mouse, camera );

		const intersects = raycaster.intersectObject( obj, true );

		// if there is any intersection, continue

		if ( intersects.length ) {

			// get pixel coordinates on texture

			const uv = intersects[0].uv;
			uv.x *= img.width;
			uv.y *= img.height;

			// get pixel value

			const colorValues = textureCanvas.getContext('2d').getImageData( uv.x, uv.y, 1, 1).data;

			switch( colorValues[0] ) {

			case 255 :
				console.log('selected top part');
				break

			case 150 :
				console.log('selected middle part');
				break

			case 50 :
				console.log('selected lower part');
				break

			default :
				console.log('selection failed');
				break

			}

		}

	})

});

//

const animate = function () {

	requestAnimationFrame( animate );

	controls.update();

	renderer.render( scene, camera );
};

animate();