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
let world = new GrWorld({ where: parentOfCanvas, groundplane: false, lookfrom: new T.Vector3(0, 0, -100), far: 20000 });

// Begin Example Solution
class Skybox extends GrObject {
    constructor(params = {}) {
        let geometry = new T.SphereBufferGeometry(10000, 100, 100);
        let loader = new T.TextureLoader();
        let texture = loader.load("Textures/sky.jpg");
        let material = new T.MeshPhongMaterial({ map: texture, side: T.BackSide, flatShading: true });
        let mesh = new T.Mesh(geometry, material);
        super("Skybox", mesh);
    }
}

class Rock extends GrObject {
    constructor(params = {}) {
        let geometry = new T.SphereBufferGeometry(1, 100, 100);
        let loader = new T.TextureLoader();
        let texture = loader.load("Textures/Rock/bc.jpg");
        let normal = loader.load("Textures/Rock/nl.jpg");
        let height = loader.load("Textures/Rock/ht.png");
        let ambient = loader.load("Textures/Rock/ao.jpg");
        let rough = loader.load("Textures/Rock/rg.jpg");
        let material = new T.MeshStandardMaterial({ map: texture, side: T.DoubleSide, normalMap: normal, displacementMap: height, aoMap: ambient, roughnessMap: rough });
        let mesh = new T.Mesh(geometry, material);
        let size = params.size || 1;
        mesh.scale.set(size, size, size);
        super("Rock", mesh);
    }
}

world.orbit_controls.maxDistance = 50;

let box1 = new Skybox();
world.add(box1);

let rock1 = new Rock({ size: 5 });
world.add(rock1);
// End Example Solution

world.go();

