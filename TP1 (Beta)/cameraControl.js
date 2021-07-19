document.addEventListener("keypress",function(camaras){
                
    switch ( camaras.key ) {
            
        case "1": // drone camera

            camaraActual = "drone";
            break;

        case "2": // crane operator camera
            
            camaraActual = "cabina";
            break;

        case "3": // orbital camera

            camaraActual = "orbital";
            break;    
        
        default:

            break;
    }
})