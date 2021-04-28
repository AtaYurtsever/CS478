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

export class ConvexHull3DIter { 
    private edgesSet = new Set<string>();
    private pointsWithIndexes = new Map<number, Point3D>();
    private visitedEdges = new Set<string>();
    private toVisit: { edge: [number, number], faceNormal: Point3D, p3Index: number }[] = [];
    public faceNormal: Point3D;

    constructor(private points: Point3D[]) {
        
        points.forEach((point, index) => this.pointsWithIndexes.set(index, point));

        const leftMost = findLeftMost(this.pointsWithIndexes);

        const secondVertex = findSecondVertex(this.pointsWithIndexes, leftMost);

        const initialEdge: [number, number] = [ leftMost.index, secondVertex.index ];

        /* edgesSet.add(JSON.stringify([ points.length, points.length + 1 ])) */

        this.edgesSet.add(JSON.stringify(initialEdge));

        const initialPlaneNormal = { x: 1, y: 0, z: 0 };

        const initialEdgeNormalized = normalize(pointDiff(secondVertex.point, leftMost.point));

        const planeEdgeCross = cross(initialPlaneNormal, initialEdgeNormalized);

        const secondPlaneNormal = normalize(cross(initialEdgeNormalized, planeEdgeCross));

        this.faceNormal = secondPlaneNormal;

        this.toVisit.push({ edge: initialEdge, faceNormal: secondPlaneNormal, p3Index: -1 });
    }

    get edges() {
        return [ ...this.edgesSet.values() ].map(s => JSON.parse(s))
    }

    public nextStep(): boolean {
        while (this.toVisit.length > 0) {
            const edge = this.toVisit.shift();

            if (edge !== undefined) {
                const p1i = edge.edge[0];
                const p2i = edge.edge[1];
                const p1 = this.points[p1i];
                const p2 = this.points[p2i];
            
                console.log(`visiting edge ${JSON.stringify(edge)}`);
    
                if (this.visitedEdges.has(JSON.stringify(edge.edge)) || this.visitedEdges.has(JSON.stringify(edge.edge.reverse()))) {
                    console.log(`edge is already visited`);
                    continue;
                }
                // const edgeNormal = normalize(pointDiff(points[edge[1]], points[edge[0]]));
        
                const edgeVector = normalize(pointDiff(p2, p1));
                const aVector = cross(edge.faceNormal, edgeVector);
                
                let mostConvex = { index: -1, angle: -Infinity };
                for (const [index, point] of this.pointsWithIndexes.entries()) {
                    if (index === p1i || index === p2i || index === edge.p3Index) {
                        continue;
                    }

                    const v_k = normalize(pointDiff(point, p2));

                    const angle = - (dot(v_k, aVector) / dot(v_k, edge.faceNormal));
                        
                    if (angle > mostConvex.angle) {
                        mostConvex = { index, angle };
                    }
                }
    
                console.log(`picked point: ${mostConvex.index}`);
    
                const edge1: [number, number] = [ p1i, mostConvex.index ];
                const edge2: [number, number] = [ mostConvex.index, p2i ];
    
                const v_k = pointDiff(this.points[mostConvex.index], p2);
    
                const currentFaceNormal = minus(normalize(cross(v_k, pointDiff(p1, p2))));
    
                this.edgesSet.add(JSON.stringify(edge1));
                this.edgesSet.add(JSON.stringify(edge2));
    
                this.toVisit.push({ edge: edge1, faceNormal: currentFaceNormal, p3Index: p2i });
                this.toVisit.push({ edge: edge2, faceNormal: currentFaceNormal, p3Index: p1i });
                
                this.visitedEdges.add(JSON.stringify(edge.edge));
                this.visitedEdges.add(JSON.stringify(edge.edge.reverse()));

                this.faceNormal = currentFaceNormal;
    
                return true;
            }
        }

        return false;
    }
}

