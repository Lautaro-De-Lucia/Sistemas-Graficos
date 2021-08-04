class Tobogan {

    constructor(posicion =[30,0,-20],alturaSeccion = 3,ancho = 1,color =RGB(200,200,200),niveles=5){

        this.posicion = posicion;
        this.alturaSeccion = alturaSeccion;
        this.ancho = ancho;
        this.color = color;
        this.niveles = niveles;
        this.tobogan = new Objeto3D();
        this.generarTobogan();

    }

    generarTobogan(){
        for(var i = 0; i < this.niveles; i++){
            var nuevaSeccion = new SeccionTobogan(this.alturaSeccion,this.ancho,this.color);
            nuevaSeccion.trasladar(0,this.alturaSeccion*i,0);
            this.tobogan.agregarHijo(nuevaSeccion);
        }
    }

    limpiarTobogan(){
        for(var i = 0; i < this.niveles; i++)
            this.tobogan.quitarHijo();
    }

    setNiveles(niveles){
        if(this.niveles == niveles)
            return;
        this.limpiarTobogan();
        this.niveles = niveles;
        this.generarTobogan();    
    }

    agregarALaEscena(objetos){
        this.tobogan.trasladar(this.posicion[0],this.posicion[1],this.posicion[2]);
        objetos.push(this.tobogan);
    }

}

class SeccionTobogan extends Objeto3D {

    constructor(alturaSeccion,ancho,color,textura = new TexturaVacia()){
        
        super();

        this.alturaSeccion = alturaSeccion;
        this.ancho = ancho;
        this.color = color;
        this.textura = textura;

        this.superFicieDeBarrido = null;
        
        this.cargarSeccion();

        this.trasladar(0,2,0);
    }

    cargarSeccion(){

        var soporte1 = new Cilindro(this.ancho/4,2,RGB(100,60,30),new Textura(URLsTexturas.get("madera")));
        soporte1.escalar(1,this.alturaSeccion,1);
        soporte1.trasladar(this.ancho,1/this.alturaSeccion,0);
        var soporte2 = new Cilindro(this.ancho/4,2,RGB(100,60,30),new Textura(URLsTexturas.get("madera")));
        soporte2.escalar(1,this.alturaSeccion,1);
        soporte2.trasladar(-this.ancho,1/this.alturaSeccion, 0);

        this.agregarHijo(soporte1);
        this.agregarHijo(soporte2);

        var formaTobogan = new BezierCubica();
        formaTobogan.cargarPuntosDeControl(this.obtenerPCsForma());
        var ToboganDeltaForm = 0.01;

        var BarridoTobogan = new multiplesBezierCuadratica();
        BarridoTobogan.cargarPuntosDeControl(this.obtenerPCsRecorrido());
        var ToboganDeltaSweep = 0.01;

        this.superficieDeBarridoTobogan = new SuperficieTobogan(formaTobogan,BarridoTobogan,ToboganDeltaForm,ToboganDeltaSweep);
        this.mallaDeTriangulos = this.superficieDeBarridoTobogan.setupBuffersBarrido();

    }
    
    obtenerPCsRecorrido(){
        
        var puntosDeControl = [];
        var alturaSeccion = this.alturaSeccion;
        var ancho = this.ancho;
        
        //Se "dibuja" la curva con la forma que se necesite
        puntosDeControl.push(vec3.fromValues(2*ancho,alturaSeccion-0*alturaSeccion/12,0*ancho));
        puntosDeControl.push(vec3.fromValues(2*ancho,alturaSeccion-1*alturaSeccion/12,-1*ancho));
        puntosDeControl.push(vec3.fromValues(1*ancho,alturaSeccion-2*alturaSeccion/12,-1*ancho));
        puntosDeControl.push(vec3.fromValues(0*ancho,alturaSeccion-3*alturaSeccion/12,-1*ancho));
        puntosDeControl.push(vec3.fromValues(-1*ancho,alturaSeccion-4*alturaSeccion/12,-1*ancho));
        puntosDeControl.push(vec3.fromValues(-2*ancho,alturaSeccion-5*alturaSeccion/12,-1*ancho));
        puntosDeControl.push(vec3.fromValues(-2*ancho,alturaSeccion-6*alturaSeccion/12,0*ancho));
        puntosDeControl.push(vec3.fromValues(-2*ancho,alturaSeccion-7*alturaSeccion/12,1*ancho));
        puntosDeControl.push(vec3.fromValues(-1*ancho,alturaSeccion-8*alturaSeccion/12,1*ancho));
        puntosDeControl.push(vec3.fromValues(0*ancho,alturaSeccion-9*alturaSeccion/12,1*ancho));
        puntosDeControl.push(vec3.fromValues(1*ancho,alturaSeccion-10*alturaSeccion/12,1*ancho));
        puntosDeControl.push(vec3.fromValues(2*ancho,alturaSeccion-11*alturaSeccion/12,1*ancho));
        puntosDeControl.push(vec3.fromValues(2*ancho,alturaSeccion-12*alturaSeccion/12,0*ancho));

        return puntosDeControl;
    }

