const convexHull3D = (points)=>{
    const pointsWithIndexes = new Map();
    points.forEach((point, index)=>pointsWithIndexes.set(index, point)
    );
    const edgesSet = new Set();
    const leftMost = findLeftMost(pointsWithIndexes);
    console.log(pointsWithIndexes);
    const secondVertex = findSecondVertex(pointsWithIndexes, leftMost);
    const initialEdge = [
        leftMost.index,
        secondVertex.index
    ];
    edgesSet.add(JSON.stringify(initialEdge));
    const visitedEdges = new Set();
    const toVisit = [];
    toVisit.push(initialEdge);
    let lastEdge = null;
    while(toVisit.length > 0){
        const edge = toVisit.shift();
        console.log(`visiting edge ${JSON.stringify(edge)}`);
        if (visitedEdges.has(JSON.stringify(edge))) {
            console.log(`edge is already visited`);
            continue;
        }
        if (edge !== undefined) {
            const edgeNormal = normalize(pointDiff(points[edge[1]], points[edge[0]]));
            let mostConvex = {
                index: -1,
                angle: -10000000000
            };
            for (const [index, point] of pointsWithIndexes.entries()){
                const diff = normalize(pointDiff(points[edge[1]], point));
                const angle = Math.acos(dot(diff, edgeNormal));
                if (angle > mostConvex.angle) {
                    if (angle < Math.PI) {
                        mostConvex = {
                            index,
                            angle
                        };
                    } else {
                        throw new Error(`Angle is not less than PI: ${angle}`);
                    }
                }
            }
            console.log(`picked point: ${mostConvex.index}`);
            const edge1 = [
                edge[1],
                mostConvex.index
            ];
            const edge2 = [
                mostConvex.index,
                edge[0]
            ];
            if (!edgesSet.has(JSON.stringify(edge1)) && !edgesSet.has(JSON.stringify(edge1.reverse()))) {
                edgesSet.add(JSON.stringify(edge1));
                lastEdge = edge1;
            }
            toVisit.push(edge1);
            toVisit.push(edge2);
            visitedEdges.add(JSON.stringify(edge));
        } else {
            throw new Error("Unreachable");
        }
    }
    if (lastEdge) {
        edgesSet.add(JSON.stringify([
            leftMost.index,
            lastEdge[1]
        ]));
    }
    return {
        points,
        edges: [
            ...edgesSet.values()
        ].map((s)=>JSON.parse(s)
        )
    };
};
const findLeftMost = (pointsWithIndexes)=>{
    let leftMost = {
        index: -1,
        point: {
            x: Infinity,
            y: 0,
            z: 0
        }
    };
    for (const [index, point] of pointsWithIndexes.entries()){
        if (point.x < leftMost.point.x) {
            leftMost = {
                index,
                point
            };
        } else if (point.x === leftMost.point.x) {
            if (point.y < leftMost.point.y) {
                leftMost = {
                    index,
                    point
                };
            } else if (point.y === leftMost.point.y) {
                if (point.z < leftMost.point.z) {
                    leftMost = {
                        index,
                        point
                    };
                }
            }
        }
    }
    return leftMost;
};
const findSecondVertex = (pointsWithIndexes, leftMost)=>{
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
        const diff = normalize(pointDiff(point, leftMost.point));
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
