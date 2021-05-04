const size = (v) => Math.sqrt(v.x*v.x+v.y*v.y+v.z*v.z);

const sort3 = (a) => {
    if(a[0]< a[1])
        if(a[1] < a[2]) return a;
        else if(a[0] < a[2]) return [a[0],a[2],a[1]]
        else return [a[2],a[0],a[1]];
    else 
        if(a[0]<a[2]) return [a[1],a[0],a[2]]
        else if (a[1]<a[2]) return [a[1],a[2],a[0]]
        else return [a[2],a[1],a[0]]
}

const sort2 = (a) => {
    if(a[0]<a[1]) return a;
    else return [a[1],a[0]]
}

const sub = (a, b) => 
    ({ 
        x: a.x - b.x,
        y: a.y - b.y,
        z: a.z - b.z, 
    })

const add = (a, b) => 
    ({ 
        x: a.x + b.x,
        y: a.y + b.y,
        z: a.z + b.z, 
    })

    //JS sets are idiot :///
const toString = (arr) => {
    var s = "" 
    arr.forEach(v=> s+= ":"+v )
    return s.substr(1);
}
const fromString = (s) => {
    return s.split(":").map(v => parseInt(v))
}

const fromStringAsSet = (s) => {
    var a = fromString(s);
    var s = new Set()
    a.forEach(v => s.add(v))
    return s;
}

const sns = (a) => toString(sort2(a));
const div = (a,b) => 
    ({ 
        x: a.x /b,
        y: a.y /b,
        z: a.z /b, 
    })

const mult = (a,b) => 
    ({ 
        x: a.x *b,
        y: a.y *b,
        z: a.z *b, 
    })

const normalize_vec = (p)=>{
    const length = Math.sqrt(p.x ** 2 + p.y ** 2 + p.z ** 2);
    return {
        x: p.x / length,
        y: p.y / length,
        z: p.z / length
    };
};

const cross = (a,b) => ({
    x: a.y*b.z - a.z*b.y,
    y: -a.x*b.z + a.z*b.x,
    z: a.x*b.y - a.y*b.x
})

const dot_vec = (a, b)=>a.x * b.x + a.y * b.y + a.z * b.z

const angle = (a,b) =>  Math.acos(dot_vec(a,b)/(size(a)*size(b)))

function angleInPlane(e1,e2,e3, normal){
    var v = sub(e2,e1);
    var z = sub(e3,e2);
    var a = cross(v,normal);
    var b = cross(z,normal);
    sign = dot_vec(v,b) < 0 ? 0 : 1
    return angle(a,b) + sign* Math.PI/2;
}

function _faces(polyhedra){
    var vtxMap = {}
    polyhedra.edges.forEach(edge => {
        if(!vtxMap[edge[0]])
            vtxMap[edge[0]] = []
        vtxMap[edge[0]].push(edge[1]);
        if(!vtxMap[edge[1]])
            vtxMap[edge[1]] = []
        vtxMap[edge[1]].push(edge[0]);
    });

    var edges = new Set();
    polyhedra.edges.forEach(v=> edges.add(sns(v)))

    var set = new Set()
    polyhedra.edges.forEach(edge=>{ 
        var normal = {x:0,y:0,z:0}
        var cnt = 0;
        vtxMap[edge[1]].forEach(p => {
            normal = add(normal, sub(polyhedra.points[p],polyhedra.points[edge[1]]))
            cnt+=1;
        })
        normal = div(normal,-cnt);
        // var leftmost = {index:-1, value: Infinity}
        vtxMap[edge[1]].forEach(p => {
            // if(p != edge[0]) {
            //     var curAngle = (angleInPlane(
            //         polyhedra.points[edge[0]],
            //         polyhedra.points[edge[1]],
            //         polyhedra.points[p],
            //         normal
            //     ))
            //     if(toString(sort3([edge[0],edge[1],p]))=== "1:2:3") console.log(curAngle)
            //     if(curAngle < leftmost.value) leftmost = { index:p, value: curAngle}
            // } 
            if(edges.has(sns([edge[0],p])))
                set.add(toString(sort3([
                    edge[0],
                    edge[1],
                    p
                ])));
        })
    })
    var k = [];
    set.forEach(v=> k.push(fromStringAsSet(v)))
    return k;
}


function open_polyhedra(polyhedra){
    var faces = _faces(polyhedra)
    console.log(faces);
    //put all edges into a set for easy access
    var edges = new Set();
    polyhedra.edges.forEach(v=> edges.add(sns(v)))

    var f = faces.shift()
    var myPts = polyhedra.points.map(p=>({x:p.x,y:p.y,z:p.z}))
    openHelper(Array.from(f),edges,faces, myPts ,[]);
    return {points:myPts, edges:polyhedra.edges}
}

