class Objeto3D {

    constructor() {

        this.filas = NFil;
        this.columnas = NCol;

        this.mallaDeTriangulos = null;
        this.matrizModelado = mat4.create();
        
        this.traslacion = vec3.fromValues(0,0,0); 
        this.rotacion = vec3.fromValues(0,0,0); 
        this.escala = vec3.fromValues(1,1,1); 

        this.posicionAcumulada = vec3.fromValues(0,0,0); 
        this.rotacionAcumulada = vec3.fromValues(0,0,0); 
        this.escalaAcumulada = vec3.fromValues(1,1,1); 
        
        this.hijos = [];

    }

    setTextura(textura){
        this.textura = textura;
    }

    getMallaDeTriangulos() {
        return this.mallaDeTriangulos;
    }

    setupFigura() {
        this.mallaDeTriangulos = null;
    }

	actualizarMatrizModelado() {
		
		mat4.translate(this.matrizModelado, this.matrizModelado, this.traslacion);
        
        mat4.rotateX(this.matrizModelado, this.matrizModelado, this.rotacion[0]);
		mat4.rotateY(this.matrizModelado, this.matrizModelado, this.rotacion[1]);
		mat4.rotateZ(this.matrizModelado, this.matrizModelado, this.rotacion[2]);
		
		mat4.scale(this.matrizModelado, this.matrizModelado, this.escala);

        this.traslacion = vec3.fromValues(0,0,0); 
        this.rotacion = vec3.fromValues(0,0,0); 
        this.escala = vec3.fromValues(1,1,1); 
	}

    dibujar(matPadre = mat4.create()) {
        var m = mat4.create();

		mat4.multiply(m, matPadre, this.matrizModelado); 
        if (this.mallaDeTriangulos){
            if(this.textura.esNula()){
                gl.useProgram(glProgramUniformColor);
                setShaderMatrixUniforme(m,this.color);
                dibujarMallaDeTriangulos(this.mallaDeTriangulos,glProgramUniformColor);
            } else{
                gl.useProgram(glProgramTextures);
                setShaderMatrixTextura(m,this.textura);
                dibujarMallaDeTriangulos(this.mallaDeTriangulos,glProgramTextures); 
                gl.useProgram(glProgramUniformColor);
            }
		}
		for (var i = 0; i < this.hijos.length; i++){
			this.hijos[i].dibujar(m);
		}
	}

    agregarHijo(hijoNuevo) {
		
        this.hijos.push(hijoNuevo);
	}

	quitarHijo(hijoAQuitar) {
		
        const index = this.hijos.indexOf(hijoAQuitar);
		
        if (index > -1) {
				this.hijos.splice(index, 1);
		}
	}

    quitarHijo() {
		return this.hijos.pop();
	}

    trasladar(x, y, z) {
		vec3.set(this.traslacion, x, y, z);
        this.posicionAcumulada[0]+=x;
        this.posicionAcumulada[1]+=y;
        this.posicionAcumulada[2]+=z;
        this.actualizarMatrizModelado();
	}

	rotar(x, y, z) {
		vec3.set(this.rotacion, x, y, z);
        this.rotacionAcumulada[0]+=x;
        this.rotacionAcumulada[1]+=y;
        this.rotacionAcumulada[2]+=z;
        this.actualizarMatrizModelado();
	}

	escalar(x, y, z) {
		vec3.set(this.escala, x, y, z);
        this.escalaAcumulada[0]*=x;
        this.escalaAcumulada[1]*=y;
        this.escalaAcumulada[2]*=z;
        this.actualizarMatrizModelado();
	}

}

