class Edificio {
    constructor(posicion = [30,0,0],numPisosT1=5,numPisosT2=5,alturaBase = 2,ventanasAncho = 10,ventanasLargo = 10,tamañoVentana=1.5,cantidadColumnas=4,colorBase = RGB(200,200,200),colorVentana = RGB(170,220,230),colorLosa = RGB(160,160,160),colorColumnas = RGB(150,150,150)) {

        this.posicion = posicion;
        this.numPisosT1 = numPisosT1;
        this.numPisosT2 = numPisosT2;
        this.alturaBase = alturaBase;
        this.ventanasAncho = ventanasAncho;
        this.ventanasLargo = ventanasLargo;
        this.tamañoVentana = tamañoVentana;
        this.cantidadColumnas = cantidadColumnas;
        this.colorBase = colorBase;
        this.colorVentana = colorVentana;
        this.colorLosa = colorLosa;
        this.colorColumnas= colorColumnas;
        this.edificio = new Objeto3D();

        this.generarPuntosDeControl();
        this.generarEdificio();
    }

    generarEdificio(){

        var base = new Cubo(1,this.colorBase,new Textura(URLsTexturas.get("concreto")));
            base.trasladar(this.posicion[0],this.posicion[1]+(this.alturaBase)/2,this.posicion[2]);
            base.escalar(this.ventanasAncho*this.tamañoVentana,this.alturaBase,this.ventanasLargo*this.tamañoVentana);

        var ascensor = new Cubo(1,this.colorBase,new Textura(URLsTexturas.get("concreto")));
            var alturaPiso = (this.tamañoVentana+this.tamañoVentana/5);
            var alturaEdificio = this.alturaBase+alturaPiso*(this.numPisosT1+this.numPisosT2);
            ascensor.trasladar(this.posicion[0],this.posicion[1]+alturaEdificio/2+alturaPiso,this.posicion[2]);
            ascensor.escalar(this.ventanasAncho/2.1,alturaEdificio,this.ventanasLargo/2.1);

        this.edificio.agregarHijo(base);
        this.edificio.agregarHijo(ascensor);
        
        for(var i = 0; i < this.numPisosT1 ; i++){
            var nuevoPiso = new Piso(this.ventanasAncho,this.ventanasLargo,this.tamañoVentana,this.cantidadColumnas,this.puntosDeControlVentanasT1,this.puntosDeControlLosaT1,this.colorVentana,this.colorLosa,this.colorColumnas,new TexturaVacia());
            nuevoPiso.trasladar(0,nuevoPiso.obtenerAltura()*i+this.alturaBase,0);
            nuevoPiso.trasladar(this.posicion[0],this.posicion[1],this.posicion[2]);
            this.edificio.agregarHijo(nuevoPiso);
        }      
        for(var i = this.numPisosT1; i < this.numPisosT1+this.numPisosT2 ; i++){
            var nuevoPiso = new Piso(this.ventanasAncho-2,this.ventanasLargo-2,this.tamañoVentana,this.cantidadColumnas,this.puntosDeControlVentanasT2,this.puntosDeControlLosaT2,this.colorVentana,this.colorLosa,this.colorColumnas,new TexturaVacia());
            nuevoPiso.trasladar(0,nuevoPiso.obtenerAltura()*i+this.alturaBase,0);
            nuevoPiso.trasladar(this.posicion[0],this.posicion[1],this.posicion[2]);
            this.edificio.agregarHijo(nuevoPiso);
        }

        easterEgg2 = new Cubo(0.8,this.colorBase,new Textura(URLsTexturas.get("astronauta")));
        easterEgg2.trasladar(this.posicion[0],this.posicion[1]+this.alturaBase+(this.tamañoVentana+this.tamañoVentana/5)*(this.numPisosT1+this.numPisosT2)+3*this.tamañoVentana/4,this.posicion[2]);
        this.edificio.agregarHijo(easterEgg2);

    }


