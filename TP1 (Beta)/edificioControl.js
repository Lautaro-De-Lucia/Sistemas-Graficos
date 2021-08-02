function ControlEdificio() {

    let posicionEdificio = [-20, 0, 0];
    let numPisosT1 = 5;
    let numPisosT2 = 5;
    let ventanasAncho = 10;
    let ventanasLargo = 10;
    let tamañoVentana = 2;
    let cantidadColumnas = 10;
    let colorVentana = RGB(150, 150, 150);
    let colorLosa = RGB(100, 100, 100);
    let colorColumnas = RGB(50, 50, 50);


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
        edificioConsigna.setPisosInferiores(numPisosT1);
        edificioConsigna.setPisosSuperiores(numPisosT2);
        edificioConsigna.setCantidadDeColumnas(cantidadColumnas);
        edificioConsigna.setVentanasALoAncho(ventanasAncho);
        edificioConsigna.setVentanasALoLargo(ventanasLargo);
    }


}