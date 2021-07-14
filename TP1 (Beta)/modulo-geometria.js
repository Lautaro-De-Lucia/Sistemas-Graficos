
class Objeto3D {

    constructor(filas = 10, columnas = 20) {

        this.mallaDeTriangulos = null;
        this.matrizModelado = mat4.create();
        
        this.traslacion = vec3.fromValues(0,0,0); 
        this.rotacion = vec3.fromValues(0,0,0); 
        this.escala = vec3.fromValues(1,1,1); 

        this.posicionAcumulada = vec3.fromValues(0,0,0); 
        this.rotacionAcumulada = vec3.fromValues(0,0,0); 
        this.escalaAcumulada = vec3.fromValues(1,1,1); 
        
        this.hijos = [];

        this.filas = filas;
        this.columnas = columnas;;

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

    dibujar(matPadre) {

		var m = mat4.create();

		mat4.multiply(m, matPadre, this.matrizModelado); 

        if (this.mallaDeTriangulos){
			setShaderMatrix(m, this.color);
			dibujarMallaDeTriangulos(this.mallaDeTriangulos);
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

    setTraslacion(x, y, z) {
		vec3.set(this.traslacion, x, y, z);
        this.posicionAcumulada[0]+=x;
        this.posicionAcumulada[1]+=y;
        this.posicionAcumulada[2]+=z;
        this.actualizarMatrizModelado();
	}

	setRotacion(x, y, z) {
		vec3.set(this.rotacion, x, y, z);
        this.rotacionAcumulada[0]+=x;
        this.rotacionAcumulada[1]+=y;
        this.rotacionAcumulada[2]+=z;
        this.actualizarMatrizModelado();
	}

	setEscala(x, y, z) {
		vec3.set(this.escala, x, y, z);
        this.escalaAcumulada[0]*=x;
        this.escalaAcumulada[1]*=y;
        this.escalaAcumulada[2]*=z;
        this.actualizarMatrizModelado();
	}

    cambiarRotacionAcumulada(x,y,z){
        this.rotacionAcumulada[0]= x;
        this.rotacionAcumulada[1]= y;
        this.rotacionAcumulada[2]= z;
    }

}

function dibujarMallaDeTriangulos(mallaDeTriangulos){
	
    var modo = "edges";

    vertexPositionAttribute = gl.getAttribLocation(glProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, mallaDeTriangulos.webgl_position_buffer);
    gl.vertexAttribPointer(vertexPositionAttribute, mallaDeTriangulos.webgl_position_buffer.itemSize, gl.FLOAT, false, 0, 0);

    vertexNormalAttribute = gl.getAttribLocation(glProgram, "aVertexNormal");
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

function setShaderMatrix(mModelado, color){
    
    gl.useProgram(glProgram);

    var normalMatrix = glMatrix.mat4.clone(mModelado);
	mat4.invert(normalMatrix,normalMatrix);
	mat4.transpose(normalMatrix,normalMatrix);

    gl.uniformMatrix4fv(modelMatrixUniform, false, mModelado);
	gl.uniformMatrix4fv(normalMatrixUniform, false, normalMatrix);
	gl.uniform4fv(colorUniform, color);
}

class Cuadrado extends Objeto3D {

    constructor(filas = 10, columnas = 20, lado = 1, color = vec4.fromValues(1.0,1.0,0.0,1.0)) {

        super(filas, columnas);

        this.superficieElemental = new CuadradoSuperficie(lado);

        this.setupFigura();

        this.color = color;
    }

    setupFigura() {

        this.mallaDeTriangulos = setupBuffersSuperficie(this.superficieElemental, this.filas, this.columnas);
    }

}

class Cubo extends Objeto3D {

    constructor(filas = 10, columnas = 20, lado = 1, color = vec4.fromValues(1.0,1.0,0.0,1.0)) {

        super(filas, columnas);

        this.filas = filas;
        this.columnas = columnas;
        this.lado = lado;
        this.color = color;

        this.superficieElemental = new CuadradoSuperficie(lado);

        this.setupFigura();
    }

    setupFigura() {

        this.mallaDeTriangulos = null;

        var caraSuperior = new Cuadrado(this.filas,this.columnas,this.lado,this.color);
        caraSuperior.setTraslacion(0,this.lado/2,0.0);
        this.hijos.push(caraSuperior);
       
        var caraInferior = new Cuadrado(this.filas,this.columnas,this.lado,this.color);
        caraInferior.setTraslacion(0,-this.lado/2,0.0);
        this.hijos.push(caraInferior);

        var caraIzquierda = new Cuadrado(this.filas,this.columnas,this.lado,this.color);
        caraIzquierda.setRotacion(0,0,3.14/2.0);
        caraIzquierda.setTraslacion(0,-this.lado/2,0);
        this.hijos.push(caraIzquierda);

        var caraDerecha = new Cuadrado(this.filas,this.columnas,this.lado,this.color);
        caraDerecha.setRotacion(0,0,3.14/2.0);
        caraDerecha.setTraslacion(0,this.lado/2,0);
        this.hijos.push(caraDerecha);

        var caraFrente = new Cuadrado(this.filas,this.columnas,this.lado,this.color);
        caraFrente.setRotacion(3.14/2.0,0,0);
        caraFrente.setTraslacion(0,-this.lado/2,0);
        this.hijos.push(caraFrente);

        var caraDetras = new Cuadrado(this.filas,this.columnas,this.lado,this.color);
        caraDetras.setRotacion(3.14/2.0,0,0);
        caraDetras.setTraslacion(0,this.lado/2,0);
        this.hijos.push(caraDetras);
    }

    getLado() {
        
        return this.lado;
    }

}

class Circulo extends Objeto3D {

    constructor(filas = 10, columnas = 20, radio = 1, color = vec4.fromValues(1.0,0.0,0.0,1.0)) {

        super(filas, columnas);

        this.radio = radio;
        this.color = color;

        this.superficieElemental = new CirculoSuperficie(radio);

        
        
        this.setupFigura();
    }

    setupFigura() {

        this.mallaDeTriangulos = setupBuffersSuperficie(this.superficieElemental, this.filas, this.columnas);
    }

}

class CilindroSinTapas extends Objeto3D {

    constructor(filas = 10, columnas = 20, radio = 1, alto = 5, color = vec4.fromValues(0.0,0.0,1.0,1.0)) {

        super(filas, columnas);

        this.radio = radio;
        this.alto = alto;
        this.color = color;

        this.superficieElemental = new CilindroSinTapasSuperficie(radio, alto);

        this.setupFigura();
    }

    setupFigura() {

        this.mallaDeTriangulos = setupBuffersSuperficie(this.superficieElemental, this.filas, this.columnas);
    }

}

class Cilindro extends Objeto3D {

    constructor(filas = 10, columnas = 20, radio = 1, alto = 5, color = vec4.fromValues(0.0,0.0,1.0,1.0)) {

        super(filas, columnas);

        this.radio = radio;
        this.alto = alto;
        this.color = color;

        this.superficieElemental = null;
        
        this.setupFigura();
    }

    setupFigura() {

        this.mallaDeTriangulos = null;

        var circuloSuperior = new Circulo(this.filas,this.columnas,this.radio,this.color);
        circuloSuperior.setTraslacion(0,this.alto/2,0);

        var circuloInferior = new Circulo(this.filas,this.columnas,this.radio,this.color);
        circuloInferior.setEscala(1,-1,1);
        circuloInferior.setTraslacion(0,this.alto/2,0);

        var cilindroSinTapa = new CilindroSinTapas(this.filas, this.columnas, this.radio, this.alto, this.color);
        cilindroSinTapa.agregarHijo(circuloSuperior);
        cilindroSinTapa.agregarHijo(circuloInferior);
        
        this.agregarHijo(cilindroSinTapa);
    }
}

class Ejes extends Objeto3D {

    constructor(filas = 10, columnas = 20, tamaño = 1, colorZ= vec4.fromValues(1.0,0.0,0.0,1.0),colorX = vec4.fromValues(0.0,1.0,0.0,1.0),colorY = vec4.fromValues(0.0,0.0,1.0,1.0)) {

        super(filas, columnas);

        this.tamaño = tamaño;

        this.colorZ = colorZ;
        this.colorX = colorX;
        this.colorY = colorY;

        this.setupFigura();
    }

    setupFigura() {

        this.mallaDeTriangulos = null;
        var ejeZ = new Cubo(10,20,1,vec4.fromValues(1.0,0.0,0.0,1.0)); 
        ejeZ.setEscala(0.05,0.05,this.tamaño);
        ejeZ.setTraslacion(0,0,this.tamaño/(2.0*this.tamaño));
        this.hijos.push(ejeZ);
        var ejeX = new Cubo(10,20,1,vec4.fromValues(0.0,1.0,0.0,1.0)); 
        ejeX.setEscala(this.tamaño,0.05,0.05);
        ejeX.setTraslacion(this.tamaño/(2.0*this.tamaño),0,0);
        this.hijos.push(ejeX);
        var ejeY = new Cubo(10,20,1,vec4.fromValues(0.0,0.0,1.0,1.0)); 
        ejeY.setEscala(0.05,this.tamaño,0.05);
        ejeY.setTraslacion(0,this.tamaño/(2.0*this.tamaño),0);
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

    productoVectorial(v1, v2){
 
        var x = v1[1] * v2[2] - v1[2] * v2[1];
        var y = v1[2] * v2[0] - v1[0] * v2[2];
        var z = v1[0] * v2[1] - v1[1] * v2[0];

        return [x, y, z];
    }
    
    getPosicion(u,v){

        var z = Math.cos(2*u*Math.PI) * this.radio;
        var x = Math.sin(2*u*Math.PI) * this.radio;
        var y = (v-0.5) * this.alto;
        
        return [x,y,z];
    }

    getNormal(u,v){

        var du = 0.0001;
        var dv = 0.0001;
        var v1 = this.getPosicion(u + du, v);
        var v2 = this.getPosicion(u, v + dv);

        return this.productoVectorial(v1, v2);
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

function setupBuffersSuperficie(superficie, filas, columnas){
	
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

            uvBuffer.push(uvs[0]);
            uvBuffer.push(uvs[1]);
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