    limpiarEdificio(){
        //quitamos los pisos
        for(var i = 0; i<this.numPisosT1+this.numPisosT2;i++)
            this.edificio.quitarHijo();
        //quitamos el ascensor y la base
        this.edificio.quitarHijo();    
        this.edificio.quitarHijo();
        this.edificio.quitarHijo(); //Y el easter egg :/
    }

    generarPuntosDeControl(){
        this.puntosDeControlVentanasT1 = this.obtenerPuntosDeControlVentanas(this.ventanasAncho,this.ventanasLargo,this.tamañoVentana);
        this.puntosDeControlLosaT1 = this.obtenerPuntosDeControlLosa(this.ventanasAncho,this.ventanasLargo,this.tamañoVentana);
        this.puntosDeControlVentanasT2 = this.obtenerPuntosDeControlVentanas(this.ventanasAncho-2,this.ventanasLargo-2,this.tamañoVentana);
        this.puntosDeControlLosaT2 = this.obtenerPuntosDeControlLosa(this.ventanasAncho-2,this.ventanasLargo-2,this.tamañoVentana);
    }

    setVentanasALoAncho(ventanasAncho){
        if(this.ventanasAncho==ventanasAncho)
            return;
        this.limpiarEdificio();
        this.ventanasAncho =ventanasAncho;
        this.generarPuntosDeControl();
        this.generarEdificio();
    }
    
    setVentanasALoLargo(ventanasLargo){
        if(this.ventanasLargo==ventanasLargo)
            return;
        this.limpiarEdificio();
        this.ventanasLargo =ventanasLargo;
        this.generarPuntosDeControl();
        this.generarEdificio();
    }

    setPisosInferiores(pisos){
        if(this.numPisosT1==pisos)
            return;
        this.limpiarEdificio();
        this.numPisosT1 =pisos;
        this.generarEdificio();
    }

    setPisosSuperiores(pisos){
        if(this.numPisosT2==pisos)
            return;
        this.limpiarEdificio();
        this.numPisosT2 =pisos;
        this.generarEdificio();
    }

    setCantidadDeColumnas(columnas){
        if(this.cantidadColumnas==columnas)
            return;
        this.limpiarEdificio();
        this.cantidadColumnas =columnas;
        this.generarEdificio();
    }

    escalar(X,Y,Z){
        this.edificio.escalar(X,Y,Z);
    }

    obtenerPuntosDeControlVentanas(ventanasAncho,ventanasLargo,tamañoVentana){

        var puntosDeControl = [];

        for (var ancho = -ventanasAncho/2; ancho < ventanasAncho/2; ancho++) 
            puntosDeControl.push(vec3.fromValues(ancho*tamañoVentana,0,ventanasLargo*tamañoVentana/2));        
        for (var largo = ventanasLargo/2; largo > -ventanasLargo/2; largo--) 
            puntosDeControl.push(vec3.fromValues(ventanasAncho*tamañoVentana/2,0,largo*tamañoVentana));        
        for (var ancho = ventanasAncho/2; ancho > -ventanasAncho/2; ancho--) 
            puntosDeControl.push(vec3.fromValues(ancho*tamañoVentana,0,-ventanasLargo*tamañoVentana/2));        
        for (var largo = -ventanasLargo/2; largo < ventanasLargo/2; largo++) 
            puntosDeControl.push(vec3.fromValues(-ventanasAncho*tamañoVentana/2,0,largo*tamañoVentana));        
    
        return puntosDeControl;
    }

