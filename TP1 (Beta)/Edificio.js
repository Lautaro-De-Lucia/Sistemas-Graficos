class Edificio {
    constructor(posicion = [30,0,0],numPisosT1=5,numPisosT2=5,ventanasAncho = 10,ventanasLargo = 10,tamañoVentana=2,cantidadColumnas=10,colorVentana = RGB(170,220,230),colorLosa = RGB(160,160,160),colorColumnas = RGB(150,150,150)) {

        this.posicion = posicion;
        this.numPisosT1 = numPisosT1;
        this.numPisosT2 = numPisosT2;
        this.ventanasAncho = ventanasAncho;
        this.ventanasLargo = ventanasLargo;
        this.tamañoVentana = tamañoVentana;
        this.cantidadColumnas = cantidadColumnas;
        this.colorVentana = colorVentana;
        this.colorLosa = colorLosa;
        this.colorColumnas= colorColumnas;
        this.edificio = new Objeto3D();

        this.generarPuntosDeControl();
        this.generarEdificio();
    }

    generarEdificio(){
        
        for(let i = 0; i < this.numPisosT1 ; i++){
            var nuevoPiso = new Piso(this.ventanasAncho,this.ventanasLargo,this.tamañoVentana,this.cantidadColumnas,this.puntosDeControlVentanasT1,this.puntosDeControlLosaT1,this.colorVentana,this.colorLosa,this.colorColumnas);
            nuevoPiso.trasladar(0,nuevoPiso.obtenerAltura()*i,0);
            nuevoPiso.trasladar(this.posicion[0],this.posicion[1],this.posicion[2]);
            this.edificio.agregarHijo(nuevoPiso);
        }      
        for(let i = this.numPisosT1; i < this.numPisosT1+this.numPisosT2 ; i++){
            var nuevoPiso = new Piso(this.ventanasAncho-2,this.ventanasLargo-2,this.tamañoVentana,this.cantidadColumnas,this.puntosDeControlVentanasT2,this.puntosDeControlLosaT2,this.colorVentana,this.colorLosa,this.colorColumnas);
            nuevoPiso.trasladar(0,nuevoPiso.obtenerAltura()*i,0);
            nuevoPiso.trasladar(this.posicion[0],this.posicion[1],this.posicion[2]);
            this.edificio.agregarHijo(nuevoPiso);
        }
    }


    limpiarEdificio(){
        for(let i = 0; i<this.numPisosT1+this.numPisosT2;i++)
            this.edificio.quitarHijo();
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
        console.log('ancho');
        this.limpiarEdificio();
        this.ventanasAncho =ventanasAncho;
        this.generarPuntosDeControl();
        this.generarEdificio();
    }
    
    setVentanasALoLargo(ventanasLargo){
        if(this.ventanasLargo==ventanasLargo)
            return;
        console.log('largo');
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

        for (let ancho = -ventanasAncho/2; ancho < ventanasAncho/2; ancho++) 
            puntosDeControl.push(vec3.fromValues(ancho*tamañoVentana,0,ventanasLargo*tamañoVentana/2));        
        for (let largo = ventanasLargo/2; largo > -ventanasLargo/2; largo--) 
            puntosDeControl.push(vec3.fromValues(ventanasAncho*tamañoVentana/2,0,largo*tamañoVentana));        
        for (let ancho = ventanasAncho/2; ancho > -ventanasAncho/2; ancho--) 
            puntosDeControl.push(vec3.fromValues(ancho*tamañoVentana,0,-ventanasLargo*tamañoVentana/2));        
        for (let largo = -ventanasLargo/2; largo < ventanasLargo/2; largo++) 
            puntosDeControl.push(vec3.fromValues(-ventanasAncho*tamañoVentana/2,0,largo*tamañoVentana));        
    
        return puntosDeControl;
    }

    obtenerPuntosDeControlLosa(ventanasAncho,ventanasLargo,tamañoVentana){
        
        var puntosDeControl = [];

        var minRandom = 0.5;
        var maxRandom = 1.5;
        var randomEsquina = 2.0;
    
        for (let ancho = -ventanasAncho/2; ancho < ventanasAncho/2; ancho++) {
            
            var nuevoPDC = vec3.fromValues(ancho*tamañoVentana,0,ventanasLargo*tamañoVentana/2);

            if(ancho == -ventanasAncho/2) {
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(-randomEsquina,0,randomEsquina));
            } else {
                var randomDelta = getRandomDouble(minRandom,maxRandom);
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(0,0,randomDelta * tamañoVentana));
            }
            
            puntosDeControl.push(nuevoPDC);
        }
    
        for (let largo = ventanasLargo/2; largo > -ventanasLargo/2; largo--) {
            
            var nuevoPDC = vec3.fromValues(ventanasAncho*tamañoVentana/2,0,largo*tamañoVentana);
            
            if(largo == ventanasLargo/2) {
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(randomEsquina,0,randomEsquina));
            } else {
                var randomDelta = getRandomDouble(minRandom,maxRandom);
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(randomDelta * tamañoVentana,0,0));      
            }
    
            puntosDeControl.push(nuevoPDC);
        }
    
        for (let ancho = ventanasAncho/2; ancho > -ventanasAncho/2; ancho--) {
            
            var nuevoPDC = vec3.fromValues(ancho*tamañoVentana,0,-ventanasLargo*tamañoVentana/2);
            
            if(ancho == ventanasAncho/2) {
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(randomEsquina,0,-randomEsquina));
            } else {
                var randomDelta = getRandomDouble(minRandom,maxRandom);
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(0,0,-randomDelta * tamañoVentana));        
            }
            
            puntosDeControl.push(nuevoPDC);
        }
    
        for (let largo = -ventanasLargo/2; largo < ventanasLargo/2; largo++) {
            
            var nuevoPDC = vec3.fromValues(-ventanasAncho*tamañoVentana/2,0,largo*tamañoVentana);
            
            if(largo == -ventanasLargo/2) {
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(-randomEsquina,0,-randomEsquina));
            }  else {
                var randomDelta = getRandomDouble(minRandom,maxRandom);
                vec3.add(nuevoPDC, nuevoPDC, vec3.fromValues(-randomDelta * tamañoVentana,0,0));        
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
    constructor(ventanasAncho, ventanasLargo,tamañoVentana,cantidadcolumnas,puntosDeControlVentanas,puntosDeControlLosa,colorVentana,colorLosa,colorColumnas) {
        super();
        this.puntosDeControlLosa = []; //Los necesito para las ventanas
        this.puntosDeControlVentanas = []; //Los necesito para la losa
        this.ventanasAncho = ventanasAncho; // integer > 3
        this.ventanasLargo = ventanasLargo; // integer > 3
        this.numPuntosDeControl = ventanasAncho * ventanasLargo;
        this.tamañoVentana = tamañoVentana;
        this.alturaLosa = tamañoVentana/5;
        this.cantidadcolumnas = cantidadcolumnas;
        this.puntosDeControlVentanas = puntosDeControlVentanas;
        this.puntosDeControlLosa = puntosDeControlLosa;
        this.colorVentana = colorVentana;
        this.colorLosa = colorLosa;
        this.colorColumnas = colorColumnas;
        this.generarPiso();
    }

    obtenerAltura(){
        //CORREGIR HARCODEO
        return this.tamañoVentana+this.alturaLosa;
    }

    copiarPiso(prototipo){
        pisoCopia = new Objeto3D();
    }

    generarPiso() {

    //Creamos la Losa
        //Escablecemos la contorno
        var contorno = new ClosedBSplineCuadratica();
        contorno.setPuntosDeControl(this.puntosDeControlLosa);
        contorno.setCenterPoint(vec3.fromValues(0,0,0));
        //Generamos las losas
        var losaInferior = new Losa(contorno,this.alturaLosa,this.colorLosa);
        var losaSuperior = new Losa(contorno,this.alturaLosa,this.colorLosa);
        losaSuperior.trasladar(0,this.tamañoVentana+this.alturaLosa,0);
        //La agregamos al piso
        this.agregarHijo(losaInferior);
        this.agregarHijo(losaSuperior);

    //Creamos las Ventanas
        //Generamos el objeto contenedor de ventanas
        var ventanas = new Objeto3D();

        //Instanciamos individualmente cada ventana
        for (let i = 0; i < this.puntosDeControlVentanas.length; i++) {

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
            var ventana = new Cuadrado(2,2,this.tamañoVentana,this.colorVentana);

            //La colocamos en posición
            ventana.trasladar(posicionVentana[0], posicionVentana[1], posicionVentana[2]);

            //La rotamos de la contorno correspondiente
            //Segun si nos encontramos en el lado ancho o largo del edificio
            var rotarX = false;
            var rotarZ = false;

            if(cp1[0] == cp2[0]) 
                rotarZ = true;
            else 
                rotarX = true;
            
            ventana.rotar(rotarX*Math.PI/2, 0, rotarZ*Math.PI/2);
            ventanas.agregarHijo(ventana);
        }

    //Agregamos las ventanas
        this.agregarHijo(ventanas);

    //Creamos las columnas

        var deltaContorno = 1/this.cantidadcolumnas;
        var deltaNormal = 1.0;
        var posicionesColumnas = this.getPosicionesColumnas(contorno, deltaContorno, deltaNormal);

        var columnas = new Objeto3D();

        for (let i = 0; i < posicionesColumnas.length; i++) {

            var columna = new Cilindro(10,10,0.2,this.tamañoVentana,this.colorColumnas);

            columna.trasladar(posicionesColumnas[i][0], posicionesColumnas[i][1], posicionesColumnas[i][2]);

            columna.trasladar(0,this.tamañoVentana/2+this.alturaLosa,0);

            columnas.agregarHijo(columna);
        }

        this.agregarHijo(columnas);

    }
    
    getPosicionesColumnas(contorno, deltaContorno, deltaNormal) {

        // deltaContorno between 0 and 1 (0.05)
        // deltaNormal between 0 and 1

        var posicionesColumnas = [];

        for (let u = 0; u < 1; u+=deltaContorno) {
            
            var contornoPosicion = contorno.getPosicion(u);
            var contornoNormal = contorno.getNormal(u);

            var posicion = vec3.create();
            var normal = vec3.create();
            
            vec3.scale(normal, contornoNormal, deltaNormal);
            vec3.add(posicion, contornoPosicion, normal);
            posicionesColumnas.push(posicion);
        }

        return posicionesColumnas;
    }
}