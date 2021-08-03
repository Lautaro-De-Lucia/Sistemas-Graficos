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

    constructor(alturaSeccion,ancho,color){
        
        super();

        this.alturaSeccion = alturaSeccion;
        this.ancho = ancho;
        this.color = color;

        this.superFicieDeBarrido = null;
        
        this.cargarSeccion();

        this.trasladar(0,2,0);
    }

    cargarSeccion(){

        var soporte1 = new Cilindro(this.ancho/4,2,RGB(100,60,30));
        soporte1.escalar(1,this.alturaSeccion,1);
        soporte1.trasladar(this.ancho,1/this.alturaSeccion,0);
        var soporte2 = new Cilindro(this.ancho/4,2,RGB(100,60,30));
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