    obtenerPuntosDeControlLosa(ventanasAncho,ventanasLargo,tamañoVentana){
        
        var puntosDeControl = [];

        var minRandom = 0.5;
        var maxRandom = 1.5;
        var randomEsquina = 2.0;
    
        for (var ancho = -ventanasAncho/2; ancho < ventanasAncho/2; ancho++) {
            
            var nuevoPDC = vec3.fromValues(ancho*tamañoVentana,0,ventanasLargo*tamañoVentana/2);

            if(ancho == -ventanasAncho/2) {
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(-randomEsquina,0,randomEsquina));
            } else {
                var variacion = getRandom(minRandom,maxRandom);
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(0,0,variacion * tamañoVentana));
            }
            
            puntosDeControl.push(nuevoPDC);
        }
    
        for (var largo = ventanasLargo/2; largo > -ventanasLargo/2; largo--) {
            
            var nuevoPDC = vec3.fromValues(ventanasAncho*tamañoVentana/2,0,largo*tamañoVentana);
            
            if(largo == ventanasLargo/2) {
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(randomEsquina,0,randomEsquina));
            } else {
                var variacion = getRandom(minRandom,maxRandom);
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(variacion * tamañoVentana,0,0));      
            }
    
            puntosDeControl.push(nuevoPDC);
        }
    
        for (var ancho = ventanasAncho/2; ancho > -ventanasAncho/2; ancho--) {
            
            var nuevoPDC = vec3.fromValues(ancho*tamañoVentana,0,-ventanasLargo*tamañoVentana/2);
            
            if(ancho == ventanasAncho/2) {
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(randomEsquina,0,-randomEsquina));
            } else {
                var variacion = getRandom(minRandom,maxRandom);
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(0,0,-variacion * tamañoVentana));        
            }
            
            puntosDeControl.push(nuevoPDC);
        }
    
        for (var largo = -ventanasLargo/2; largo < ventanasLargo/2; largo++) {
            
            var nuevoPDC = vec3.fromValues(-ventanasAncho*tamañoVentana/2,0,largo*tamañoVentana);
            
            if(largo == -ventanasLargo/2) {
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(-randomEsquina,0,-randomEsquina));
            }  else {
                var variacion = getRandom(minRandom,maxRandom);
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(-variacion * tamañoVentana,0,0));        
            }
            
            puntosDeControl.push(nuevoPDC);
        }
    
        return puntosDeControl;

    }

    agregarALaEscena(escena){
        escena.push(this.edificio);
    }

}

class Piso extends Objeto3D {
    constructor(ventanasAncho, ventanasLargo,tamañoVentana,cantidadcolumnas,puntosDeControlVentanas,puntosDeControlLosa,colorVentana,colorLosa,colorColumnas,textura = new TexturaVacia()) {
        super();
        this.puntosDeControlLosa = []; //Los necesito para las ventanas
        this.puntosDeControlVentanas = []; //Los necesito para la losa
        this.ventanasAncho = ventanasAncho; 
        this.ventanasLargo = ventanasLargo; 
        this.numPuntosDeControl = ventanasAncho * ventanasLargo;
        this.tamañoVentana = tamañoVentana;
        this.alturaLosa = tamañoVentana/5;
        this.cantidadcolumnas = cantidadcolumnas;
        this.puntosDeControlVentanas = puntosDeControlVentanas;
        this.puntosDeControlLosa = puntosDeControlLosa;
        this.colorVentana = colorVentana;
        this.colorLosa = colorLosa;
        this.colorColumnas = colorColumnas;
        this.textura = textura;
        this.generarPiso();
    }

    obtenerAltura(){
        return this.tamañoVentana+this.alturaLosa;
    }

