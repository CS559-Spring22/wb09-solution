/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

/*jshint esversion: 6 */
// @ts-check

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas });

// Begin Example Solution
const s2 = Math.sqrt(2) / 2;

let check = new T.TextureLoader().load("Textures/4x4.png");
let checkbw = new T.TextureLoader().load("Textures/4x4bw.png");
class MySphere extends GrObject {
    constructor(params) {
        let geom = new T.SphereBufferGeometry(1);
        let matprops = {};

        if (params.color)
            matprops.color = params.color;
        if (params.map)
            matprops.map = check;
        if (params.rough) {
            matprops.roughnessMap = checkbw;
            matprops.roughness = 1;
            matprops.metalness = .5;
        }
        if (params.metal) {
            matprops.metalness = 1;
            matprops.metalnessMap = checkbw;
            matprops.roughness = 0.5;
        }

        let mat = new T.MeshStandardMaterial(matprops);
        let mesh = new T.Mesh(geom, mat);
        mesh.translateX(params.x || 0.0);
        mesh.translateY(params.y || 0.0);
        mesh.translateZ(params.z || 0.0);
        super("Sphere", mesh);
    }
}

let mydiv = document.getElementById("texture-triangle");

let box = InputHelpers.makeBoxDiv({ width: (mydiv ? 640 : 820) }, mydiv);
if (!mydiv) {
    InputHelpers.makeBreak();   // sticks a break after the box
}
InputHelpers.makeHead("Texture Test", box);

let objs = [];

objs.push(new MySphere({ x: -3, rough: true, color: "#FF8040" }));
objs.push(new MySphere({ x: 0, metal: true, color: "#FF8060" }));
objs.push(new MySphere({ x: 3, map: true, metal: true }));

objs.forEach(e => world.add(e));

let div = InputHelpers.makeBoxDiv({}, box);

let sl = new InputHelpers.LabelSlider("ry", { min: -2, max: 2, where: div });
sl.oninput = function (evt) {
    let v = sl.value();
    objs.forEach(element => {
        element.objects[0].rotation.y = v;
    });
};

let t1 = new T.TextureLoader().load("Textures/UV_Grid_Sm.jpg");
let m1 = new T.MeshBasicMaterial({ map: t1, side: T.DoubleSide });
let p1 = new T.PlaneGeometry(1, 1, 1, 1);
let g1 = new T.Mesh(p1, m1);
g1.translateY(3);
world.scene.add(g1);

world.ambient.intensity = 0.6;
// End Example Solution

world.go();