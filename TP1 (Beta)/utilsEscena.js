//Funciones auxiliares
function RGB (R,G,B) {
    return vec4.fromValues(R/255.0,G/255.0,B/255.0,1.0,1.0);
}

//Parametros de la escena

var MFil = 5;
var MCol = 20;


function getRandomDouble(min, max) {
        
    if(min > max) {
        console.log("Error: min > max");
        return;
    }
    
    var range = max - min;
    
    return min + range * Math.random();
}

