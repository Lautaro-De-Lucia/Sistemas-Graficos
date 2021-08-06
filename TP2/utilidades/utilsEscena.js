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

class ShaderHandler{ 
    
    constructor(vertexShaderID,fragmentShaderID,WebGLContext){

        this.gl = WebGLContext;

        this.modelMatrix;
        this.viewMatrix;
        this.projMatrix;
        this.normalMatrix;
        
        this.fragmentShader = this.makeShader(document.getElementById(fragmentShaderID).innerHTML,this.gl.FRAGMENT_SHADER);
        this.vertexShader = this.makeShader(document.getElementById(vertexShaderID).innerHTML,this.gl.VERTEX_SHADER);
        
        this.glProgram = this.gl.createProgram();

        this.initialize();
    }

    makeShader(src, type){
                
        var shader = this.gl.createShader(type);
        this.gl.shaderSource(shader, src);
        this.gl.compileShader(shader);
    
        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.log("Error compiling shader: " + this.gl.getShaderInfoLog(shader));
        }
        
        return shader;
    }

    initialize(){
        this.gl.attachShader(this.glProgram, this.vertexShader);
        this.gl.attachShader(this.glProgram, this.fragmentShader);
        this.gl.linkProgram(this.glProgram);
        if (!this.gl.getProgramParameter(this.glProgram, this.gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program.");
        }
        this.gl.useProgram(this.glProgram);
    }

    setupVertexShaderMatrix(){}

    setupFragmentShaderMatrix(){}

    getProgram(){
        return this.glProgram;
    }

}

class UniformColorShaderHandler extends ShaderHandler{
    
    constructor(vertexShaderID,fragmentShaderID,WebGLContext){
        super(vertexShaderID,fragmentShaderID,WebGLContext);
        this.color;
    }
    
    setupVertexShaderMatrix(){
        
        this.gl.useProgram(this.glProgram);
        
        this.modelMatrix = this.gl.getUniformLocation(this.glProgram, "modelMatrix");
        this.viewMatrix  = this.gl.getUniformLocation(this.glProgram, "viewMatrix");
        this.projMatrix  = this.gl.getUniformLocation(this.glProgram, "projMatrix");
        this.normalMatrix  = this.gl.getUniformLocation(this.glProgram, "normalMatrix");
        
        this.gl.uniformMatrix4fv(this.modelMatrix, false, initialModelMatrix);
        this.gl.uniformMatrix4fv(this.viewMatrix, false, viewMatrix);
        this.gl.uniformMatrix4fv(this.projMatrix, false, projMatrix);
        this.gl.uniformMatrix4fv(this.normalMatrix, false, initialNormalMatrix);
    }

    setupFragmentShaderMatrix(){
        this.gl.useProgram(this.glProgram);
        this.color = gl.getUniformLocation(this.glProgram, "color");
        this.gl.uniform4fv(this.color, initialColor);
    }

    setShaderMatrix(mModelado,color){
            
        var normalMatrix = glMatrix.mat4.clone(mModelado);
        mat4.invert(normalMatrix,normalMatrix);
        mat4.transpose(normalMatrix,normalMatrix);
        
        this.gl.useProgram(this.glProgram)
        this.gl.uniformMatrix4fv(this.modelMatrix, false, mModelado);
        this.gl.uniformMatrix4fv(this.normalMatrix, false, normalMatrix);
        this.gl.uniform4fv(this.color, color);
        
    }

}

class TextureShaderHandler extends ShaderHandler{
    
    constructor(vertexShaderID,fragmentShaderID,WebGLContext){
        super(vertexShaderID,fragmentShaderID,WebGLContext);
        this.color;
        this.uSamplerUniform;
    }
    
    setupVertexShaderMatrix(){
        
        this.gl.useProgram(this.glProgram);
        
        this.modelMatrix = this.gl.getUniformLocation(this.glProgram, "modelMatrix");
        this.viewMatrix  = this.gl.getUniformLocation(this.glProgram, "viewMatrix");
        this.projMatrix  = this.gl.getUniformLocation(this.glProgram, "projMatrix");
        this.normalMatrix  = this.gl.getUniformLocation(this.glProgram, "normalMatrix");
        
        this.gl.uniformMatrix4fv(this.modelMatrix, false, initialModelMatrix);
        this.gl.uniformMatrix4fv(this.viewMatrix, false, viewMatrix);
        this.gl.uniformMatrix4fv(this.projMatrix, false, projMatrix);
        this.gl.uniformMatrix4fv(this.normalMatrix, false, initialNormalMatrix);
    }