function dibujarMallaDeTriangulos(mallaDeTriangulos,programa){
	
    var modo = "edges";

    vertexPositionAttribute = gl.getAttribLocation(programa, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);


    textureCoordAttribute = gl.getAttribLocation(programa, "aVertexUv");
    gl.enableVertexAttribArray(textureCoordAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_uvs_buffer);
    gl.vertexAttribPointer(textureCoordAttribute, mallaDeTriangulos.webgl_uvs_buffer.itemSize, gl.FLOAT, false, 0, 0);

    vertexNormalAttribute = gl.getAttribLocation(programa, "aVertexNormal");
    gl.enableVertexAttribArray(vertexNormalAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_normal_buffer);
    gl.vertexAttribPointer(vertexNormalAttribute, mallaDeTriangulos.webgl_normal_buffer.itemSize, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mallaDeTriangulos.webgl_index_buffer);

    if (modo!="wireframe"){

        gl.drawElements(gl.TRIANGLE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    if (modo!="smooth") {
        
        gl.drawElements(gl.LINE_STRIP, mallaDeTriangulos.webgl_index_buffer.numItems, gl.UNSIGNED_SHORT, 0);

    }

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function setShaderMatrixUniforme(mModelado, color){
    
    var normalMatrix = glMatrix.mat4.clone(mModelado);
	mat4.invert(normalMatrix,normalMatrix);
	mat4.transpose(normalMatrix,normalMatrix);

        gl.useProgram(glProgramUniformColor)
        gl.uniformMatrix4fv(modelMatrixUniform, false, mModelado);
        gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
        gl.uniform4fv(colorUniform, color);
    
}

function setShaderMatrixTextura(mModelado,textura){
    
    var normalMatrix = glMatrix.mat4.clone(mModelado);
	mat4.invert(normalMatrix,normalMatrix);
	mat4.transpose(normalMatrix,normalMatrix);

    gl.uniformMatrix4fv(modelMatrixTextures, false, mModelado);
    gl.uniformMatrix4fv(normalMatrixTextures, false, normalMatrix);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textura.getTexturaWebGL());
    gl.uniform1i(uSamplerUniform, 0); 
}

class Cuadrado extends Objeto3D {

    constructor(lado = 1, color = RGB(250,250,0),textura = new TexturaVacia()) {

        super();

        this.color = color;
        this.superficieElemental = new CuadradoSuperficie(lado);
        this.textura = textura;

        this.setupFigura();

    }

    setupFigura() {
        this.mallaDeTriangulos = setupBuffersSuperficie(this.superficieElemental, this.filas, this.columnas,this.textura.getEscala());
    }

}

class Cubo extends Objeto3D {

    constructor(lado = 1, color = RGB(200,200,200),textura = new TexturaVacia()) {

        super();

        this.lado = lado;
        this.color = color;
        this.textura = textura;

        this.superficieElemental = new CuadradoSuperficie(lado);

        this.setupFigura();
    }

    setColor(nuevoColor){
        this.color = nuevoColor;
        this.setupFigura();
    }

    setupFigura() {

        this.mallaDeTriangulos = null;

        var caraSuperior = new Cuadrado(this.lado,this.color,this.textura);
        caraSuperior.trasladar(0,this.lado/2,0.0);
        this.hijos.push(caraSuperior);
       
        var caraInferior = new Cuadrado(this.lado,this.color,this.textura);
        caraInferior.escalar(1,-1,1);
        caraInferior.trasladar(0,this.lado/2,0.0);
        this.hijos.push(caraInferior);

        var caraIzquierda = new Cuadrado(this.lado,this.color,this.textura);
        caraIzquierda.rotar(0,0,3.14/2.0);
        caraIzquierda.trasladar(0,-this.lado/2,0);
        caraIzquierda.escalar(1,-1,1);
        this.hijos.push(caraIzquierda);

        var caraDerecha = new Cuadrado(this.lado,this.color,this.textura);
        caraDerecha.rotar(0,0,3.14/2.0);
        caraDerecha.trasladar(0,this.lado/2,0);
        this.hijos.push(caraDerecha);

        var caraFrente = new Cuadrado(this.lado,this.color,this.textura);
        caraFrente.rotar(3.14/2.0,0,0);
        caraFrente.trasladar(0,-this.lado/2,0);
        caraFrente.escalar(1,-1,1);
        this.hijos.push(caraFrente);

        var caraDetras = new Cuadrado(this.lado,this.color,this.textura);
        caraDetras.rotar(3.14/2.0,0,0);
        caraDetras.trasladar(0,this.lado/2,0);
        this.hijos.push(caraDetras);
    }

    getLado() {      
        return this.lado;
    }

}

class Circulo extends Objeto3D {

    constructor(radio = 1, color = RGB(250,0,0),textura = new TexturaVacia()) {

        super();

        this.radio = radio;
        this.color = color;
        this.textura = textura;

        this.superficieElemental = new CirculoSuperficie(radio);

        this.setupFigura();
    }

    setupFigura() {
        this.mallaDeTriangulos = setupBuffersSuperficie(this.superficieElemental, this.filas, this.columnas,this.textura.getEscala());
    }

}

class CilindroSinTapas extends Objeto3D {

    constructor(radio = 1, alto = 5, color = RGB(0,0,250),textura = new TexturaVacia()) {

        super();

        this.radio = radio;
        this.alto = alto;
        this.color = color;
        this.textura = textura;

        this.superficieElemental = new CilindroSinTapasSuperficie(radio, alto);

        this.setupFigura();
    }

    setupFigura() {

        this.mallaDeTriangulos = setupBuffersSuperficie(this.superficieElemental, this.filas, this.columnas,this.textura.getEscala());
    }

}

class Cilindro extends Objeto3D {

    constructor(radio = 1, alto = 5, color = RGB(0,0,250),textura = new TexturaVacia()) {

        super();

        this.radio = radio;
        this.alto = alto;
        this.color = color;
        this.textura = textura;

        this.superficieElemental = null;
        
        this.setupFigura();
    }

    setupFigura() {

        this.mallaDeTriangulos = null;

        var circuloSuperior = new Circulo(this.radio,this.color,this.textura);
        circuloSuperior.trasladar(0,this.alto/2,0);

        var circuloInferior = new Circulo(this.radio,this.color,this.textura);
        circuloInferior.escalar(1,-1,1);
        circuloInferior.trasladar(0,this.alto/2,0);

        var cilindroSinTapa = new CilindroSinTapas(this.radio, this.alto, this.color,this.textura);
        cilindroSinTapa.agregarHijo(circuloSuperior);
        cilindroSinTapa.agregarHijo(circuloInferior);
        
        this.agregarHijo(cilindroSinTapa);
    }
}

class Ejes extends Objeto3D {

    constructor(tamaño = 1, colorZ= RGB(250,0,0),colorX = RGB(0,250,0),colorY = RGB(0,0,250)) {
-
        super();

        this.tamaño = tamaño;

        this.colorZ = colorZ;
        this.colorX = colorX;
        this.colorY = colorY;

        this.setupFigura();
    }

    setupFigura() {

        this.mallaDeTriangulos = null;
        var ejeZ = new Cubo(1,this.colorZ); 
        ejeZ.escalar(0.05,0.05,this.tamaño);
        ejeZ.trasladar(0,0,this.tamaño/(2.0*this.tamaño));
        this.hijos.push(ejeZ);
        var ejeX = new Cubo(1,this.colorX); 
        ejeX.escalar(this.tamaño,0.05,0.05);
        ejeX.trasladar(this.tamaño/(2.0*this.tamaño),0,0);
        this.hijos.push(ejeX);
        var ejeY = new Cubo(1,this.colorY); 
        ejeY.escalar(0.05,this.tamaño,0.05);
        ejeY.trasladar(0,this.tamaño/(2.0*this.tamaño),0);
        this.hijos.push(ejeY);
    }
}


class CuadradoSuperficie {

    constructor(lado) {
        this.lado = lado;
    }

    getPosicion(u,v){

        var z = (u - 0.5) * this.lado;
        var x = (v - 0.5) * this.lado;
        var y = 0.0;
        
        return [x,y,z];
    }

    getNormal(u,v){
        return [0,1,0];
    }

    getCoordenadasTextura(u,v){
        return [u,v];
    }
}

class CilindroSinTapasSuperficie {
    
    constructor(radio, alto) {

        this.radio = radio;
        this.alto = alto;
    }
    
    getPosicion(u,v){

        var z = Math.cos(2*u*Math.PI) * this.radio;
        var x = Math.sin(2*u*Math.PI) * this.radio;
        var y = (v-0.5) * this.alto;
        
        return vec3.fromValues(x,y,z);
    }

    getNormal(u,v){
        var posicion = this.getPosicion(u,v);
        posicion[1]= 0;
        vec3.normalize(posicion,posicion);
        return posicion;
    }

    getCoordenadasTextura(u,v){
        return [u,v];
    }
}

class CirculoSuperficie {

    constructor(radio) {

        this.radio = radio;
    }
    
    getPosicion(u,v){

        var z = Math.cos(2*u*Math.PI) * Math.sin(2*v*Math.PI) * this.radio;
        var x = Math.sin(2*u*Math.PI) * Math.sin(2*v*Math.PI) * this.radio;
        var y = 0;
        
        return [x,y,z];
    }

    getNormal(u,v){

        return [0,1,0];
    }

    getCoordenadasTextura(u,v){
        
        return [u,v];
    }

}

function setupBuffersSuperficie(superficie, filas, columnas,escalaTextura){

    var positionBuffer = [];
	var normalBuffer = [];
	var uvBuffer = [];

	for (var i=0; i <= filas; i++) {
		
        for (var j=0; j <= columnas; j++) {

			var u=j/columnas;
			var v=i/filas;

			var pos = superficie.getPosicion(u,v);

			positionBuffer.push(pos[0]);
			positionBuffer.push(pos[1]);
			positionBuffer.push(pos[2]);

			var nrm = superficie.getNormal(u,v);

			normalBuffer.push(nrm[0]);
			normalBuffer.push(nrm[1]);
			normalBuffer.push(nrm[2]);

            var uvs = superficie.getCoordenadasTextura(u,v);

            uvBuffer.push(uvs[0]*escalaTextura[0]);
            uvBuffer.push(uvs[1]*escalaTextura[1]);
		}
	}

	var indexBuffer = [];

	for (i=0; i < filas; i++) {
		
        for (j=0; j < columnas; j++) {

			indexBuffer.push(i*(columnas+1)+j);
			indexBuffer.push((i+1)*(columnas+1)+j);
		}

		indexBuffer.push((i)*(columnas+1)+columnas);
		indexBuffer.push((i+1)*(columnas+1)+columnas);

		if(i != filas-1){
			indexBuffer.push((i+1)*(columnas+1)+columnas);
			indexBuffer.push((i+1)*(columnas+1));
		}
	}
	
    var webgl_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionBuffer), gl.STATIC_DRAW);
    webgl_position_buffer.itemSize = 3;
    webgl_position_buffer.numItems = positionBuffer.length / 3;

    var webgl_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalBuffer), gl.STATIC_DRAW);
    webgl_normal_buffer.itemSize = 3;
    webgl_normal_buffer.numItems = normalBuffer.length / 3;

    var webgl_uvs_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvBuffer), gl.STATIC_DRAW);
    webgl_uvs_buffer.itemSize = 2;
    webgl_uvs_buffer.numItems = uvBuffer.length / 2;

    var webgl_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexBuffer), gl.STATIC_DRAW);
    webgl_index_buffer.itemSize = 1;
    webgl_index_buffer.numItems = indexBuffer.length;

    return {
        webgl_position_buffer,
        webgl_normal_buffer,
        webgl_uvs_buffer,
        webgl_index_buffer
    }
}


