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

import {GrSphere, GrCube, GrCylinder} from "../libs/CS559-Framework/SimpleObjects.js";

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas });

// Begin Example Solution
// set a constant to pick which texture to use
// this is the path to the set of 6 images, missing the "_Front.png" part
const envTextureBase = "Textures/HDRIHeaven/rooituo";

/**
 * Read in a set of textures from HDRI Heaven, as converted by 
 * https://www.360toolkit.co/convert-spherical-equirectangular-to-cubemap
 * 
 * this uses a specific naming convention, and seems to (usually) swap bottom and front,
 * so I provide to undo this
 * 
 * @param {string} name 
 * @param {string} [ext="png"]
 * @param {boolean} [swapBottomFront=true]
 */
function cubeTextureHelp(name, ext = "png", swapBottomFront = true) {
  return new T.CubeTextureLoader().load([
    name + "_Right." + ext,
    name + "_Left." + ext,
    name + "_Top." + ext,
    name + (swapBottomFront ? "_Front." : "_Bottom.") + ext,
    name + "_Back." + ext,
    name + (swapBottomFront ? "_Bottom." : "_Front.") + ext
  ]);
}

export class ShinySculpture extends GrObject {
  /**
   * 
   * @param {GrWorld} world 
   */
  constructor(world, radius = 1) {
    let group = new T.Group();
    super("ShinySculpture", group);

    this.world = world;
    // note that we set the near distance of the camera just a little bit outside
    // of the sphere as a way to avoid feedback
    const cubeRenderTarget = new T.WebGLCubeRenderTarget( 128, { generateMipmaps: true, minFilter: T.LinearMipmapLinearFilter } );
    this.cubecam = new T.CubeCamera(radius * 1.1, 1000, cubeRenderTarget);
    this.sculptureGeom = new T.SphereBufferGeometry(radius, 20, 10);
    this.sculptureMaterial = new T.MeshStandardMaterial(
      {
        color: "white",
        roughness: 0.2,
        metalness: .8,
        // @ts-ignore   // envMap has the wrong type
        envMap: this.cubecam.renderTarget.texture
      });
    this.sculpture = new T.Mesh(this.sculptureGeom, this.sculptureMaterial);
    group.add(this.cubecam);
    group.add(this.sculpture);

    group.translateY(2);
  }

  stepWorld(delta, timeOfDay) {
    this.cubecam.update(this.world.renderer, this.world.scene);
  }
}

let cubeTexture = cubeTextureHelp(envTextureBase)
world.scene.background = cubeTexture;

let mat = new T.MeshStandardMaterial({ envMap: cubeTexture, metalness: .8, roughness: 0.1 });

// some solid color things to look at
world.add(new GrCylinder({ x: -4, z: -4, y: 2.5, radius: .4, height: 5, color: "red" }));
world.add(new GrCylinder({ x: -4, z: 4, y: 2.5, radius: .4, height: 5, color: "purple" }));
world.add(new GrCylinder({ x: 4, z: 4, y: 2.5, radius: .4, height: 5, color: "yellow" }));
world.add(new GrCylinder({ x: -4, z: 0, y: 2.5, radius: .4, height: 5, color: "orange" }));
world.add(new GrCylinder({ x: 4, z: 0, y: 2.5, radius: .4, height: 5, color: "blue" }));
world.add(new GrCylinder({ x: 4, z: -4, y: 2.5, radius: .4, height: 5 }));

let s1 = new ShinySculpture(world);
world.add(s1);

let s2 = new ShinySculpture(world, 0.5);
world.add(s2);
s2.setPos(2, .5, 0);
let s2t = 0;

// when we over-write tick to make this object move, make sure we still call the old
// tick function that updates the map
s2.oldStepWorld = s2.stepWorld;
s2.stepWorld = function (delta) {
  s2t += delta;
  s2.setPos(3 * Math.cos(s2t / 1000), .5, 3 * Math.sin(s2t / 1000));
  s2.oldStepWorld(delta);
}

// a moving thing
let cube2 = new GrCube({ x: 0, y: .5, z: 2, color: "blue" });
world.add(cube2);
let cb2t = 0;
cube2.stepWorld = function (delta) { cb2t += delta; cube2.objects[0].position.x = 3 * Math.sin(cb2t / 500); }
// End Example Solution

world.go();

