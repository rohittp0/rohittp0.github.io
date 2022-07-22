import "./styles.css";

import * as THREE from "three";
import {TrackballControls} from "./jsm/controls/TrackballControls.js";
import {CSS3DRenderer, CSS3DObject} from "./jsm/renderers/CSS3DRenderer.js";

let camera, scene, renderer;
let controls;

function Element( src, x, y, z, ry ) {
    const div = document.createElement( "div" );
    div.style.width = "480px";
    div.style.height = "360px";
    div.style.backgroundColor = "#000";
    const iframe = document.createElement( "iframe" );
    iframe.style.width = "480px";
    iframe.style.height = "360px";
    iframe.style.border = "0px";
    iframe.src = "https://"+ src;
    div.appendChild( iframe );
    const object = new CSS3DObject( div );
    // @ts-ignore
    object.position.set( x, y, z );
    // @ts-ignore
    object.rotation.y = ry;
    return object;
}

function init() {
    const container = document.getElementById( "container" );
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
    camera.position.set( 500, 350, 750 );
    scene = new THREE.Scene();
    renderer = new CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = 0;
    container.appendChild( renderer.domElement );

    const group = new THREE.Group();
    group.add(Element( "rohittp.com/pages", 0, 0, 240, 0 ) );
    group.add(Element( "rohit.cusat.me/github", 240, 0, 0, Math.PI / 2 ) );
    group.add(Element( "rohit.cusat.me/stackoverflow", 0, 0, - 240, Math.PI ) );
    group.add(Element( "trebuchet.one", - 240, 0, 0, - Math.PI / 2 ) );
    scene.add( group );
    controls = new TrackballControls( camera, container );
    controls.rotateSpeed = 4;
    window.addEventListener( "resize", onWindowResize, false );

    // Block iframe events when dragging camera
    const blocker = document.getElementById( "blocker" );
    blocker.style.display = "none";
    document.addEventListener( "mousedown", function () { blocker.style.display = ""; } );
    document.addEventListener( "mouseup", function () { blocker.style.display = "none"; } );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}

init();
animate();
