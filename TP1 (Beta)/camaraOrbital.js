function OrbitalCameraControl(initialPos){

    if (!initialPos) {
        
        initialPos = [0,0,0];
    }

    let up = [0,1,0];
    let vel = 0.01;
    
    let mousePosition = {x: 0, y: 0};
    let move = {x: 2, y: 1};
    let prevClient = {x: 0, y: 0}

    let radius = 60;


    let orbitalCamViewMatrix = mat4.create();
    
    let eyePosition = initialPos;
    let targetPosition = [0, 5, 0];

    document.addEventListener("mousemove", function(e) {
        mousePosition.x = e.clientX; 
	    mousePosition.y = e.clientY;
    });

    this.update = function() {
                
        let deltaX=0;
        let deltaY=0;

        deltaX = (mousePosition.x - prevClient.x);
        deltaY = (mousePosition.y - prevClient.y);

        prevClient.x = mousePosition.x;
        prevClient.y = mousePosition.y;

        move.x += vel*deltaX;
        move.y += vel*deltaY;
        
        if (move.y < 0.1) {
            move.y = 0.1;
        } else if (move.y > 1.5) {
            move.y = 1.5;
        }

        let eyePositionX = radius*Math.cos(move.x)*Math.sin(move.y);
        let eyePositionY = radius*Math.cos(move.y);
        let eyePositionZ = radius*Math.sin(move.x)*Math.sin(move.y);

        eyePosition=vec3.fromValues(eyePositionX,eyePositionY,eyePositionZ);
    }

    this.getViewMatrix = function(){
        
        mat4.lookAt(orbitalCamViewMatrix, eyePosition, targetPosition, up);
        return orbitalCamViewMatrix;
    }
}