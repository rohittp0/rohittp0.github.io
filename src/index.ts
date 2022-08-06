import "./styles.css";

import * as THREE from "three";
import {TrackballControls} from "./jsm/controls/TrackballControls.js";
import {CSS3DRenderer, CSS3DObject} from "./jsm/renderers/CSS3DRenderer.js";
import {EditorView, keymap} from "@codemirror/view"
import {indentWithTab} from "@codemirror/commands"
import {javascript} from "@codemirror/lang-javascript";
import {basicSetup} from "codemirror";

const welcomeText = `console.log(${"`"}Ever wanted to collaborate on a project? Here is a weird way to do it.
    Add your code here and I will remember to run it every time you visit this page.${"`"});`;

let camera, scene, renderer;
let controls;
let updated = false;

function Element(src, x, y, z, ry) {
    const div = document.createElement("div");
    div.style.width = "480px";
    div.style.height = "360px";
    div.style.backgroundColor = "#000";
    const iframe = document.createElement("iframe");
    iframe.style.width = "480px";
    iframe.style.height = "360px";
    iframe.style.border = "0px";
    iframe.src = "https://" + src;

    iframe.setAttribute("sandbox", "allow-same-origin allow-scripts allow-popups allow-forms");
    div.appendChild( iframe );

    const object = new CSS3DObject(div);
    // @ts-ignore
    object.position.set(x, y, z);
    // @ts-ignore
    object.rotation.y = ry;
    return object;
}

function init() {
    const container = document.getElementById("container");
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(500, 350, 750);
    scene = new THREE.Scene();
    renderer = new CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = 0;
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.add(Element("rohittp.com/pages", 0, 0, 240, 0));
    group.add(Element("rohit.cusat.me/github", 240, 0, 0, Math.PI / 2));
    group.add(Element("rohit.cusat.me/stackoverflow", 0, 0, -240, Math.PI));
    group.add(Element("trebuchet.one", -240, 0, 0, -Math.PI / 2));
    scene.add(group);
    controls = new TrackballControls(camera, container);
    controls.rotateSpeed = 4;
    window.addEventListener("resize", onWindowResize, false);

    // Block iframe events when dragging camera
    const blocker = document.getElementById("blocker");
    blocker.style.display = "none";
    document.addEventListener("mousedown", function () {
        blocker.style.display = "";
    });
    document.addEventListener("mouseup", function () {
        blocker.style.display = "none";
    });

    container.children[0].setAttribute("style", "");
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();
animate();

function updateDOM() {
    if (updated)
        return;

    try {
        eval(localStorage.getItem("code"));
    }
    catch (e)
    {
        console.error(e);
    }
    updated = true;
}

const change = EditorView.domEventHandlers({
    "keyup": (e, view) => {
        const code = view.state.doc.toJSON().join("\n").trim();
        if (code !== localStorage.getItem("code")) {
            localStorage.setItem("code", code);
            updated = false;
            setTimeout(updateDOM, 1000);
        }

        return true;
    }
});

if(!localStorage.getItem("code"))
    localStorage.setItem("code", welcomeText);

new EditorView({
    doc: localStorage.getItem("code"),
    extensions: [
        basicSetup,
        javascript(),
        keymap.of([indentWithTab]),
        change
    ],
    parent: document.getElementById("code")
})


updateDOM();
