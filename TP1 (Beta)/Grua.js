class Grua {

    constructor(){
        this.cantidadDePiezas = 7;
        this.piezas = [];
        this.posiciones = []; 
        this.rotaciones = [];
        this.escalas = [];
        this.cargarPiezas();
        this.cargarParametros();

        //Singleton  (no debe haber más de una grúa)
        if(typeof Grua.instance === "object"){
            return Grua.instance;
        }

    }

    cargarPiezas() {
        for( let i = 65; i <= 65 + this.cantidadDePiezas ; i++ )
            this.piezas.push(this.generarPieza(String.fromCharCode(i)));
    }

    agregarALaEscena(objetos){
        for(let i = 0; i <= this.cantidadDePiezas; i++)
            objetos.push(this.piezas[i]);
    }

    obtenerPieza(index){
        return this.piezas[index];
    }

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
    generarPiezaA(){
        var A = new Cubo(MFil,MCol,2,RGB(0,0,0));
            A.setTraslacion(0,3,0);
            A.setEscala(1,3,1);
            return A;
    }
    generarPiezaB(){
        var B = new Cubo(MFil,MCol,2,RGB(255,255,0));
            B.setTraslacion(0,9,0);
            B.setEscala(0.75,3,0.75);
            return B;
    }
    generarPiezaC(){
        var C = new Cilindro(MFil,MCol,0.5,6,RGB(200,200,200));
            C.setTraslacion(0,15,0);
            return C;
    }
    generarPiezaD(){
        var D = new Objeto3D();
        D.setTraslacion(0,19,-2);    
        var habitaculo = new Cubo(MFil,MCol,1,RGB(255,255,0));
            habitaculo.setEscala(2,1,1);
             D.agregarHijo(habitaculo);
        var techo = new Cubo(MFil,MCol,0.2,RGB(0,0,0));
            techo.setTraslacion(0,0.45,0.7);
            techo.setEscala(10,0.5,2);
             D.agregarHijo(techo);
        var piso = new Cubo(MFil,MCol,0.2,RGB(0,0,0));
            piso.setTraslacion(0,-0.45,1.4);
            piso.setEscala(10,0.5,9);
             D.agregarHijo(piso);
        var varandaFrontal = new Cubo(MFil,MCol,0.2,RGB(100,100,100));
            varandaFrontal.setTraslacion(0,-0.2,2.2);
            varandaFrontal.setEscala(10,2,1);
             D.agregarHijo(varandaFrontal);               
        var varandaIzquierda = new Cubo(MFil,MCol,0.2,RGB(100,100,100));
            varandaIzquierda.setTraslacion(0.90,-0.2,1.3);
            varandaIzquierda.setEscala(1,2,8);
             D.agregarHijo(varandaIzquierda); 
        var varandaDerecha = new Cubo(MFil,MCol,0.2,RGB(100,100,100));
            varandaDerecha.setTraslacion(-0.90,-0.2,1.3);
            varandaDerecha.setEscala(1,2,8);
             D.agregarHijo(varandaDerecha);  
        var soportePoleaIzquierda = new Cubo(MFil,MCol,0.2,RGB(100,60,30));
            soportePoleaIzquierda.setTraslacion(0.3,1,0);
            soportePoleaIzquierda.setEscala(1,5,2);
             D.agregarHijo(soportePoleaIzquierda);        
        var soportePoleaDerecha = new Cubo(MFil,MCol,0.2,RGB(100,60,30));
            soportePoleaDerecha.setTraslacion(-0.3,1,0);
            soportePoleaDerecha.setEscala(1,5,2);
             D.agregarHijo(soportePoleaDerecha);   
        D.setEscala(2,2,2);
        return D;
    }
    generarPiezaE(){
        var E = new Cilindro(MFil,MCol,0.2,2,RGB(180,180,180));
            E.setTraslacion(0,21.5,-2);
            E.setRotacion(0,0,3.14/2);
        return E;                                     
    }
    generarPiezaF(){
        var F = new Objeto3D();
            F.setTraslacion(0,21.5,-2);
        var viga = new Cubo(MFil,MCol,0.8,RGB(255,255,0));
            viga.setTraslacion(0,0,5);
            viga.setEscala(1,1,30);
            F.agregarHijo(viga);
        var contrapeso = new Cubo(MFil,MCol,2,RGB(150,150,150));
            contrapeso.setTraslacion(0,0,-8);
            contrapeso.setEscala(2,1,1);
            F.agregarHijo(contrapeso);
        var poleaIzquierdaViga = new Circulo(MFil,MCol,0.2,RGB(180,180,180));
            poleaIzquierdaViga.setTraslacion(0.41,0,16.5);
            poleaIzquierdaViga.setRotacion(0,0,3.14/2);
            F.agregarHijo(poleaIzquierdaViga);        
         var poleaDerechaViga = new Circulo(MFil,MCol,0.2,RGB(180,180,180));
            poleaDerechaViga.setTraslacion(-0.41,0,16.5);
            poleaDerechaViga.setRotacion(0,0,3.14/2);
            F.agregarHijo(poleaDerechaViga); 
        return F;
    }
    generarPiezaG(){
        var G = new Cubo(MFil,MCol,0.1,RGB(200,190,150));
            G.setTraslacion(0,19,14.5);
            G.setEscala(1,50,1);
            return G;
    }
    generarPiezaH(){
        //Soga y Plataforma
        var H = new Objeto3D();
            H.setTraslacion(0,16.5,14.5);

        var soga1 = new Cubo(MFil,MCol,0.1,RGB(200,190,150));
            soga1.setRotacion(3.14/4,0,3.14/4);
            soga1.setTraslacion(0,-2.5,0);
            soga1.setEscala(1,50,1);
            H.agregarHijo(soga1);
        var soga2 = new Cubo(MFil,MCol,0.1,RGB(200,190,150));
            soga2.setRotacion(-3.14/4,0,3.14/4);
            soga2.setTraslacion(0,-2.5,0);
            soga2.setEscala(1,50,1);
            H.agregarHijo(soga2);
            var soga3 = new Cubo(MFil,MCol,0.1,RGB(200,190,150));
            soga3.setRotacion(3.14/4,0,-3.14/4);
            soga3.setTraslacion(0,-2.5,0);
            soga3.setEscala(1,50,1);
            H.agregarHijo(soga3);
        var soga4 = new Cubo(MFil,MCol,0.1,RGB(200,190,150));
            soga4.setRotacion(-3.14/4,0,-3.14/4);
            soga4.setTraslacion(0,-2.5,0);
            soga4.setEscala(1,50,1);
            H.agregarHijo(soga4);
        var plataforma = new Cubo(MFil,MCol,1,RGB(100,60,30));
            plataforma.setTraslacion(0,-2.5,0);
            plataforma.setEscala(7.5,0.2,5.5);
            H.agregarHijo(plataforma);

        return H;

    }

    cargarParametros(){

        this.posiciones = [];
        this.rotaciones = [];
        this.escalas = [];

        for(let i = 0; i <= this.cantidadDePiezas; i++){
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

    normalizarPiezas(){
        for(let i = 0; i <= this.cantidadDePiezas; i++){
            this.piezas[i].setEscala(1/this.escalas[i][0],1/this.escalas[i][1],1/this.escalas[i][2]);
            this.piezas[i].setRotacion(-this.rotaciones[i][0],-this.rotaciones[i][1],-this.rotaciones[i][2]);
            this.piezas[i].setTraslacion(-this.posiciones[i][0],-this.posiciones[i][1],-this.posiciones[i][2]);
        }
    }
    deNormalizarPiezas(){
        for(let i = 0; i <= this.cantidadDePiezas; i++){
            this.piezas[i].setTraslacion(this.posiciones[i][0],this.posiciones[i][1],this.posiciones[i][2]);
            this.piezas[i].setRotacion(this.rotaciones[i][0],this.rotaciones[i][1],this.rotaciones[i][2]);
            this.piezas[i].setEscala(this.escalas[i][0],this.escalas[i][1],this.escalas[i][2]);
        }  
    }

    agregarEjes(){
        for(let i = 0; i <= this.cantidadDePiezas; i++){
            this.piezas[i].agregarHijo(new Ejes());
        }
    }
//NO ES NECESARIO QUE HAYA ROTACION HORARIA Y ANTIHORARIA
//SOLO ROTARCABINA, Y LE MANDO PARAMETRO POSITIVO Y O NEGATIVO EN EL EVENTHANDLER
    rotacionHorariaCabina(rotacion){
        if(rotacion == 0)
            return;

        var piezaF = this.piezas[5];
        var fcrb = piezaF.rotacionAcumulada[0];
        piezaF.setRotacion(-fcrb,0,0);

        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];
        vec3.copy(this.escalas[6],piezaG.escalaAcumulada);
        vec3.copy(this.posiciones[6],piezaG.posicionAcumulada);
        vec3.copy(this.posiciones[7],piezaH.posicionAcumulada);


        this.normalizarPiezas();
        for(let i = 3; i <= this.cantidadDePiezas; i++)                    
            this.piezas[i].setRotacion(0,rotacion,0);
        this.deNormalizarPiezas();

        piezaF.setRotacion(fcrb,0,0);

        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];

        var distanciaAlOrigen = piezaG.posicionAcumulada[2];
            piezaG.setTraslacion(0,0,-distanciaAlOrigen);
            piezaH.setTraslacion(0,0,-distanciaAlOrigen);
            piezaG.setTraslacion(0,0,14.5*Math.cos(fcrb));
            piezaH.setTraslacion(0,0,14.5*Math.cos(fcrb));
       
        
    }
    rotacionAntiHorariaCabina(rotacion){
        if(rotacion == 0)
            return;

        var piezaF = this.piezas[5];
        var fcrb = piezaF.rotacionAcumulada[0];
        piezaF.setRotacion(-fcrb,0,0);

        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];
        vec3.copy(this.escalas[6],piezaG.escalaAcumulada);
        vec3.copy(this.posiciones[6],piezaG.posicionAcumulada);
        vec3.copy(this.posiciones[7],piezaH.posicionAcumulada);


        this.normalizarPiezas();
        for(let i = 3; i <= this.cantidadDePiezas; i++)                    
            this.piezas[i].setRotacion(0,-rotacion,0);
        this.deNormalizarPiezas(); 
        piezaF.setRotacion(fcrb,0,0);

        
        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];

        var distanciaAlOrigen = piezaG.posicionAcumulada[2];
            piezaG.setTraslacion(0,0,-distanciaAlOrigen);
            piezaH.setTraslacion(0,0,-distanciaAlOrigen);
            piezaG.setTraslacion(0,0,14.5*Math.cos(fcrb));
            piezaH.setTraslacion(0,0,14.5*Math.cos(fcrb));
 
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
        piezaF.setRotacion(-fcrb,0,0)
        //Normalizo la escala para la soga
            vec3.copy(this.escalas[6],piezaG.escalaAcumulada);
            console.log(this.escalas[6]);
        //Si hay tiempo ver como puedo NO harcodear estos números (¿Uso variables globales?)
        if(piezaH.posicionAcumulada[1]>3){ //La platafaorma no puede atravesar el piso
            if(piezaC.posicionAcumulada[1] > 9 ){
                this.normalizarPiezas();
                for(let i = 2; i <= this.cantidadDePiezas; i++)                    
                    this.piezas[i].setTraslacion(0,-altura,0);
                this.deNormalizarPiezas();
            }
            if(piezaC.posicionAcumulada[1] <= 9 && piezaB.posicionAcumulada[1] >= 3 ){
                this.normalizarPiezas();
                for(let i = 1; i <= this.cantidadDePiezas; i++)                    
                    this.piezas[i].setTraslacion(0,-altura,0);
                this.deNormalizarPiezas();
            }    
        }
        piezaF.setRotacion(fcrb,0,0);

        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];

        var distanciaAlOrigen = piezaG.posicionAcumulada[2];
            piezaG.setTraslacion(0,0,-distanciaAlOrigen);
            piezaH.setTraslacion(0,0,-distanciaAlOrigen);
            piezaG.setTraslacion(0,0,14.5*Math.cos(fcrb));
            piezaH.setTraslacion(0,0,14.5*Math.cos(fcrb));

    }
    subirCabina(altura){
        if(altura == 0)
            return;
        var piezaB = this.piezas[1];
        var piezaC = this.piezas[2];
        var piezaG = this.piezas[6];
        var piezaF = this.piezas[5];

        var fcrb = piezaF.rotacionAcumulada[0];
        piezaF.setRotacion(-fcrb,0,0)
        vec3.copy(this.escalas[6],piezaG.escalaAcumulada);
            console.log(this.escalas[6]);
        if(piezaC.posicionAcumulada[1] < 15 && piezaC.posicionAcumulada[1] >= 9 ){
            this.normalizarPiezas();                    
            for(let i = 2; i <= this.cantidadDePiezas; i++)
                this.piezas[i].setTraslacion(0,altura,0);
            this.deNormalizarPiezas();
        }
        if(piezaC.posicionAcumulada[1] < 9 ){
            this.normalizarPiezas();
            for(let i = 1; i <= this.cantidadDePiezas; i++)                    
                this.piezas[i].setTraslacion(0,altura,0);
            this.deNormalizarPiezas();
        } 
        piezaF.setRotacion(fcrb,0,0);   

        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];

        var distanciaAlOrigen = piezaG.posicionAcumulada[2];
            piezaG.setTraslacion(0,0,-distanciaAlOrigen);
            piezaH.setTraslacion(0,0,-distanciaAlOrigen);
            piezaG.setTraslacion(0,0,14.5*Math.cos(fcrb));
            piezaH.setTraslacion(0,0,14.5*Math.cos(fcrb));
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
            piezaF.setRotacion(r,0,0);
            var arriba = -16.5*Math.sin(r);
            piezaG.setTraslacion(0,0,-distanciaAlOrigen);
            piezaH.setTraslacion(0,0,-distanciaAlOrigen);
            piezaG.setTraslacion(0,arriba/piezaG.escalaAcumulada[1],14.5*Math.cos(rtotal));
            piezaH.setTraslacion(0,arriba,14.5*Math.cos(rtotal));
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
            piezaF.setRotacion(r,0,0);
            var abajo = -16.5*Math.sin(r);
            piezaG.setTraslacion(0,0,-distanciaAlOrigen);
            piezaH.setTraslacion(0,0,-distanciaAlOrigen);
            piezaG.setTraslacion(0,abajo/piezaG.escalaAcumulada[1],14.5*Math.cos(rtotal));
            piezaH.setTraslacion(0,abajo,14.5*Math.cos(rtotal));
        }
    }
    bajarPlataforma(abajo){
        if(abajo == 0)
            return;
        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];
        var longitud = piezaG.escalaAcumulada[1];

        if(piezaH.posicionAcumulada[1]>3){
        piezaG.setTraslacion(0,-abajo/(2*longitud),0);
        piezaG.setEscala(1,1+10*(abajo/longitud),1);
        piezaH.setTraslacion(0,-abajo,0); 
        } 
                                      
    }
    subirPlataforma(arriba){
        if(arriba == 0)
            return;
        var piezaG = this.piezas[6];
        var piezaH = this.piezas[7];
        var longitud = piezaG.escalaAcumulada[1];
        if(longitud > 25){
        piezaG.setTraslacion(0,arriba/(2*longitud),0);
        piezaG.setEscala(1,1-10*(arriba/longitud),1);
        piezaH.setTraslacion(0,arriba,0); 
        }   
    }

    obtenerVistaCabina(){
    	var cabina = this.piezas[3];
        var out = mat4.create();
	    var up = [0,1,0];
	    var from = vec3.fromValues(0,cabina.posicionAcumulada[1]+1.5,0);
        var to = vec3.fromValues(from[0],from[1],from[2]+10);
	    vec3.rotateY(to,to,from,cabina.rotacionAcumulada[1]);
       
        return mat4.lookAt(out,from,to,up)

    }
}