var NFil = 5;
var NCol = 5;

function RGB (R,G,B) {
    return vec4.fromValues(R/255.0,G/255.0,B/255.0,1.0,1.0);
}

function getRandom(min, max) {
    var rango = max - min;
    return min + rango * Math.random();
}

