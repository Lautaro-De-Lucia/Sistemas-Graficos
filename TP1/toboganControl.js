function ControlTobogan() {

    let niveles = 5;

    document.addEventListener("keypress", function (control) {

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
        tobogan.setNiveles(niveles);
    }


}