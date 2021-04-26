function importer(f){
   let points = [];
   let lines = f.split("\n");
   for(let i =0 ; i < lines.length; i++){
        let line = lines[i].split(",")
        points.push(
            {   x: parseFloat(line[0]), 
                y: parseFloat(line[1]), 
                z: parseFloat(line[2]) }
        )
   } 
   return points;
}