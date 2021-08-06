var posicionMouse = {x: 0, y: 0};

class CamaraOrbital{
    
    constructor(posicionInicial = [0,0,0]){

        this.arriba = [0,1,0];
        this.vel = 0.01;
        this.distancia = 50;

        this.matrizVista = mat4.create();
        
        this.posicionOjo = posicionInicial;
        this.foco = [0, 5, 0];
        this.movimiento = {x: 2, y: 1};
        this.prevClient = {x: 0, y: 0}

        document.addEventListener("mousemove", function(mouse) {
            posicionMouse.x = mouse.clientX; 
            posicionMouse.y = mouse.clientY;
        });   

        //Singleton: No debería haber más de una cámara orbital
        if(typeof CamaraOrbital.instance === "object"){
            return CamaraOrbital.instance;
        }

    }

    update() {
                
        var dx = (posicionMouse.x - this.prevClient.x);
        var dy = (posicionMouse.y - this.prevClient.y);

        this.prevClient.x = posicionMouse.x;
        this.prevClient.y = posicionMouse.y;

        this.movimiento.x += this.vel*dx;
        this.movimiento.y += this.vel*dy;
        
        if (this.movimiento.y < 0.1) {
            this.movimiento.y = 0.1;
        } else if (this.movimiento.y > 1.5) {
            this.movimiento.y = 1.5;
        }

        var posicionOjoX = this.distancia*Math.cos(this.movimiento.x)*Math.sin(this.movimiento.y);
        var posicionOjoY = this.distancia*Math.cos(this.movimiento.y);
        var posicionOjoZ = this.distancia*Math.sin(this.movimiento.x)*Math.sin(this.movimiento.y);

        this.posicionOjo=vec3.fromValues(posicionOjoX,posicionOjoY,posicionOjoZ);
    }

    obtenerVistaOrbital(){        
        mat4.lookAt(this.matrizVista, this.posicionOjo, this.foco, this.arriba);
        return this.matrizVista;
    }

    obtenerPosicionOjo(){
        return this.posicionOjo;
    }
}
