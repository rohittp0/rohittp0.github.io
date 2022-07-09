import "./styles.css";

import * as THREE from "three";

import {camera, scene, renderer, init} from "./world.js";

init();

const menus = ["skills", "experiences", "education"];

function createNavigationCubes() {
    const loader = new THREE.CubeTextureLoader();
    loader.setPath( 'textures/cube/' );

    return menus.map((menu) =>
    {
        const textureCube = loader.load( Array(6).fill(`${menu}.png`));
        const material =  new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
        const mesh =  new THREE.Mesh( new THREE.BoxGeometry( 20, 20, 20 ), material );

        mesh.name = menu;

        return mesh;
    });
}


createNavigationCubes().forEach((cube) => scene.add(cube));
