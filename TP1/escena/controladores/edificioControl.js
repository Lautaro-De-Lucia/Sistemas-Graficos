function ControlEdificio() {

    var numPisosT1 = 5;
    var numPisosT2 = 5;
    var ventanasAncho = 10;
    var ventanasLargo = 10;
    var cantidadColumnas = 4;

    document.addEventListener("keypress", function (control) {

        switch (control.key) {

            case "R":
                if(numPisosT1 <= 10)
                    numPisosT1 += 1;    
                break;
            case "F":
                console.log(numPisosT1);
                if(numPisosT1 > 1)
                    numPisosT1 -= 1;
                break;
            case "T":
                if(numPisosT2 <= 10)
                    numPisosT2 += 1;
                break;
            case "G":
                if(numPisosT2 > 1)
                    numPisosT2 -= 1;
                break;
            case "Y":
                if(cantidadColumnas <= 20)
                    cantidadColumnas += 1;
                break;
            case "H":
                if(cantidadColumnas > 0)
                    cantidadColumnas -= 1;
                break;
            case "V":
                if(ventanasAncho > 4)
                    ventanasAncho -= 1;
                break;
            case "B":
                if(ventanasAncho <= 10)
                    ventanasAncho += 1;
                break;
            case "N":
                if(ventanasLargo >= 4)
                    ventanasLargo -= 1;
                break;
            case "M":
                if(ventanasLargo <=10)
                    ventanasLargo += 1;
                break;
        }
    })

    this.update = function () {
        edificio.setPisosInferiores(numPisosT1);
        edificio.setPisosSuperiores(numPisosT2);
        edificio.setCantidadDeColumnas(cantidadColumnas);
        edificio.setVentanasALoAncho(ventanasAncho);
        edificio.setVentanasALoLargo(ventanasLargo);
    }


}