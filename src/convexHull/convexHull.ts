type Point3D = {
    x: number,
    y: number,
    z: number
};

type Polyhedra = {
    points: Point3D[],
    edges: [number, number][],
};

type PointWithIndex = {
    index: number,
    point: Point3D,
};

export const convexHull3D = (points: Point3D[]): Polyhedra => {
    let pointsWithIndexes = new Map<number, Point3D>();

    points.forEach((point, index) => pointsWithIndexes.set(index, point));

    const edgesSet = new Set<string>();

    const leftMost = findLeftMost(pointsWithIndexes);

    // pointsWithIndexes.delete(leftMost.index);

    console.log(pointsWithIndexes);

    const secondVertex = findSecondVertex(pointsWithIndexes, leftMost);

    const initialEdge: [number, number] = [ leftMost.index, secondVertex.index ];

    edgesSet.add(JSON.stringify(initialEdge));

    const visitedEdges = new Set<string>();
    const toVisit: [number, number][] = [];

    toVisit.push(initialEdge);

    let lastEdge: [number, number] | null = null;

    while (toVisit.length > 0) {
        const edge = toVisit.shift();

        console.log(`visiting edge ${JSON.stringify(edge)}`);

        if (visitedEdges.has(JSON.stringify(edge))) {
            console.log(`edge is already visited`);
            continue;
        }

        if (edge !== undefined) {
            const edgeNormal = normalize(pointDiff(points[edge[1]], points[edge[0]]));
    
            let mostConvex = { index: -1, angle: -1e10 };
            for (const [index, point] of pointsWithIndexes.entries()) {
                const diff = normalize(pointDiff(points[edge[1]], point));
                const angle = Math.acos(dot(diff, edgeNormal));

                if (angle > mostConvex.angle) {
                    if (angle < Math.PI) {
                        mostConvex = { index, angle };
                    } else {
                        throw new Error(`Angle is not less than PI: ${angle}`);
                    }
                }
            }

            console.log(`picked point: ${mostConvex.index}`);

            const edge1: [number, number] = [ edge[1], mostConvex.index ];
            const edge2: [number, number] = [ mostConvex.index, edge[0] ];

            if (!edgesSet.has(JSON.stringify(edge1)) &&
                !edgesSet.has(JSON.stringify(edge1.reverse()))) {
                    
                edgesSet.add(JSON.stringify(edge1));
                lastEdge = edge1;
            }

            // result.edges.push([edge[1], mostConvex.index]);
            // result.edges.push([ mostConvex.index, edge[0] ]);
            toVisit.push(edge1);
            toVisit.push(edge2);
            
            visitedEdges.add(JSON.stringify(edge));
        } else {
            throw new Error("Unreachable");
        }        
    }

    if (lastEdge) {
        edgesSet.add(JSON.stringify([ leftMost.index, lastEdge[1] ]));
    }

    return {
        points,
        edges: [ ...edgesSet.values() ].map(s => JSON.parse(s))
    };
}

const findLeftMost = (pointsWithIndexes: Map<number, Point3D>): PointWithIndex => {
    let leftMost: { index: number, point: Point3D } = {
        index: -1,
        point: { 
            x: Infinity,
            y: 0,
            z: 0
        }
    };

    for (const [index, point] of pointsWithIndexes.entries()) {
        if (point.x < leftMost.point.x) {
            leftMost = { index, point };
        } else if (point.x === leftMost.point.x) {
            if (point.y < leftMost.point.y) {
                leftMost = { index, point };
            } else if (point.y === leftMost.point.y) {
                if (point.z < leftMost.point.z) {
                    leftMost = { index, point };
                }
            }
        }
    }

    return leftMost;
} 

const findSecondVertex = (pointsWithIndexes: Map<number, Point3D>, leftMost: PointWithIndex): PointWithIndex => {
    const planeNormal = { x: 1, y: 0, z: 0 };
    let mostConvex = { index: -1, angle: -1e10 };

    for (const [index, point] of pointsWithIndexes.entries()) {
        const diff = normalize(pointDiff(point, leftMost.point));
        const angle = Math.acos(dot(diff, planeNormal));

        if (angle > mostConvex.angle) {
            if (angle < Math.PI) {
                mostConvex = { index, angle };
            } else {
                throw new Error(`angle is not less than PI: ${angle}, this should be impossible`);
            }
        }
    }

    return { index: mostConvex.index, point: pointsWithIndexes.get(mostConvex.index) as Point3D };
}

/**
 * a - b
 */
const pointDiff = (a: Point3D, b: Point3D): Point3D => 
    ({ 
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z, 
    })

const normalize = (p: Point3D): Point3D => {
    const length = Math.sqrt((p.x ** 2) + (p.y ** 2) + (p.z ** 2));

    return {
        x: p.x / length,
        y: p.y / length,
        z: p.z / length,
    };
}

const dot = (a: Point3D, b: Point3D): number => 
    (a.x * b.x) + (a.y * b.y) + (a.z * b.z)

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