function openHelper(face,edgeSet,faces, points){
    var ab = [face[0],face[1]]
    var bc = [face[1],face[2]]
    var ac = [face[0],face[2]]
    var curPoints = []
    if(edgeSet.has(sns(ab))){
        edgeSet.delete(sns(ab));
        //find other face
        var f = faces.filter(v => v.has(ab[0]) && v.has(ab[1]) && !v.has(bc[1]))[0]
        faces = faces.filter(v => !v.has(ab[0]) || !v.has(ab[1]) || v.has(bc[1]))
        if(f){
            var pts = [...openHelper(Array.from(f),edgeSet,faces,points)]
            var k = Array.from(f).filter(v => v!= ab[0] && v != ab[1])[0]
            pts.push(k)

            pts.forEach(p=>
                points[p] = rotatePoint(
                    points[bc[1]],
                    [points[ab[0]], points[ab[1]]],
                    points[p]
                )   
            )

            curPoints.push(...pts);
        }
    }
    if(edgeSet.has(sns(bc))){
        edgeSet.delete(sns(bc));
        //find other face
        var f = faces.filter(v => v.has(bc[0]) && v.has(bc[1]) && !v.has(ab[0]))[0]
        faces = faces.filter(v => !v.has(bc[0]) || !v.has(bc[1]) || v.has(ab[0]))
        if(f){
            var pts = [...openHelper(Array.from(f),edgeSet,faces,points)]
            var k = Array.from(f).filter(v => v!= bc[0] && v != bc[1])[0]
            pts.push(k)

            pts.forEach(p=>
                points[p] = rotatePoint(
                    points[ab[0]],
                    [points[bc[0]], points[bc[1]]],
                    points[p]
                )   
            )
            
            curPoints.push(...pts);
        }
    }
    if(edgeSet.has(sns(ac))){
        edgeSet.delete(sns(ac));
        //find other face
        var f = faces.filter(v => v.has(ac[0]) && v.has(ac[1]) && !v.has(ab[1]))[0]
        faces = faces.filter(v => !v.has(ac[0]) || !v.has(ac[1]) || v.has(ab[1]))
        if(f){
            var pts = [...openHelper(Array.from(f),edgeSet,faces,points)]
            var k = Array.from(f).filter(v => v!= ac[0] && v != ac[1])[0]
            pts.push(k)

            pts.forEach(p=>
                points[p] = rotatePoint(
                    points[ab[1]],
                    [points[ac[0]], points[ac[1]]],
                    points[p]
                )   
            )
            
            curPoints.push(...pts);
        }
    }

    return curPoints;
}

function findOrtho(a,b,c){
    var len = dot_vec(
        sub(a,b),
        sub(c,b)
    )/size(sub(c,b));

    return add(
            b,
            mult(normalize_vec(sub(c,b)),len)
        )
}

function rotatePoint(other, edge, point){
    var orthoP = findOrtho(point, edge[0], edge[1]);
    var pn = cross(
        sub(edge[0],edge[1]),
        sub(other,edge[1])
    )
    console.log("pn",pn)
    var dir = cross(
        pn,
        sub(edge[0],edge[1])
    )

    // var dir = sub(other,findOrtho(other, edge[0],edge[1]))

    dir = dot_vec(dir, sub(other, orthoP)) < 0 ? dir : mult(dir,-1)
    var dist = size(sub(point, orthoP));
    return add(
        orthoP,
        mult(normalize_vec(dir), dist)
    )

}

// open({
//     "points":[
//         {x:-10,y:0,z:0},
//         {x:0,y:0,z:10},
//         {x:0,y:10,z:0},
//         {x:0,y:0,z:-10},
//         {x:0,y:-10,z:0},
//         {x:10,y:0,z:0}
//     ],
//     "edges":[   [0,1],[0,2],[0,3],[0,4],
//                 [1,2],[2,3],[4,3],[1,4],
//                 [1,5],[2,5],[3,5],[5,4]]
// });


//this is an edge case dont know how to solve it
// open({
//     "points":[
//         {x:-10,y:0,z:0},
//         {x:0,y:0,z:10},
//         {x:0,y:10,z:0},
//         {x:0,y:-10,z:0},
//         {x:10,y:0,z:0}
//     ],
//     "edges":[   [0,1],[0,2],[0,3],
//                 [1,2],[2,3],[1,3],
//                 [1,4],[2,4],[3,4]]
// });

// open({
//     "points":[
//         {x:0,y:0,z:0},
//         {x:10,y:0,z:0},
//         {x:0,y:10,z:0},
//         {x:0,y:0,z:10}
//     ],
//     "edges":[[0,1],[1,2],[2,0],[0,3],[1,3],[2,3]]
// });