import * as THREE from "https://unpkg.com/three@0.179.1/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.179.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.179.1/examples/jsm/loaders/GLTFLoader.js";

const loading=document.getElementById("loading");

// --------------------------------------------------
// URL
// ?https://...modell.glb
// --------------------------------------------------

const modelUrl=decodeURIComponent(window.location.search.substring(1));

if(!modelUrl){

    loading.innerHTML="Keine Modell-URL angegeben.";

    throw new Error("Keine Modell URL");

}

// --------------------------------------------------

const scene=new THREE.Scene();
scene.background=new THREE.Color(0xf2f2f2);

// --------------------------------------------------

const camera=new THREE.PerspectiveCamera(

45,
window.innerWidth/window.innerHeight,
0.01,
1000

);

// --------------------------------------------------

const renderer=new THREE.WebGLRenderer({

antialias:true

});

renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth,window.innerHeight);

document.body.appendChild(renderer.domElement);

// --------------------------------------------------

const controls=new OrbitControls(camera,renderer.domElement);

controls.enableDamping=true;

// --------------------------------------------------

scene.add(new THREE.HemisphereLight(0xffffff,0x888888,2));

const light=new THREE.DirectionalLight(0xffffff,3);

light.position.set(5,10,5);

scene.add(light);

// --------------------------------------------------

const loader=new GLTFLoader();

loader.load(

modelUrl,

(gltf)=>{

    const model=gltf.scene;

    scene.add(model);

    // -------------------------

    const box=new THREE.Box3().setFromObject(model);

    const size=box.getSize(new THREE.Vector3());

    const center=box.getCenter(new THREE.Vector3());

    model.position.x-=center.x;
    model.position.y-=center.y;
    model.position.z-=center.z;

    const max=Math.max(size.x,size.y,size.z);

    camera.position.set(0,max*0.5,max*2.2);

    camera.lookAt(0,0,0);

    controls.target.set(0,0,0);

    controls.update();

    loading.innerHTML="Modell geladen";

},

(xhr)=>{

    loading.innerHTML=
    "Lade "+Math.round(xhr.loaded/xhr.total*100)+"%";

},

(err)=>{

    console.error(err);

    loading.innerHTML="Fehler beim Laden.";

}

);

// --------------------------------------------------

window.addEventListener("resize",()=>{

camera.aspect=window.innerWidth/window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(window.innerWidth,window.innerHeight);

});

// --------------------------------------------------

function animate(){

requestAnimationFrame(animate);

controls.update();

renderer.render(scene,camera);

}

animate();
