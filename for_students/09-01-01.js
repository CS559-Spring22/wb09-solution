/**
 * CS559 Spring 2022 Example Solution
 * Written by CS559 course staff
 */

import * as T from "../libs/CS559-Three/build/three.module.js";
import { GrWorld } from "../libs/CS559-Framework/GrWorld.js";
import { GrObject } from "../libs/CS559-Framework/GrObject.js";
import * as InputHelpers from "../libs/CS559/inputHelpers.js";
import * as Geom from "../libs/CS559-Three/examples/jsm/deprecated/Geometry.js";

// define a class of Dice here - it should be a subclass of GrObject

// Begin Example Solution
/** @type {string} */ const imageFolder = "../images/";
/** @type {T.TextureLoader} */ const textureLoader = new T.TextureLoader();
/** @type {T.Texture} */ const texture = textureLoader.load(imageFolder + "dice_texture.png");
/** @type {T.MeshPhongMaterial} */ const white = new T.MeshPhongMaterial({ color: "white" });
/** @type {T.MeshPhongMaterial} */ const material = new T.MeshPhongMaterial({ color: "white", map: texture });
/** @type {T.SphereBufferGeometry} */ const sphere = new T.SphereBufferGeometry(1, 20, 20);
/** @type {T.CylinderBufferGeometry} */ const cylinder = new T.CylinderBufferGeometry(1, 1, 1, 20, 20);
/** @type {number} */ let diceCount = 0;
export class GrDice extends GrObject {
    constructor(params = {}) {
        /** @type {T.Group} */ const dice = new T.Group();
        super(`GrDice${++diceCount}`, dice);
        // Copy all the parameters with defaults
        /** @type {number} */ const x = params.x || 0; // Position x
        /** @type {number} */ const y = params.y || 0; // Position y
        /** @type {number} */ const z = params.z || 0; // Position z
        /** @type {number} */ const s = params.s || 1; // Scale
        /** @type {number} */ const sx = params.sx || s; // Scale x
        /** @type {number} */ const sy = params.sy || s; // Scale y
        /** @type {number} */ const sz = params.sz || s; // Scale z
        /** @type {number} */ const rx = params.rx || 0; // Rotation x
        /** @type {number} */ const ry = params.ry || 0; // Rotation y
        /** @type {number} */ const rz = params.rz || 0; // Rotation z
        /** @type {number} */ const offset = params.offset || 0; // Rounded edge
        /** @type {number[]} */ const index = params.index || [1, 6, 3, 4, 5, 2]; // Numbers on the face
        // Create the vertex and uv list
        // The order is left, right, top, bottom, front, back
        /** @type {number[][]} */ const faces = [
            [1 + offset, 1, 1, 1 + offset, -1, 1, 1 + offset, -1, -1, 1 + offset, 1, -1],
            [-1 - offset, 1, 1, -1 - offset, -1, 1, -1 - offset, -1, -1, -1 - offset, 1, -1],
            [1, 1 + offset, 1, 1, 1 + offset, -1, -1, 1 + offset, -1, -1, 1 + offset, 1],
            [1, -1 - offset, 1, 1, -1 - offset, -1, -1, -1 - offset, -1, -1, -1 - offset, 1],
            [1, 1, 1 + offset, -1, 1, 1 + offset, -1, -1, 1 + offset, 1, -1, 1 + offset],
            [1, 1, -1 - offset, -1, 1, -1 - offset, -1, -1, -1 - offset, 1, -1, -1 - offset]
        ];
        // Top left corner of the uv mapping for white space and the six numbers
        /** @type {number[][]} */ const corner = [[0, 0], [1 / 3, 1 / 3], [0, 1 / 3], [1 / 3, 0], [1 / 3, 2 / 3], [2 / 3, 1 / 3], [2 / 3, 0]];
        // The four corners of the uv mapping for white space and the six numbers
        /** @type {number[][]} */ const uvAll = corner.map(c => [c[0], c[1], c[0], c[1] + 1 / 3, c[0] + 1 / 3, c[1] + 1 / 3, c[0] + 1 / 3, c[1]]);
        // The uv mapping for the six faces
        /** @type {number[][]} */ const uv = index.map(i => uvAll[i]);
        // Generate all the faces
        for (let i = 0; i < faces.length; i++) {
            /** @type {Geom.Geometry} */ const geometry = /** @type {Geom.Geometry} */(polygon(faces[i], i % 2 == 1, uv[i]));
            /** @type {T.BufferGeometry} */ const bg = geometry.toBufferGeometry();
            /** @type {T.Mesh} */ const face = new T.Mesh(bg, material);
            dice.add(face);
        }
        // Put everything into the group and transform the group
        dice.position.set(x, y, z);
        dice.scale.set(sx, sy, sz);
        dice.rotation.set(rx, ry, rz);
        // Optional: add the rounded edges (cylinder) and corners (spheres)
        if (offset) {
            /** @type {number[][]} */ const corners = [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]]
            corners.forEach(function (c) {
                // Add a corner at every corner
                /** @type {T.Mesh} */ const corner = new T.Mesh(sphere, white);
                corner.position.set(c[0], c[1], c[2]);
                corner.scale.set(offset, offset, offset);
                dice.add(corner);
                corners.forEach(function (cp) {
                    // Add an edge if only one of x, y, z is different
                    if (Math.abs(c[0] - cp[0]) + Math.abs(c[1] - cp[1]) + Math.abs(c[2] - cp[2]) == 2) {
                        /** @type {T.Mesh} */ const edge = new T.Mesh(cylinder, white);
                        edge.position.set(0.5 * (c[0] + cp[0]), 0.5 * (c[1] + cp[1]), 0.5 * (c[2] + cp[2]));
                        edge.scale.set(offset, 2, offset);
                        edge.rotation.set(Math.PI * 0.25 * (c[2] - cp[2]), Math.PI * 0.25 * (c[1] - cp[1]), Math.PI * 0.25 * (c[0] - cp[0]));
                        dice.add(edge);
                    }
                });
            });
        }
    }
}

