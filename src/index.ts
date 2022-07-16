import "./styles.css";

import * as THREE from "three";

import {camera, scene, renderer, init} from "./world.js";

const menus = ["skills", "experiences", "education"];

function createNavigationCubes() {
    return menus.map((menu, i) =>
    {
        const material = Array(6).fill(`textures/cube/${menu}.png`)
            .map((img) => new THREE.MeshBasicMaterial( { map: new THREE.TextureLoader().load( img ) } ));

        const box = new THREE.BoxGeometry( 100, 100, 100 );
        const mesh =  new THREE.Mesh( box, material );

        mesh.name = menu;
        const x = 700*Math.round(i-menus.length/2);
        const z = 700*Math.round(i-menus.length/2)
        mesh.position.set(x, 150, z);

        return mesh;
    });
}

renderer.domElement.addEventListener('click', function(event){
    const bounds = renderer.domElement.getBoundingClientRect();
    const rayCaster = new THREE.Raycaster();


    const mouse = {x: 0, y: 0};

    mouse.x = ( (event.clientX - bounds.left) / renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( (event.clientY - bounds.top) / renderer.domElement.clientHeight ) * 2 + 1;

    rayCaster.setFromCamera( mouse, camera );
    const intersects = rayCaster.intersectObjects(scene.children, true)
        .filter((int) => menus.includes(int.object.name));

    if (intersects.length > 0) {
        clicked(intersects[0].object);
    }
}, false)

function clicked(object){
    window.location.href = `pages#${object.name}`;
}

function render() {
    requestAnimationFrame( render );

    cubes.forEach((cube) => {
        cube.rotateX(0.001);
        cube.rotateY(0.001);
        cube.rotateZ(0.001);
    });

    renderer.render(scene, camera);
}

init();

const cubes = createNavigationCubes();

cubes.forEach((cube) => scene.add(cube));

render();
