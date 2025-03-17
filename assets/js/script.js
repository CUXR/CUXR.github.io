import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

let mesh, line;

const loader = new STLLoader();
				loader.load( 'assets/js/bear_final.stl', function ( geometry ) {

					// const material = new THREE.MeshPhongMaterial( { color: 0xff9c7c, specular: 0xff9c7c, shininess: 0 } );
                    const material = new THREE.MeshPhongMaterial({
                        color: "black",
                        reflectivity: 0.8,
                        shininess: 0.5,
                        polygonOffset: true,
                        polygonOffsetFactor: 3, // positive value pushes polygon further away
                        polygonOffsetUnits: 1
                    });

					mesh = new THREE.Mesh( geometry, material );

                    var center = new THREE.Vector3();
                    mesh.geometry.computeBoundingBox();
                    mesh.geometry.boundingBox.getCenter(center);
                    mesh.geometry.center();
                    mesh.position.copy(center);

					mesh.position.set( 0, 0, 0 );
					mesh.rotation.set( -1.6, 0, 0 );
					mesh.scale.set( 0.025, 0.025, 0.025 );


                    var ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
                    scene.add(ambientLight);

                    var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
                    directionalLight.position.set(0, 1, 1).normalize();
                    scene.add(directionalLight);

                    let wireframe = new THREE.WireframeGeometry( geometry );

                    const lineMaterial = new THREE.MeshPhongMaterial({
                        color: 0xB31B1B,
                        emissive: new THREE.Color(1, 0.2, 0.2), // Bright red glow
                        emissiveIntensity: 0.5,
                        toneMapped: false // Ensures bloom effect works properly
                    });
                    
                    line = new THREE.LineSegments(wireframe, lineMaterial);

                    line.material.color.setHex(0xB31B1B);

                    line.renderOrder = 1;

                    line.position.set( 0, 0, 0 );
					line.rotation.set( -1.6, 0, 0 );
					line.scale.set( 0.025, 0.025, 0.025 );


					mesh.castShadow = true;
					mesh.receiveShadow = true;

					scene.add( mesh );
                    scene.add(line);


				} );

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, window.innerHeight / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
	powerPreference: "high-performance",
	antialias: false,
	stencil: false,
	depth: false,
});renderer.setClearColor( 0xffffff, 0);

// Attach renderer to the right container
const container = document.querySelector('.threejs-container');
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Bloom setup
const bloomComposer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
bloomComposer.addPass(renderPass);

const bloomParams = {
    strength: 4.5,
    radius: 0.05,
    threshold: 0.1
};
const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    bloomParams.strength,
    bloomParams.radius,
    bloomParams.threshold
);
bloomComposer.addPass(bloomPass);

// Position the camera
camera.position.z = 5;

// Animation loop
function animate() {
    if(line) {
    line.rotation.z += 0.01;
    // if(line.position.y < 0.1){
    //     line.position.y += 0.005;
    // }
    // else {
    //     line.position.y -= 0.005;
    // }
    }

    if(mesh) {
    mesh.rotation.z += 0.01;
    // if(mesh.position.y < 0.5){
    //     mesh.position.y += 0.005;
    // }
    // else {
    //     mesh.position.y -= 0.005;
    // }
    }

    requestAnimationFrame(animate);
    bloomComposer.render();
}

animate();

// // Handle resizing
// window.addEventListener('resize', () => {
//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize(window.innerWidth, window.innerHeight);
    
//     bloomComposer.setSize(window.innerWidth, window.innerHeight);
// });