/**
 * Draw a polygon shape with four vertices using THREE.Geometry
 * @param {number[]} vertexList The list of vertices
 * @param {Boolean} flip Whether to flip the face (look at the other side)
 * @param {number[]} uvList The list uvs
 * @returns {Geom.Geometry}
 */
export function polygon(vertexList = [], flip = false, uvList = [0, 0, 0, 1, 1, 1, 1, 0]) {
        // Set the vertices
        /** @type {Geom.Geometry} */ const geometry = new Geom.Geometry();
    for (let i = 0; i < 12; i += 3) geometry.vertices.push(new T.Vector3(...vertexList.slice(i, i + 3)));
        // Set the faces, flip means the texture is on the other side
        /** @type {Geom.Face3} */ const f1 = flip ? new Geom.Face3(0, 3, 2) : new Geom.Face3(0, 1, 2);
    geometry.faces.push(f1);
        /** @type {Geom.Face3} */ const f2 = flip ? new Geom.Face3(2, 1, 0) : new Geom.Face3(2, 3, 0);
    geometry.faces.push(f2);
    // Set the uvs
    geometry.faceVertexUvs = [[]];
    // The first triangle
    geometry.faceVertexUvs[0].push([
        new T.Vector2(uvList[0], uvList[1]),
        new T.Vector2(uvList[2], uvList[3]),
        new T.Vector2(uvList[4], uvList[5])
    ]);
    // The second triangle
    geometry.faceVertexUvs[0].push([
        new T.Vector2(uvList[4], uvList[5]),
        new T.Vector2(uvList[6], uvList[7]),
        new T.Vector2(uvList[0], uvList[1])
    ]);
    // Compute the normals
    geometry.computeFaceNormals();
    geometry.uvsNeedUpdate = true;
    return geometry;
}

/**
 * Draw a polygon shape with four vertices using THREE.BufferGeometry, *for future use only, not Spring 2021*
 * @param {number[]} vertexList The list of vertices
 * @param {Boolean} flip Whether to flip the face (look at the other side)
 * @param {number[]} uvList The list uvs
 * @returns {T.BufferGeometry}
 */
export function polygonBuffer(vertexList = [], flip = false, uvList = [0, 0, 1, 0, 1, 1, 0, 1]) {
    // Convert the lists to Float32Arrays
    /** @type {Float32Array} */ const vertices = new Float32Array(vertexList);
    /** @type {Float32Array} */ const uv = new Float32Array(uvList);
    /** @type {T.BufferGeometry} */ const geometry = new T.BufferGeometry();
    // Set the buffer attributes
    geometry.setAttribute("position", new T.BufferAttribute(vertices, 3));
    geometry.setAttribute("uv", new T.BufferAttribute(uv, 2));
    // Reverse the order of vertices to see the other side
    if (flip) geometry.setIndex([0, 3, 2, 2, 1, 0]);
    else geometry.setIndex([0, 1, 2, 2, 3, 0]);
    // Compute the normals
    geometry.computeVertexNormals();
    return geometry;
}

