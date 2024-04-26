import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { loadModelGLTF } from "./loadModel.js";

const canvas = document.querySelector("#canvas");
const sound = new Audio("./assets/audio/melody.mp3");
const logoButton = document.querySelector("#logo");
let camera, scene, renderer, controls;
let mouse = new THREE.Vector2();
let model1, model2;
let scrollTop;

let isSoundPlay = false;


logoButton.addEventListener("click", (e) => {

    if (!isSoundPlay) {
        isSoundPlay = true;
        sound.play();
    } else {
        isSoundPlay = false;
        sound.currentTime = 0;
        sound.pause();
    }


});

const scaleValue = (value, minInput, maxInput, minOutput, maxOutput) => {
    return minOutput + (maxOutput - minOutput) * ((value - minInput) / (maxInput - minInput));
}

const onWindowResize = () => {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    // Define diferentes posiciones de la cámara según el ancho de la ventana
    let cameraPosition;
    if (width >= 768) {
        cameraPosition = new THREE.Vector3(0, 5, 12);
        console.log(">768")
    } else if (width >= 500) {
        cameraPosition = new THREE.Vector3(0, 5, 12);
        console.log(">500")
    } else {
        console.log("<500")
        cameraPosition = new THREE.Vector3(0, 5, 12);
    }

    camera.position.copy(cameraPosition);
    console.log("RESIZING", width)

};

const onMouseMove = (e) => {
    mouseOnScreen = true;
    e.preventDefault();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1
}



const onScroll = (e) => {




    scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const carModelScaled = scaleValue(scrollTop, 0, maxScroll, 0, 3);
    const carModelScaled2 = scaleValue(scrollTop, 0, maxScroll, 0, -7);
    const carModelScaled3 = scaleValue(scrollTop, 0, maxScroll, 0, -2.5);
    const buildingPosition = scaleValue(scrollTop, 0, maxScroll, 0, 2.5);
    if (model1) {
        //model1.rotation.y += 0.005;

        gsap.to(model1.rotation, { duration: 0.5, y: carModelScaled, ease: "linear" });
        gsap.to(model1.position, { duration: 0.5, x: carModelScaled3, z: carModelScaled2, ease: "linear" });
    }

    if (model2) {
        gsap.to(model2.position, { duration: 0.5, z: buildingPosition, ease: "linear" });
    }
}


const init = async () => {
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onWindowResize);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);


    scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(0, 0, 100);
    //directionalLight.position.set(0, 8, 8);
    directionalLight.lookAt(0, 0, 0);
    scene.add(directionalLight);

    const ambientlight = new THREE.AmbientLight(0xffffff, 3);
    ambientlight.position.set(0, 0, 0);
    scene.add(ambientlight);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.appendChild(renderer.domElement);


    //LOAD 3D MODELS
    await loadModelGLTF("clouds").then((resolve) => {
        console.log(resolve);
        model1 = resolve;
        return loadModelGLTF("cartoon_building");
    }).then((resolve) => {
        model2 = resolve;
    })

    //ADD MODELS TO SCENE
    const roadScale = 0.002;
    model2.scale.set(roadScale, roadScale, roadScale);
    model2.rotation.set(-0.8, 0, 0);
    model2.position.set(0, -11, 0);
    scene.add(model2);

    const cloudsScale = 0.8;
    model1.scale.set(cloudsScale, cloudsScale, cloudsScale);
    model1.rotation.set(0, 0, 0);
    model1.position.set(0, 0, 0);
    scene.add(model1);



};

const render = () => {
    renderer.render(scene, camera);

};

const animate = () => {
    requestAnimationFrame(animate);






    render();
};

init();
animate();

