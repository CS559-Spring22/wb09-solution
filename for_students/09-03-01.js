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

import * as SimpleObjects from "../libs/CS559-Framework/SimpleObjects.js";

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas });

// Begin Example Solution
let check = new T.TextureLoader().load("Textures/paintBump.png");
let bumps = new T.TextureLoader().load("Textures/dots-bump.png");
bumps.wrapS = T.MirroredRepeatWrapping;
bumps.wrapT = T.MirroredRepeatWrapping;

let spinYspeed = .25;
/**
 * speed is a global variable...
 * 
 * @param {GrObject} obj 
 */
function spinY(obj) {
    obj.stepWorld = function (delta, timeOfDay) {
        obj.objects.forEach(obj => obj.rotateY(spinYspeed * delta / 1000 * Math.PI));
    };
    return obj;
}

function setYrot(obj, theta) {
    obj.objects.forEach(ob => ob.rotation.y = (theta * Math.PI / 180));
}

let mydiv;

let box = InputHelpers.makeBoxDiv({ width: (mydiv ? 640 : 820) }, mydiv);
if (!mydiv) {
    InputHelpers.makeBreak();   // sticks a break after the box
}
InputHelpers.makeHead("Bump Map Test / Normal Map Test", box);

let shaderMat = new T.MeshStandardMaterial({ color: "white", bumpMap: check, side: T.DoubleSide });

let sph = spinY(new SimpleObjects.GrSphere({ x: -2, y: 1, z: 2, material: shaderMat }));
let sqh = spinY(new SimpleObjects.GrSquareSign({ x: 2, y: 1, z: 2, size: 1, material: shaderMat }));
world.add(sph);
world.add(sqh);

let normalMap = new T.TextureLoader().load("Textures/pixl_r_normal.png");

let shaderMat1 = new T.MeshStandardMaterial({ color: "white", normalMap: normalMap, side: T.DoubleSide });

let sph1 = spinY(new SimpleObjects.GrSphere({ x: -2, y: 1, z: -1, material: shaderMat1 }));
let sqh1 = spinY(spinY(new SimpleObjects.GrSquareSign({ x: 2, y: 1, z: -1, size: 1, material: shaderMat1 })));

world.add(sph1);
world.add(sqh1);

let cb = InputHelpers.makeCheckbox("Spin");
cb.checked = true;
cb.onchange = function () {
    spinYspeed = cb.checked ? .25 : 0;
}

let cb2 = InputHelpers.makeCheckbox("Bumps");
cb2.onchange = function () {
    shaderMat.bumpMap = cb2.checked ? bumps : check;
    shaderMat.needsUpdate = true;
}

let s2 = new InputHelpers.LabelSlider("bumprepeat", { min: 1, max: 5, step: .1, where: undefined });
s2.oninput = function () {
    bumps.repeat.set(s2.value(), s2.value());
};
// End Example Solution

world.go();

