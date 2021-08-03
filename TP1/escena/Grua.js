class Grua {

    //La clase Grua no es un Objeto 3D en si misma, sino que es un contenedor de piezas que SI son Objetos3D.
    //La clase es responsable de colocar los objetos (las piezas de la grúa) en la escena. 
    //Así como el manejo de las transformaciones que en conjunto conforman el movimiento de la grúa.
    constructor(){

        this.posicion = [20,0,0];
        this.cantidadDePiezas = 7;        
        //Arreglo de piezas
        this.piezas = [];
        //Transformaciones acumuladas de las piezas
        this.posiciones = []; 
        this.rotaciones = [];
        this.escalas = [];

        //Se crean las piezas
        this.cargarPiezas();
        //Se cargan las transformaciones
        this.cargarParametros();

        //Singvaron  (no debe haber más de una grúa)
        if(typeof Grua.instance === "object"){return Grua.instance;}

    }

    //Se cargan piezas al arreglo. 
    //Siguiendo la consigna, a cada una le corresponde un caracter.
    cargarPiezas() {

        for( var i = 65; i <= 65 + this.cantidadDePiezas ; i++ )
            this.piezas.push(this.generarPieza(String.fromCharCode(i)));
    }

    //La grúa agrega sus piezas al arreglo de objetos de la escena
    agregarALaEscena(objetos){
        this.cargarParametros();
        for(var i = 0; i <= this.cantidadDePiezas; i++)
            objetos.push(this.piezas[i]);
    }

    trasladar(){
        this.normalizarPiezas();
        for(var i = 0; i <= this.cantidadDePiezas; i++)
            this.piezas[i].trasladar(this.posicion[0],this.posicion[1],this.posicion[2]);
        this.deNormalizarPiezas();
    }

    deTrasladar(){
        this.normalizarPiezas();
        for(var i = 0; i <= this.cantidadDePiezas; i++)
            this.piezas[i].trasladar(-this.posicion[0],-this.posicion[1],-this.posicion[2]);
        this.deNormalizarPiezas();
    }

    //Recibe el índice y devuelve la pieza en el arreglo de la Grua
    obtenerPieza(index){
        return this.piezas[index];
    }

    //Recibe un caracter y CREA la pieza
    generarPieza (input){
        switch (input){
            case 'A':
                return this.generarPiezaA();
            case 'B':
                return this.generarPiezaB();
            case 'C':
                return this.generarPiezaC();
            case 'D':
                return this.generarPiezaD();
            case 'E':
                return this.generarPiezaE();
            case 'F':
                return this.generarPiezaF();
            case 'G':
                return this.generarPiezaG();
            case 'H':
                return this.generarPiezaH();
        }
    }

    // Las piezas se "dibujan" cada una dentro de su propia función de generación
    // Yo decidí crearlas a partir de figuras geométricas elementales 
    // De modo que cada pieza es un objeto3D compuesto a partir de objetos3D más simples
    generarPiezaA(){
        var A = new Cubo(2,RGB(0,0,0));
            A.trasladar(0,3,0);
            A.escalar(1,3,1);
            return A;
    }
    generarPiezaB(){
        var B = new Cubo(2,RGB(255,255,0));
            B.trasladar(0,9,0);
            B.escalar(0.75,3,0.75);
            return B;
    }
    generarPiezaC(){
        var C = new Cilindro(0.5,6,RGB(200,200,200));
            C.trasladar(0,15,0);
            return C;
    }
    generarPiezaD(){
        var D = new Objeto3D();
        D.trasladar(0,19,-2);    
        var habitaculo = new Cubo(1,RGB(255,255,0));
            habitaculo.escalar(2,1,1);
             D.agregarHijo(habitaculo);
        var techo = new Cubo(0.2,RGB(0,0,0));
            techo.trasladar(0,0.45,0.7);
            techo.escalar(10,0.5,2);
             D.agregarHijo(techo);
        var piso = new Cubo(0.2,RGB(0,0,0));
            piso.trasladar(0,-0.45,1.4);
            piso.escalar(10,0.5,9);
             D.agregarHijo(piso);
        var varandaFrontal = new Cubo(0.2,RGB(100,100,100));
            varandaFrontal.trasladar(0,-0.2,2.2);
            varandaFrontal.escalar(10,2,1);
             D.agregarHijo(varandaFrontal);               
        var varandaIzquierda = new Cubo(0.2,RGB(100,100,100));
            varandaIzquierda.trasladar(0.90,-0.2,1.3);
            varandaIzquierda.escalar(1,2,8);
             D.agregarHijo(varandaIzquierda); 
        var varandaDerecha = new Cubo(0.2,RGB(100,100,100));
            varandaDerecha.trasladar(-0.90,-0.2,1.3);
            varandaDerecha.escalar(1,2,8);
             D.agregarHijo(varandaDerecha);  
        var soportePoleaIzquierda = new Cubo(0.2,RGB(100,60,30));
            soportePoleaIzquierda.trasladar(0.3,1,0);
            soportePoleaIzquierda.escalar(1,5,2);
             D.agregarHijo(soportePoleaIzquierda);        
        var soportePoleaDerecha = new Cubo(0.2,RGB(100,60,30));
            soportePoleaDerecha.trasladar(-0.3,1,0);
            soportePoleaDerecha.escalar(1,5,2);
             D.agregarHijo(soportePoleaDerecha);   
        D.escalar(2,2,2);
        return D;
    }
    generarPiezaE(){
        var E = new Cilindro(0.2,2,RGB(180,180,180));
            E.trasladar(0,21.5,-2);
            E.rotar(0,0,3.14/2);
        return E;                                     
    }
    generarPiezaF(){
        var F = new Objeto3D();
            F.trasladar(0,21.5,-2);
        var viga = new Cubo(0.8,RGB(255,255,0));
            viga.trasladar(0,0,5);
            viga.escalar(1,1,30);
            F.agregarHijo(viga);
        var contrapeso = new Cubo(2,RGB(150,150,150));
            contrapeso.trasladar(0,0,-8);
            contrapeso.escalar(2,1,1);
            F.agregarHijo(contrapeso);
        var poleaIzquierdaViga = new Circulo(0.2,RGB(180,180,180));
            poleaIzquierdaViga.trasladar(0.41,0,16.5);
            poleaIzquierdaViga.rotar(0,0,3.14/2);
            F.agregarHijo(poleaIzquierdaViga);        
         var poleaDerechaViga = new Circulo(0.2,RGB(180,180,180));
            poleaDerechaViga.trasladar(-0.41,0,16.5);
            poleaDerechaViga.rotar(0,0,3.14/2);
            F.agregarHijo(poleaDerechaViga); 
        return F;
    }
    generarPiezaG(){
        var G = new Cubo(0.1,RGB(200,190,150));
            G.trasladar(0,19,14.5);
            G.escalar(1,50,1);
            return G;
    }
    generarPiezaH(){
        //Soga y Plataforma
        var H = new Objeto3D();
            H.trasladar(0,16.5,14.5);

        var soga1 = new Cubo(0.1,RGB(200,190,150));
            soga1.rotar(3.14/4,0,3.14/4);
            soga1.trasladar(0,-2.5,0);
            soga1.escalar(1,50,1);
            H.agregarHijo(soga1);
        var soga2 = new Cubo(0.1,RGB(200,190,150));
            soga2.rotar(-3.14/4,0,3.14/4);
            soga2.trasladar(0,-2.5,0);
            soga2.escalar(1,50,1);
            H.agregarHijo(soga2);
            var soga3 = new Cubo(0.1,RGB(200,190,150));
            soga3.rotar(3.14/4,0,-3.14/4);
            soga3.trasladar(0,-2.5,0);
            soga3.escalar(1,50,1);
            H.agregarHijo(soga3);
        var soga4 = new Cubo(0.1,RGB(200,190,150));
            soga4.rotar(-3.14/4,0,-3.14/4);
            soga4.trasladar(0,-2.5,0);
            soga4.escalar(1,50,1);
            H.agregarHijo(soga4);
        var plataforma = new Cubo(1,RGB(100,60,30));
            plataforma.trasladar(0,-2.5,0);
            plataforma.escalar(7.5,0.2,5.5);
            H.agregarHijo(plataforma);

        return H;

    }

    //Esta función guarda todas las transformaciones acumuladas sobre cada pieza
    cargarParametros(){

        this.posiciones = [];
        this.rotaciones = [];
        this.escalas = [];

        for(var i = 0; i <= this.cantidadDePiezas; i++){
            var posicion = vec3.fromValues(0,0,0);
            var rotacion = vec3.fromValues(0,0,0);
            var escala = vec3.fromValues(0,0,0);
            vec3.copy(posicion,this.piezas[i].posicionAcumulada);
            vec3.copy(rotacion,this.piezas[i].rotacionAcumulada);
            vec3.copy(escala,this.piezas[i].escalaAcumulada);
            this.posiciones.push(posicion);
            this.rotaciones.push(rotacion);
            this.escalas.push(escala);
        }
    }

    //Definimos funciones de normalización y denormalización
    //Las utilizamos para transformaciones que deban aplicarse sobre múltiples piezas
    //A modo de aplicar la misma transformacion en todas indiferente de cuales fuesen sus transformaciones acumuladas
    normalizarPiezas(){
        for(var i = 0; i <= this.cantidadDePiezas; i++){
            this.piezas[i].escalar(1/this.escalas[i][0],1/this.escalas[i][1],1/this.escalas[i][2]);
            this.piezas[i].rotar(-this.rotaciones[i][0],-this.rotaciones[i][1],-this.rotaciones[i][2]);
            this.piezas[i].trasladar(-this.posiciones[i][0],-this.posiciones[i][1],-this.posiciones[i][2]);
        }
    }
    deNormalizarPiezas(){
        for(var i = 0; i <= this.cantidadDePiezas; i++){
            this.piezas[i].trasladar(this.posiciones[i][0],this.posiciones[i][1],this.posiciones[i][2]);
            this.piezas[i].rotar(this.rotaciones[i][0],this.rotaciones[i][1],this.rotaciones[i][2]);
            this.piezas[i].escalar(this.escalas[i][0],this.escalas[i][1],this.escalas[i][2]);
        }  
    }

    //Función auxiliar para agregar ejes a las piezas
    agregarEjes(){
        for(var i = 0; i <= this.cantidadDePiezas; i++){
            this.piezas[i].agregarHijo(new Ejes());
        }
    }

    //Las siguientes funciones se ocupan de las animaciones de movimiento de la Grua
    //Aplican las transformaciones pertinentes sobre sus piezas
    rotacionCabina(rotacion){
        if(rotacion == 0)
            return;

        //Pongo el brazo recto    
        var piezaF = this.piezas[5];
        var fcrb = piezaF.rotacionAcumulada[0];
        piezaF.rotar(-fcrb,0,0);

        //Actualizo la escala de la soga
        //Así como la posicion de la soga y el andamio
        //Si el brazo se levanto el andamio estaría elevado y no paralelo a la cabina

        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];
        vec3.copy(this.escalas[6],piezaG.escalaAcumulada);
        vec3.copy(this.posiciones[6],piezaG.posicionAcumulada);
        vec3.copy(this.posiciones[7],piezaH.posicionAcumulada);

        //Normalizo todo y roto 
        this.normalizarPiezas();
        for(var i = 3; i <= this.cantidadDePiezas; i++){                    
            this.piezas[i].rotar(0,rotacion,0);
        }    
        this.deNormalizarPiezas();

        //Vuelvo a rotar el brazo
        piezaF.rotar(fcrb,0,0);

        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];

        var distanciaAlOrigen = piezaG.posicionAcumulada[2];
            piezaG.trasladar(0,0,-distanciaAlOrigen);
            piezaH.trasladar(0,0,-distanciaAlOrigen);
            piezaG.trasladar(0,0,14.5*Math.cos(fcrb));
            piezaH.trasladar(0,0,14.5*Math.cos(fcrb));
     
    }
    bajarCabina(altura){
        if(altura == 0)
            return;
        var piezaB = this.piezas[1];
        var piezaC = this.piezas[2];
        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];
        var piezaF = this.piezas[5];

        var fcrb = piezaF.rotacionAcumulada[0];
        piezaF.rotar(-fcrb,0,0)
        //Normalizo la escala para la soga
            vec3.copy(this.escalas[6],piezaG.escalaAcumulada);
        //Si hay tiempo ver como puedo NO harcodear estos números (¿Uso variables globales?)
        if(piezaH.posicionAcumulada[1]>3){ //La platafaorma no puede atravesar el piso
            if(piezaC.posicionAcumulada[1] > 9 ){
                this.normalizarPiezas();
                for(var i = 2; i <= this.cantidadDePiezas; i++)                    
                    this.piezas[i].trasladar(0,-altura,0);
                this.deNormalizarPiezas();
            }
            if(piezaC.posicionAcumulada[1] <= 9 && piezaB.posicionAcumulada[1] >= 3 ){
                this.normalizarPiezas();
                for(var i = 1; i <= this.cantidadDePiezas; i++)                    
                    this.piezas[i].trasladar(0,-altura,0);
                this.deNormalizarPiezas();
            }    
        }
        piezaF.rotar(fcrb,0,0);

        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];

        var distanciaAlOrigen = piezaG.posicionAcumulada[2];
            piezaG.trasladar(0,0,-distanciaAlOrigen);
            piezaH.trasladar(0,0,-distanciaAlOrigen);
            piezaG.trasladar(0,0,14.5*Math.cos(fcrb));
            piezaH.trasladar(0,0,14.5*Math.cos(fcrb));

    }
    subirCabina(altura){
        if(altura == 0)
            return;
        var piezaB = this.piezas[1];
        var piezaC = this.piezas[2];
        var piezaG = this.piezas[6];
        var piezaF = this.piezas[5];

        var fcrb = piezaF.rotacionAcumulada[0];
        piezaF.rotar(-fcrb,0,0)
        vec3.copy(this.escalas[6],piezaG.escalaAcumulada);
        if(piezaC.posicionAcumulada[1] < 15 && piezaC.posicionAcumulada[1] >= 9 ){
            this.normalizarPiezas();                    
            for(var i = 2; i <= this.cantidadDePiezas; i++)
                this.piezas[i].trasladar(0,altura,0);
            this.deNormalizarPiezas();
        }
        if(piezaC.posicionAcumulada[1] < 9 ){
            this.normalizarPiezas();
            for(var i = 1; i <= this.cantidadDePiezas; i++)                    
                this.piezas[i].trasladar(0,altura,0);
            this.deNormalizarPiezas();
        } 
        piezaF.rotar(fcrb,0,0);   

        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];

        var distanciaAlOrigen = piezaG.posicionAcumulada[2];
            piezaG.trasladar(0,0,-distanciaAlOrigen);
            piezaH.trasladar(0,0,-distanciaAlOrigen);
            piezaG.trasladar(0,0,14.5*Math.cos(fcrb));
            piezaH.trasladar(0,0,14.5*Math.cos(fcrb));
    }
    rotacionHorariaBrazo(rotacion){
        if(rotacion == 0)
            return;  
        var piezaF = this.piezas[5];
        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];
        var r = -rotacion* (Math.PI/180); //Paso a radianes
        var rtotal = piezaF.rotacionAcumulada[0];
        var LimiteSuperiorRotacion = -23 * (Math.PI/180);

        if(rtotal>LimiteSuperiorRotacion){

            var distanciaAlOrigen = piezaG.posicionAcumulada[2];
            piezaF.rotar(r,0,0);
            var arriba = -16.5*Math.sin(r);
            piezaG.trasladar(0,0,-distanciaAlOrigen);
            piezaH.trasladar(0,0,-distanciaAlOrigen);
            piezaG.trasladar(0,arriba/piezaG.escalaAcumulada[1],14.5*Math.cos(rtotal));
            piezaH.trasladar(0,arriba,14.5*Math.cos(rtotal));
        }
    }
    rotacionAntiHorariaBrazo(rotacion){
        if(rotacion == 0)
            return;     
        if (this.piezas[7].posicionAcumulada[1]<=3)
            return;      
        var piezaF = this.piezas[5];
        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];
        var r = rotacion* (Math.PI/180); //Paso a radianes
        var rtotal = piezaF.rotacionAcumulada[0];
        var LimiteInferiorRotacion = 23 * (Math.PI/180);
        
        if(piezaF.rotacionAcumulada[0]<LimiteInferiorRotacion){
        
            var distanciaAlOrigen = piezaG.posicionAcumulada[2];
            piezaF.rotar(r,0,0);
            var abajo = -16.5*Math.sin(r);
            piezaG.trasladar(0,0,-distanciaAlOrigen);
            piezaH.trasladar(0,0,-distanciaAlOrigen);
            piezaG.trasladar(0,abajo/piezaG.escalaAcumulada[1],14.5*Math.cos(rtotal));
            piezaH.trasladar(0,abajo,14.5*Math.cos(rtotal));
        }
    }
    bajarPlataforma(abajo){
        if(abajo == 0)
            return;
        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];
        var longitud = piezaG.escalaAcumulada[1];

        if(piezaH.posicionAcumulada[1]>3){
        piezaG.trasladar(0,-abajo/(2*longitud),0);
        piezaG.escalar(1,1+10*(abajo/longitud),1);
        piezaH.trasladar(0,-abajo,0); 
        } 
                                      
    }
    subirPlataforma(arriba){
        if(arriba == 0)
            return;
        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];
        var longitud = piezaG.escalaAcumulada[1];
        if(longitud > 25){
        piezaG.trasladar(0,arriba/(2*longitud),0);
        piezaG.escalar(1,1-10*(arriba/longitud),1);
        piezaH.trasladar(0,arriba,0); 
        }   
    }
    obtenerVistaCabina(){
    	var cabina = this.piezas[3];
        var out = mat4.create();
	    var up = [0,1,0];
	    var from = vec3.fromValues(cabina.posicionAcumulada[0],cabina.posicionAcumulada[1]+1.5,0);
        var to = vec3.fromValues(from[0],from[1],from[2]+10);
	    vec3.rotateY(to,to,from,cabina.rotacionAcumulada[1]);
       
        return mat4.lookAt(out,from,to,up)

    }
//COMENTARIO: NO ES NECESARIO QUE HAYA ROTACION HORARIA Y ANTIHORARIA
//SOLO ROTARCABINA, Y LE MANDO PARAMETRO POSITIVO Y O NEGATIVO EN EL EVENTHANDLER
//Refactorizar esto si hay tiempo antes de la entrega        
}