    generarPiso() {

    //Creamos la Losa
        //Escablecemos la contorno
        var contorno = new BSplineCuadraticaCerrada();
        contorno.cargarPuntosDeControl(this.puntosDeControlLosa);
        contorno.setCentro(vec3.fromValues(0,0,0));
        //Generamos las losas
        var losaInferior = new Losa(contorno,this.alturaLosa,this.colorLosa,new Textura(URLsTexturas.get("baldosas")));
        var losaSuperior = new Losa(contorno,this.alturaLosa,this.colorLosa,new Textura(URLsTexturas.get("baldosas")));
        losaSuperior.trasladar(0,this.tamañoVentana+this.alturaLosa,0);
        //La agregamos al piso
        this.agregarHijo(losaInferior);
        this.agregarHijo(losaSuperior);

    //Creamos las Ventanas
        //Generamos el objeto contenedor de ventanas
        var ventanas = new Objeto3D();

        //Instanciamos individualmente cada ventana
        for (var i = 0; i < this.puntosDeControlVentanas.length; i++) {

            //Obtenemos los puntos de control entre los que está la ventana i
            var cp1 = this.puntosDeControlVentanas[i];
            var cp2;
            
            if(i == this.puntosDeControlVentanas.length - 1) 
                cp2 = this.puntosDeControlVentanas[0];
            else 
                cp2 = this.puntosDeControlVentanas[i+1];
                        

            var posicionVentana = vec3.create();
            //Tomamos el punto medio entre los dos puntos de control
            vec3.add(posicionVentana, cp1, cp2); 
            vec3.scale(posicionVentana, posicionVentana, 1/2);
            //Le sumamos la altura en Y 
            vec3.add(posicionVentana, posicionVentana, vec3.fromValues(0,this.tamañoVentana/2+this.alturaLosa,0));

            //Generamos la Ventana
            var ventana = new Cuadrado(this.tamañoVentana,this.colorVentana,new Textura(URLsTexturas.get("vidrio")));

            //La colocamos en posición
            ventana.trasladar(posicionVentana[0], posicionVentana[1], posicionVentana[2]);

            //La rotamos en la direccion correspondiente
            //Segun si nos encontramos en el lado ancho o largo del edificio
            var rotarX = false;
            var rotarZ = false;

            if(cp1[0] == cp2[0]) 
                rotarZ = true;
            else 
                rotarX = true;
            
            ventana.rotar(rotarX*Math.PI/2, 0, rotarZ*Math.PI/2);

            //Tambien invierto la normal según en que posicion estoy
            if(posicionVentana[0] == (this.tamañoVentana * this.ventanasAncho / 2)) 
                ventana.escalar(1,-1,1);
            else if(posicionVentana[2] == -(this.tamañoVentana * this.ventanasLargo / 2)) 
                ventana.escalar(1,-1,1);
            

            ventanas.agregarHijo(ventana);
        }
    //Agregamos las ventanas
        this.agregarHijo(ventanas);
    //Creamos las columnas
        var dC = 1/this.cantidadcolumnas;
        var dN = 1.0;
        var posicionesColumnas = this.getPosicionesColumnas(contorno, dC, dN);

        var columnas = new Objeto3D();

        for (var i = 0; i < posicionesColumnas.length; i++) {

            var columna = new Cilindro(0.2,this.tamañoVentana,this.colorColumnas,new Textura(URLsTexturas.get("concreto")));

            columna.trasladar(posicionesColumnas[i][0], posicionesColumnas[i][1], posicionesColumnas[i][2]);
            columna.trasladar(0,this.tamañoVentana/2+this.alturaLosa,0);
            columnas.agregarHijo(columna);
        }

        this.agregarHijo(columnas);

    }
    
    getPosicionesColumnas(contorno, dC, dN) {

        var posicionesColumnas = [];

        for (var u = 0; u < 1; u+=dC) {
            
            var contornoPosicion = contorno.getPosicion(u);
            var contornoNormal = contorno.getNormal(u);

            var posicion = vec3.create();
            var normal = vec3.create();
            
            vec3.scale(normal, contornoNormal, dN);
            vec3.add(posicion, contornoPosicion, normal);
            posicionesColumnas.push(posicion);
        }

        return posicionesColumnas;
    }
}

class Losa extends Objeto3D {

