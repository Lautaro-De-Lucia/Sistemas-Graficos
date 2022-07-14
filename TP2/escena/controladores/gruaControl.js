function ControlGrua() {

    var actualizado = true;
    var delta = 0.1;
    var deltaSC = 0;
    var deltaBC = 0;
    var deltaRHC = 0;
    var deltaRAC = 0;
    var deltaRHB = 0;
    var deltaRAB = 0;
    var deltaSP = 0;
    var deltaBP = 0;


    document.addEventListener("keypress",function(control){
        actualizado = true;
        switch ( control.key ) {

            case "W": 
                deltaSC += delta;
                break;
            case "S": 
                deltaBC += delta;
                break;
            case "A":  
                deltaRHC += delta;
                break;
            case "D": 
                deltaRAC += delta;
                break;
            case "Q":  
                deltaRHB += delta;
                break;
            case "Z": 
                deltaRAB += delta;
                break;
            case "E":  
                deltaSP += delta;
                break;
            case "C": 
                deltaBP += delta;
                break;
        }               
    })

    this.update=function(){
        if(actualizado == true){
            refresh = true;
            grua.subirCabina(deltaSC/2);
            deltaSC = 0;
            grua.bajarCabina(deltaBC/2);
            deltaBC = 0;
            grua.rotacionCabina(deltaRHC/3);
            deltaRHC = 0;
            grua.rotacionCabina(-deltaRAC/3);
            deltaRAC = 0;
            grua.subirPlataforma(deltaSP);
            deltaSP = 0;
            grua.bajarPlataforma(deltaBP);
            deltaBP = 0;
            grua.rotacionHorariaBrazo(deltaRHB*3);
            deltaRHB = 0;
            grua.rotacionAntiHorariaBrazo(deltaRAB*3);
            deltaRAB = 0;     
        } 
        actualizado = false;
    }
}