    obtenerPCsForma(){

        var puntosDeControl = [];
        var anchoForma = this.ancho/4; 
        
        puntosDeControl.push(vec3.fromValues(-2*anchoForma,0,2*anchoForma));
        puntosDeControl.push(vec3.fromValues(-1*anchoForma,0,-2*anchoForma));
        puntosDeControl.push(vec3.fromValues(+1*anchoForma,0,-2*anchoForma));
        puntosDeControl.push(vec3.fromValues(+2*anchoForma,0,2*anchoForma));

        return puntosDeControl;
    }

}

class SuperficieTobogan extends SuperficieBarrido {

    constructor(forma, barrido, dF, dB) {

        super(forma, barrido, dF, dB);
    }

    agregarVerticesSuperficie() {

        var verticesPorNivel = this.perimetro.posiciones.length - 1;
        
        for (let i = 0; i < this.niveles; i++) {

            var matrizDeNivel = this.obtenerMatrizDeNivel(i);
            
            for (let j = 0; j < verticesPorNivel; j++) {

                var posicion3D = vec3.clone(this.perimetro.posiciones[j]);
                var normal3D = vec3.clone(this.perimetro.normales[j]);
                var uv = vec2.fromValues(0,0);
                var posicion4D = vec4.fromValues(posicion3D[0], posicion3D[1], posicion3D[2], 1.0);
                var normal4D = vec4.fromValues(normal3D[0], normal3D[1], normal3D[2], 1.0);

                vec4.transformMat4(posicion4D, posicion4D, matrizDeNivel);
                vec4.transformMat4(normal4D, normal4D, matrizDeNivel);

                posicion3D = vec3.fromValues(posicion4D[0], posicion4D[1], posicion4D[2]);
                normal3D = vec3.fromValues(normal4D[0], normal4D[1], normal4D[2]);
                
                this.bufferPosicion.push(posicion3D[0]);
                this.bufferPosicion.push(posicion3D[1]);
                this.bufferPosicion.push(posicion3D[2]);
                this.bufferNormal.push(normal3D[0]);
                this.bufferNormal.push(normal3D[1]);
                this.bufferNormal.push(normal3D[2]);
                this.bufferUV.push(uv[0]);
                this.bufferUV.push(uv[1]);

            }

        }
    }

    generarIndexBuffer() {

        var verticesPorNivel = this.perimetro.posiciones.length - 1;

        for (let nivel = 0; nivel < this.niveles; nivel+=2) {
            
            for (let punto = 0; punto < verticesPorNivel; punto++) {
                
                this.indexBuffer.push((((nivel+0)*verticesPorNivel)+punto));
                this.indexBuffer.push((((nivel+1)*verticesPorNivel)+punto));
            }

            if(nivel < this.niveles - 2) {

                for (let punto = verticesPorNivel-1; punto >= 0; punto--) {

                    this.indexBuffer.push((((nivel+1)*verticesPorNivel)+punto));
                    this.indexBuffer.push((((nivel+2)*verticesPorNivel)+punto));
                }
            }
        }        
    }

    setupBuffersBarrido(){

        this.agregarVerticesSuperficie();
        this.generarIndexBuffer();

        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferPosicion), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = this.bufferPosicion.length / 3;
    
        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferNormal), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.bufferNormal.length / 3;
    
        var webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferUV), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = this.bufferUV.length / 2;
    
        var webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);
        webgl_index_buffer.itemSize = 1;
        webgl_index_buffer.numItems = this.indexBuffer.length;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
            webgl_uvs_buffer,
            webgl_index_buffer
        }
    }
}