    constructor(figuraLosa,alturaLosa=0.2,color=RGB(100,100,100),textura = new TexturaVacia()) {

        super(); 

        this.color = color;
        this.alturaLosa = alturaLosa;
        this.textura = textura;

        this.superficieBarrido = null;

        this.figuraLosa = figuraLosa;
        this.initializeObject();
    }

    initializeObject() {

        var barridoLosa = new SegmentoRectilineo();
        barridoLosa.setPuntosDeControl([0,0,0], [0,this.alturaLosa,0]);

        var difFiguraLosa = 0.01;
        var difBarrido = 0.5;

        this.superficieBarrido = new SuperficieLosa(this.figuraLosa, barridoLosa, difFiguraLosa, difBarrido);

        this.mallaDeTriangulos = this.superficieBarrido.setupBuffersBarrido();
    }
}


class SuperficieLosa extends SuperficieBarrido {

    constructor(forma, barrido, dF, dB) {
        super(forma, barrido, dF, dB);
    }

    agregarVerticesTapaInferior() {

        var verticesPorNivel = this.perimetro.posiciones.length;

        var centroInferior = this.barrido.getPosicion(0);
        var normalInferior = this.barrido.getTangente(0);
        vec3.scale(normalInferior, normalInferior, -1); 
        var uv = vec2.fromValues(0,0);

        var matrizDeNivel = this.obtenerMatrizDeNivel(0);

        for (let j = 0; j < verticesPorNivel; j++) {

            var posicion3D = vec3.clone(this.perimetro.posiciones[j]);
            
            var uv = vec2.fromValues(this.perimetro.posiciones[j][0]/5,this.perimetro.posiciones[j][2]/5);

            var posicion4D = vec4.fromValues(posicion3D[0], posicion3D[1], posicion3D[2], 1);

            vec4.transformMat4(posicion4D, posicion4D, matrizDeNivel);

            posicion3D = [posicion4D[0], posicion4D[1], posicion4D[2]];
            
            this.bufferPosicion.push(posicion3D[0]);
            this.bufferPosicion.push(posicion3D[1]);
            this.bufferPosicion.push(posicion3D[2]);
            this.bufferNormal.push(normalInferior[0]);
            this.bufferNormal.push(normalInferior[1]);
            this.bufferNormal.push(normalInferior[2]);
            this.bufferUV.push(uv[0]);
            this.bufferUV.push(uv[1]);
        }

        this.bufferPosicion.push(centroInferior[0]);
        this.bufferPosicion.push(centroInferior[1]);
        this.bufferPosicion.push(centroInferior[2]);

        this.bufferNormal.push(normalInferior[0]);
        this.bufferNormal.push(normalInferior[1]);
        this.bufferNormal.push(normalInferior[2]);

        this.bufferUV.push(uv[0]);
        this.bufferUV.push(uv[1]);

    }


