var posicionMouse = {x: 0, y: 0};

class CamaraOrbital{
    
    constructor(posicionInicial = [0,0,0]){

        this.arriba = [0,1,0];
        this.vel = 0.01;
        this.radio = 90;

        this.matrizVista = mat4.create();
        
        this.posicionOjo = posicionInicial;
        this.foco = [0, 5, 0];

        this.move = {x: 2, y: 1};
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
                
        let dx=0;
        let dy=0;

        dx = (posicionMouse.x - this.prevClient.x);
        dy = (posicionMouse.y - this.prevClient.y);

        this.prevClient.x = posicionMouse.x;
        this.prevClient.y = posicionMouse.y;

        this.move.x += this.vel*dx;
        this.move.y += this.vel*dy;
        
        if (this.move.y < 0.1) {
            this.move.y = 0.1;
        } else if (this.move.y > 1.5) {
            this.move.y = 1.5;
        }

        let posicionOjoX = this.radio*Math.cos(this.move.x)*Math.sin(this.move.y);
        let posicionOjoY = this.radio*Math.cos(this.move.y);
        let posicionOjoZ = this.radio*Math.sin(this.move.x)*Math.sin(this.move.y);

        this.posicionOjo=vec3.fromValues(posicionOjoX,posicionOjoY,posicionOjoZ);
    }

    obtenerVistaOrbital(){        
        mat4.lookAt(this.matrizVista, this.posicionOjo, this.foco, this.arriba);
        return this.matrizVista;
    }
}