    setupFragmentShaderMatrix(){
        this.gl.useProgram(this.glProgram);
        this.uSamplerUniform = gl.getUniformLocation(this.glProgram, 'uSampler');
        this.gl.uniform1i(this.uSamplerUniform, null);
    }

    setShaderMatrix(mModelado,textura){
            
        this.gl.useProgram(this.glProgram);
    
        var normalMatrix = glMatrix.mat4.clone(mModelado);
        mat4.invert(normalMatrix,normalMatrix);
        mat4.transpose(normalMatrix,normalMatrix);
    
        this.gl.uniformMatrix4fv(this.modelMatrix, false, mModelado);
        this.gl.uniformMatrix4fv(this.normalMatrix, false, normalMatrix);
        this.gl.activeTexture(gl.TEXTURE0);
        this.gl.bindTexture(gl.TEXTURE_2D, textura.getTexturaWebGL());
        this.gl.uniform1i(this.uSamplerUniform, 0); 
        
    }

}

class ReflectionMapShaderHandler extends ShaderHandler {
        
    constructor(vertexShaderID,fragmentShaderID,WebGLContext){
        super(vertexShaderID,fragmentShaderID,WebGLContext);
        this.uSamplerCubeUniform;
        this.worldCameraPositionUniform;
    }
    
    setupVertexShaderMatrix(){
        
        this.gl.useProgram(this.glProgram);
        
        this.modelMatrix = this.gl.getUniformLocation(this.glProgram, "modelMatrix");
        this.viewMatrix  = this.gl.getUniformLocation(this.glProgram, "viewMatrix");
        this.projMatrix  = this.gl.getUniformLocation(this.glProgram, "projMatrix");
        this.normalMatrix  = this.gl.getUniformLocation(this.glProgram, "normalMatrix");
        
        this.gl.uniformMatrix4fv(this.modelMatrix, false, initialModelMatrix);
        this.gl.uniformMatrix4fv(this.viewMatrix, false, viewMatrix);
        this.gl.uniformMatrix4fv(this.projMatrix, false, projMatrix);
        this.gl.uniformMatrix4fv(this.normalMatrix, false, initialNormalMatrix);
    }

    setupFragmentShaderMatrix(){
        this.gl.useProgram(this.glProgram);
        this.uSamplerCubeUniform = this.gl.getUniformLocation(this.glProgram, 'uSamplerCube');
        this.gl.uniform1i(this.uSamplerCubeUniform, null);
        this.worldCameraPositionUniform = gl.getUniformLocation(this.glProgram, 'worldCameraPosition');
        this.gl.uniform3fv(this.worldCameraPositionUniform, vec3.fromValues(0,0,0));
    }

    setShaderMatrix(mModelado){
            
        this.gl.useProgram(this.glProgram);

        var normalMatrix = glMatrix.mat4.clone(mModelado);
        mat4.invert(normalMatrix,normalMatrix);
        mat4.transpose(normalMatrix,normalMatrix);

        this.gl.uniformMatrix4fv(this.modelMatrix, false, mModelado);
        this.gl.uniformMatrix4fv(this.normalMatrix, false, normalMatrix);

        gl.activeTexture(gl.TEXTURE0);
        gl.uniform1i(this.uSamplerCubeUniform, 0);
        
    }

    cargarTexturas(texturasMapaCubico) {

        this.gl.useProgram(this.glProgram);
        
        // Create a texture.
        var texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, texture);

        const faceInfos = [
            
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 
                url: texturasMapaCubico.get("PX"),
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 
                url: texturasMapaCubico.get("NX"),
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 
                url: texturasMapaCubico.get("PY"),
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 
                url: texturasMapaCubico.get("NY"),
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 
                url: texturasMapaCubico.get("PZ"),
            },
            {
                target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 
                url: texturasMapaCubico.get("NZ"),
            },
        ];

        faceInfos.forEach((faceInfo) => {
            
            const {target, url} = faceInfo;

            // Upload the canvas to the cubemap face.
            const level = 0;
            const internalFormat = this.gl.RGBA;
            const width = 512;
            const height = 512;
            const format = this.gl.RGBA;
            const type = this.gl.UNSIGNED_BYTE;
            
            // setup each face so it's immediately renderable
            this.gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
            
            // Asynchronously load an image
            const image = new Image();
            image.src = url;
            image.addEventListener('load', function() {

                // Now that the image has loaded upload it to the texture.
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                gl.texImage2D(target, level, internalFormat, format, type, image);
                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
            });
        });

        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }

    changeWorldCameraPosition(currentCameraPosition){
        this.gl.useProgram(this.glProgram);
        this.gl.uniform3fv(this.worldCameraPositionUniform,currentCameraPosition);
    }

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