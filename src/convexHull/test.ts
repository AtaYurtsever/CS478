import { convexHull3D } from "./convexHull.ts";

const points = [
    { x: -5, y: 0, z: 0 },
    { x: 0, y: 5, z: 5 },
    { x: -1, y: -5, z: 5 },
    { x: 0, y: 5, z: -5 },
    { x: 0, y: -5, z: -5 },
    { x: 5, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 1, z: 0 },
    { x: -1, y: 0, z: 1 },
];

console.log(convexHull3D(points));