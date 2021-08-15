var NFil = 5;
var NCol = 10;

function RGB (R,G,B) {
    return vec4.fromValues(R/255.0,G/255.0,B/255.0,1.0,1.0);
}

function getRandom(min, max) {
    var rango = max - min;
    return min + rango * Math.random();
}

function isPowerOf2(value) {   
    return (value & (value - 1)) == 0;
}

class Textura {
    constructor(url,escala = vec2.fromValues(1,1)){
        this.url = url;
        this.escala = escala;
        this.texturaWebGL = this.cargarTextura(url);
    }

    getEscala(){return this.escala;};
    getTexturaWebGL(){return this.texturaWebGL;};
    estaCargada(){return true;}

    cargarTextura(url) {
    
        if(texturas.has(url)) 
            return texturas.get(url);
            
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
    
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;
        const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
        
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
    
        const image = new Image();
        
        image.onload = function() {
            
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
            
            if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {            
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            }
        };
        
        image.src = url;
        texturas.set(url, texture);
        return texture;
    }

}

class TexturaVacia {
    constructor(){
    }
    getEscala(){
        return vec2.fromValues(1,1);
    }
    estaCargada(){
        return false;
    }
}