export const convexHull3D = (points: Point3D[]): Polyhedra => {
    const edgesSet = new Set<string>();

    const pointsWithIndexes = new Map<number, Point3D>();

    const visitedEdges = new Set<string>();

    const toVisit: { edge: [number, number], faceNormal: Point3D, p3Index: number }[] = [];

    points.forEach((point, index) => pointsWithIndexes.set(index, point));

    const leftMost = findLeftMost(pointsWithIndexes);
    
    const secondVertex = findSecondVertex(pointsWithIndexes, leftMost);

    const initialEdge: [number, number] = [ leftMost.index, secondVertex.index ];
    
    edgesSet.add(JSON.stringify(initialEdge));
    
    const initialPlaneNormal = { x: 1, y: 0, z: 0 };

    const initialEdgeNormalized = normalize(pointDiff(secondVertex.point, leftMost.point));

    const planeEdgeCross = cross(initialPlaneNormal, initialEdgeNormalized);

    const secondPlaneNormal = normalize(cross(initialEdgeNormalized, planeEdgeCross));

    toVisit.push({ edge: initialEdge, faceNormal: secondPlaneNormal, p3Index: -1 });

    // let lastEdge: [number, number] | null = null;
    
    // let currentFaceNormal = secondPlaneNormal;

    while (toVisit.length > 0) {
        const edge = toVisit.shift();
        
        if (edge !== undefined) {
            const p1i = edge.edge[0];
            const p2i = edge.edge[1];
            const p1 = points[p1i];
            const p2 = points[p2i];
        
            // console.log(`visiting edge ${JSON.stringify(edge)}`);

            if (visitedEdges.has(JSON.stringify(edge.edge)) || visitedEdges.has(JSON.stringify(edge.edge.reverse()))) {
                // console.log(`edge is already visited`);
                continue;
            }
            // const edgeNormal = normalize(pointDiff(points[edge[1]], points[edge[0]]));
    
            const edgeVector = normalize(pointDiff(p2, p1));
            const aVector = cross(edge.faceNormal, edgeVector);
            
            let mostConvex = { index: -1, angle: -Infinity };
            for (const [index, point] of pointsWithIndexes.entries()) {
                if (index === p1i || index === p2i || index === edge.p3Index) {
                    continue;
                }

                const v_k = normalize(pointDiff(point, p2));

                const angle = - (dot(v_k, aVector) / dot(v_k, edge.faceNormal));
                    
                if (angle > mostConvex.angle) {
                    mostConvex = { index, angle };
                }
            }

            console.log(`picked point: ${mostConvex.index}`);

            const edge1: [number, number] = [ p1i, mostConvex.index ];
            const edge2: [number, number] = [ mostConvex.index, p2i ];

            const v_k = pointDiff(points[mostConvex.index], p2);

            const currentFaceNormal = minus(normalize(cross(v_k, pointDiff(p1, p2))));

            edgesSet.add(JSON.stringify(edge1));
            edgesSet.add(JSON.stringify(edge2));

            toVisit.push({ edge: edge1, faceNormal: currentFaceNormal, p3Index: p2i });
            toVisit.push({ edge: edge2, faceNormal: currentFaceNormal, p3Index: p1i });
            
            visitedEdges.add(JSON.stringify(edge.edge));

        } else {
            throw new Error("Unreachable");
        }        
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

const pointLength = (a: Point3D): number => {
    return Math.sqrt((a.x ** 2) + (a.y ** 2) + (a.z ** 2));
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

const pointAdd = (a: Point3D, b: Point3D): Point3D => 
    ({ 
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z, 
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

const cross = (a: Point3D, b: Point3D): Point3D => 
    ({
        x: (a.y  * b.z) - (a.z * b.y),
        y: (a.z  * b.x) - (a.x * b.z),
        z: (a.x  * b.y) - (a.y * b.x)
    })

const minus = (p: Point3D): Point3D => ({
    x: -p.x, y: -p.y, z: -p.z
})