// This class uses Three's BoxGeometry, not recommended to use
// this class cannot work anymore due to version update of THREE.js, just left for history record
/** @type {T.BoxGeometry} */ const boxGeometry = new T.BoxGeometry();
/** @type {T.MeshPhongMaterial} */ const boxMaterial = new T.MeshPhongMaterial({ vertexColors: true, map: texture, side: T.DoubleSide });
/** @type {T.PlaneGeometry} */ const planeGeometry = new T.PlaneGeometry(2, 2, 3, 3);
export class GrBoxDice extends GrObject {
    constructor(params = {}) {
        /** @type {T.Group} */ const dice = new T.Group();
        super("GrBoxDice", dice);
        // Copy all the parameters with defaults
        /** @type {number} */ const x = params.x || 0; // Position x
        /** @type {number} */ const y = params.y || 0; // Position y
        /** @type {number} */ const z = params.z || 0; // Position z
        /** @type {number} */ const s = params.s || 1; // Scale
        /** @type {number} */ const sx = params.sx || s; // Scale x
        /** @type {number} */ const sy = params.sy || s; // Scale y
        /** @type {number} */ const sz = params.sz || s; // Scale z
        /** @type {number} */ const rx = params.rx || 0; // Rotation x
        /** @type {number} */ const ry = params.ry || 0; // Rotation y
        /** @type {number} */ const rz = params.rz || 0; // Rotation z
        /** @type {number} */ const offset = params.offset || 0; // Rounded edge
        /** @type {number[]} */ const index = params.index || [1, 2, 3, 4, 5, 6]; // Numbers on the face
        // Top left corner of the uv mapping for white space and the six numbers
        /** @type {number[][]} */ const corner = [[0, 0], [1 / 3, 1 / 3], [0, 1 / 3], [1 / 3, 0], [1 / 3, 2 / 3], [2 / 3, 1 / 3], [2 / 3, 0]];
        // The four corners of the uv mapping for white space and the six numbers
        /** @type {number[][]} */ const uvAll = corner.map(c => [c[0], c[1], c[0], c[1] + 1 / 3, c[0] + 1 / 3, c[1] + 1 / 3, c[0] + 1 / 3, c[1]]);
        // The uv mapping for the six faces
        /** @type {number[][]} */ const uv = index.map(i => uvAll[i]);
        /** @type {T.Mesh} */ const box = new T.Mesh(boxGeometry, boxMaterial);
        boxGeometry.faces.forEach(face => face.vertexColors = [new T.Color(), new T.Color(), new T.Color()]);
        // Put different colors on different faces: face i, vertex j get color HSL(i / 12, 0.5 * j, 0.5 * j)
        boxGeometry.faces.forEach((face, i) => face.vertexColors.forEach((vertex, j) => vertex.setHSL(i / 12, 0.5 + (j - 1) * 0.5, 0.5 + (j - 1) * 0.5)));
        uv.forEach(function (uvi, i) {
            // Set the face UVs
            boxGeometry.faceVertexUvs[0][2 * i][0].set(uvi[2], uvi[3]);
            boxGeometry.faceVertexUvs[0][2 * i][1].set(uvi[0], uvi[1]);
            boxGeometry.faceVertexUvs[0][2 * i][2].set(uvi[4], uvi[5]);
            boxGeometry.faceVertexUvs[0][2 * i + 1][0].set(uvi[0], uvi[1]);
            boxGeometry.faceVertexUvs[0][2 * i + 1][1].set(uvi[6], uvi[7]);
            boxGeometry.faceVertexUvs[0][2 * i + 1][2].set(uvi[4], uvi[5]);
        });
        /** @type {T.Mesh} */ const plane = new T.Mesh(planeGeometry, boxMaterial);
        // Index of the face given the triangle on the texture (18 triangles on the texture in total)
        /** @type {number[]} */ const inverseUV = [-1, -1, 6, 7, -1, -1, 2, 3, 0, 1, 8, 9, -1, -1, 4, 5, 10, 11];
        // Put different colors on different faces: face i, vertex j get color HSL(i / 12, 0.5 * j, 0.5 * j)
        planeGeometry.faces.forEach(face => face.vertexColors = [new T.Color(), new T.Color(), new T.Color()]);
        planeGeometry.faces.forEach(function (face, i) {
            // White triangles
            if (inverseUV[i] < 0) face.vertexColors.forEach(vertex => vertex.setStyle("white"));
            // Triangles with dots
            else face.vertexColors.forEach((vertex, j) => vertex.setHSL(inverseUV[i] / 12, 0.5 + (j - 1) * 0.5, 0.5 + (j - 1) * 0.5));
        });
        plane.position.set(2, 0.5, 0);
        // Put everything into the group and transform the group
        dice.add(box, plane);
        dice.position.set(x, y, z);
        dice.scale.set(sx * 2, sy * 2, sz * 2);
        box.rotation.set(rx, ry, rz);
    }
}

let parentOfCanvas = document.getElementById("div1");
let world = new GrWorld({ where: parentOfCanvas });

/** @type {GrDice} */ const dice1 = new GrDice({ y: 1.5, x: 2, z: -2, offset: 0.5 });
world.add(dice1);
/** @type {GrDice} */const dice2 = new GrDice({ y: 1.5, x: -2, z: -2, offset: 0.5, rx: Math.PI * 0.5 });
world.add(dice2);

world.go();

// End Example Solution