    agregarVerticesSuperficie() {

        var verticesPorNivel = this.perimetro.posiciones.length;
        
        for (let i = 0; i < this.niveles; i++) {

            var matrizDeNivel = this.obtenerMatrizDeNivel(i);
            
            for (let j = 0; j < verticesPorNivel; j++) {

                var posicion3D = vec3.clone(this.perimetro.posiciones[j]);
                var normal3D = vec3.clone(this.perimetro.normales[j]);
                
                var uv = vec2.fromValues(this.perimetro.posiciones[j][0]/5,this.perimetro.posiciones[j][2]/5);

                var posicion4D = vec4.fromValues(posicion3D[0], posicion3D[1], posicion3D[2], 1);
                var normal4D = vec4.fromValues(normal3D[0], normal3D[1], normal3D[2], 1);

                vec4.transformMat4(posicion4D, posicion4D, matrizDeNivel);
                vec4.transformMat4(normal4D, normal4D, matrizDeNivel);

                posicion3D = [posicion4D[0], posicion4D[1], posicion4D[2]];
                normal3D = [normal4D[0], normal4D[1], normal4D[2]];

                vec3.scale(normal3D,normal3D,-1);
                vec3.normalize(normal3D,normal3D);
                
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

    agregarVerticesTapaSuperior() {

        var verticesPorNivel = this.perimetro.posiciones.length;
        var matrizDeNivel = this.obtenerMatrizDeNivel(this.niveles-1);

        var centroSuperior = this.barrido.getPosicion(1);
        var normalSuperior = this.barrido.getTangente(1);
        var uv = vec2.fromValues(0,0);

        for (let j = 0; j < verticesPorNivel; j++) {

            var posicion3D = vec3.clone(this.perimetro.posiciones[j]);
            
            var uv = vec2.fromValues(this.perimetro.posiciones[j][0]/5,this.perimetro.posiciones[j][2]/5);

            var posicion4D = vec4.fromValues(posicion3D[0], posicion3D[1], posicion3D[2], 1);

            vec4.transformMat4(posicion4D, posicion4D, matrizDeNivel);

            posicion3D = [posicion4D[0], posicion4D[1], posicion4D[2]];
            
            this.bufferPosicion.push(posicion3D[0]);
            this.bufferPosicion.push(posicion3D[1]);
            this.bufferPosicion.push(posicion3D[2]);
            this.bufferNormal.push(normalSuperior[0]);
            this.bufferNormal.push(normalSuperior[1]);
            this.bufferNormal.push(normalSuperior[2]);
            this.bufferUV.push(uv[0]);
            this.bufferUV.push(uv[1]);
        }

        this.bufferPosicion.push(centroSuperior[0]);
        this.bufferPosicion.push(centroSuperior[1]);
        this.bufferPosicion.push(centroSuperior[2]);

        this.bufferNormal.push(normalSuperior[0]);
        this.bufferNormal.push(normalSuperior[1]);
        this.bufferNormal.push(normalSuperior[2]);

        this.bufferUV.push(0.0);
        this.bufferUV.push(0.0);
    }

    generarIndexBuffer() {

        var indiceTapaInferior = 0;
        var indiceTapaSuperior = (this.bufferPosicion.length/3)-1;

        var verticesPorNivel = this.perimetro.posiciones.length;

        for (let i = 1; i < verticesPorNivel+1; i++) {
            this.indexBuffer.push(indiceTapaInferior);
            this.indexBuffer.push(i); 
        }

        for (let punto = 0; punto < verticesPorNivel; punto++) {
            this.indexBuffer.push((1+(0+0)*verticesPorNivel)+punto);
            this.indexBuffer.push((1+(0+1)*verticesPorNivel)+punto);
        }
        this.indexBuffer.push(1+((0+1)*verticesPorNivel)+0);

        for (let nivel = 0; nivel < this.niveles; nivel++) {
            for (let punto = 0; punto < verticesPorNivel; punto++) {
                this.indexBuffer.push((1+(nivel+0+1)*verticesPorNivel)+punto);
                this.indexBuffer.push((1+(nivel+1+1)*verticesPorNivel)+punto);
            }
            this.indexBuffer.push(1+((nivel+1)*verticesPorNivel)+0);
        }

        for (let punto = 0; punto < verticesPorNivel; punto++) {
            this.indexBuffer.push((1+(this.niveles-1+0)*verticesPorNivel)+punto);
            this.indexBuffer.push((1+(this.niveles+1)*verticesPorNivel)+punto);
        }

        this.indexBuffer.push(1+((this.niveles+1)*verticesPorNivel)+0);

        for (let i = 0; i < verticesPorNivel; i++) {
            this.indexBuffer.push(indiceTapaSuperior);
            this.indexBuffer.push((indiceTapaSuperior-verticesPorNivel)+i); 
        }
    }

    setupBuffersBarrido() {

        this.agregarVerticesSuperficie();
        this.agregarVerticesTapaInferior();
        this.agregarVerticesTapaSuperior();
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