function ControlTobogan() {

    var actualizado = true;
    var niveles = 5;

    document.addEventListener("keypress", function (control) {
        actualizado = true;
        switch (control.key) {

            case "U":
                if(niveles <= 10)
                    niveles += 1;    
                break;
            case "J":
                if(niveles > 1)
                    niveles -= 1;
                break;
        }
    })

    this.update = function () {
        if (actualizado == true){
            refresh = true;
            tobogan.setNiveles(niveles);
        }
        actualizado = false;
    }


}