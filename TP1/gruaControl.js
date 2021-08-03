function ControlGrua() {

    let delta = 0.1;
    let deltaSC = 0;
    let deltaBC = 0;
    let deltaRHC = 0;
    let deltaRAC = 0;
    let deltaRHB = 0;
    let deltaRAB = 0;
    let deltaSP = 0;
    let deltaBP = 0;


    document.addEventListener("keypress",function(control){

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


}