class ConvexHull3DIter {
    edgesSet = new Set();
    pointsWithIndexes = new Map();
    visitedEdges = new Set();
    toVisit = [];
    constructor(points){
        this.points = points;
        points.forEach((point, index)=>this.pointsWithIndexes.set(index, point)
        );
        const leftMost = findLeftMost(this.pointsWithIndexes);
        const secondVertex = findSecondVertex(this.pointsWithIndexes, leftMost);
        const initialEdge = [
            leftMost.index,
            secondVertex.index
        ];
        this.edgesSet.add(JSON.stringify(initialEdge));
        const initialPlaneNormal = {
            x: 1,
            y: 0,
            z: 0
        };
        const initialEdgeNormalized = normalize(pointDiff(secondVertex.point, leftMost.point));
        const planeEdgeCross = cross(initialPlaneNormal, initialEdgeNormalized);
        const secondPlaneNormal = normalize(cross(initialEdgeNormalized, planeEdgeCross));
        this.faceNormal = secondPlaneNormal;
        this.toVisit.push({
            edge: initialEdge,
            faceNormal: secondPlaneNormal,
            p3Index: -1
        });
    }
    get edges() {
        return [
            ...this.edgesSet.values()
        ].map((s)=>JSON.parse(s)
        );
    }
    nextStep() {
        while(this.toVisit.length > 0){
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
                const edgeVector = normalize(pointDiff(p2, p1));
                const aVector = cross(edge.faceNormal, edgeVector);
                let mostConvex = {
                    index: -1,
                    angle: -Infinity
                };
                for (const [index, point] of this.pointsWithIndexes.entries()){
                    if (index === p1i || index === p2i || index === edge.p3Index) {
                        continue;
                    }
                    const v_k = normalize(pointDiff(point, p2));
                    const angle = -(dot(v_k, aVector) / dot(v_k, edge.faceNormal));
                    if (angle > mostConvex.angle) {
                        mostConvex = {
                            index,
                            angle
                        };
                    }
                }
                console.log(`picked point: ${mostConvex.index}`);
                const edge1 = [
                    p1i,
                    mostConvex.index
                ];
                const edge2 = [
                    mostConvex.index,
                    p2i
                ];
                const v_k = pointDiff(this.points[mostConvex.index], p2);
                const currentFaceNormal = minus(normalize(cross(v_k, pointDiff(p1, p2))));
                this.edgesSet.add(JSON.stringify(edge1));
                this.edgesSet.add(JSON.stringify(edge2));
                this.toVisit.push({
                    edge: edge1,
                    faceNormal: currentFaceNormal,
                    p3Index: p2i
                });
                this.toVisit.push({
                    edge: edge2,
                    faceNormal: currentFaceNormal,
                    p3Index: p1i
                });
                this.visitedEdges.add(JSON.stringify(edge.edge));
                this.visitedEdges.add(JSON.stringify(edge.edge.reverse()));
                this.faceNormal = currentFaceNormal;
                return true;
            }
        }
        return false;
    }
}
const convexHull3D = (points1)=>{
    const edgesSet = new Set();
    const pointsWithIndexes = new Map();
    const visitedEdges = new Set();
    const toVisit = [];
    points1.forEach((point, index)=>pointsWithIndexes.set(index, point)
    );
    const leftMost1 = findLeftMost(pointsWithIndexes);
    const secondVertex1 = findSecondVertex(pointsWithIndexes, leftMost1);
    const initialEdge1 = [
        leftMost1.index,
        secondVertex1.index
    ];
    edgesSet.add(JSON.stringify(initialEdge1));
    const initialPlaneNormal1 = {
        x: 1,
        y: 0,
        z: 0
    };
    const initialEdgeNormalized1 = normalize(pointDiff(secondVertex1.point, leftMost1.point));
    const planeEdgeCross1 = cross(initialPlaneNormal1, initialEdgeNormalized1);
    const secondPlaneNormal1 = normalize(cross(initialEdgeNormalized1, planeEdgeCross1));
    toVisit.push({
        edge: initialEdge1,
        faceNormal: secondPlaneNormal1,
        p3Index: -1
    });
    while(toVisit.length > 0){
        const edge = toVisit.shift();
        if (edge !== undefined) {
            const p1i = edge.edge[0];
            const p2i = edge.edge[1];
            const p1 = points1[p1i];
            const p2 = points1[p2i];
            if (visitedEdges.has(JSON.stringify(edge.edge)) || visitedEdges.has(JSON.stringify(edge.edge.reverse()))) {
                continue;
            }
            const edgeVector = normalize(pointDiff(p2, p1));
            const aVector = cross(edge.faceNormal, edgeVector);
            let mostConvex = {
                index: -1,
                angle: -Infinity
            };
            for (const [index, point] of pointsWithIndexes.entries()){
                if (index === p1i || index === p2i || index === edge.p3Index) {
                    continue;
                }
                const v_k = normalize(pointDiff(point, p2));
                const angle = -(dot(v_k, aVector) / dot(v_k, edge.faceNormal));
                if (angle > mostConvex.angle) {
                    mostConvex = {
                        index,
                        angle
                    };
                }
            }
            console.log(`picked point: ${mostConvex.index}`);
            const edge1 = [
                p1i,
                mostConvex.index
            ];
            const edge2 = [
                mostConvex.index,
                p2i
            ];
            const v_k = pointDiff(points1[mostConvex.index], p2);
            const currentFaceNormal = minus(normalize(cross(v_k, pointDiff(p1, p2))));
            edgesSet.add(JSON.stringify(edge1));
            edgesSet.add(JSON.stringify(edge2));
            toVisit.push({
                edge: edge1,
                faceNormal: currentFaceNormal,
                p3Index: p2i
            });
            toVisit.push({
                edge: edge2,
                faceNormal: currentFaceNormal,
                p3Index: p1i
            });
            visitedEdges.add(JSON.stringify(edge.edge));
        } else {
            throw new Error("Unreachable");
        }
    }
    return {
        points: points1,
        edges: [
            ...edgesSet.values()
        ].map((s)=>JSON.parse(s)
        )
    };
};
const findLeftMost = (pointsWithIndexes)=>{
    let leftMost1 = {
        index: -1,
        point: {
            x: Infinity,
            y: 0,
            z: 0
        }
    };
    for (const [index, point] of pointsWithIndexes.entries()){
        if (point.x < leftMost1.point.x) {
            leftMost1 = {
                index,
                point
            };
        } else if (point.x === leftMost1.point.x) {
            if (point.y < leftMost1.point.y) {
                leftMost1 = {
                    index,
                    point
                };
            } else if (point.y === leftMost1.point.y) {
                if (point.z < leftMost1.point.z) {
                    leftMost1 = {
                        index,
                        point
                    };
                }
            }
        }
    }
    return leftMost1;
};
const findSecondVertex = (pointsWithIndexes, leftMost1)=>{
    const planeNormal = {
        x: 1,
        y: 0,
        z: 0
    };
    let mostConvex = {
        index: -1,
        angle: -10000000000
    };
    for (const [index, point] of pointsWithIndexes.entries()){
        const diff = normalize(pointDiff(point, leftMost1.point));
        const angle = Math.acos(dot(diff, planeNormal));
        if (angle > mostConvex.angle) {
            if (angle < Math.PI) {
                mostConvex = {
                    index,
                    angle
                };
            } else {
                throw new Error(`angle is not less than PI: ${angle}, this should be impossible`);
            }
        }
    }
    return {
        index: mostConvex.index,
        point: pointsWithIndexes.get(mostConvex.index)
    };
};
const pointLength = (a)=>{
    return Math.sqrt(a.x ** 2 + a.y ** 2 + a.z ** 2);
};
const pointDiff = (a, b)=>({
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z
    })
;
const normalize = (p)=>{
    const length = Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
    return {
        x: p.x / length,
        y: p.y / length,
        z: p.z / length
    };
};
const dot = (a, b)=>a.x * b.x + a.y * b.y + a.z * b.z
;
const cross = (a, b)=>({
        x: a.y * b.z - a.z * b.y,
        y: a.z * b.x - a.x * b.z,
        z: a.x * b.y - a.y * b.x
    })
;
const minus = (p)=>({
        x: -p.x,
        y: -p.y,
        z: -p.z
    })
;