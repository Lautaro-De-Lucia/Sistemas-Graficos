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

        case "4": // activar/desactivar mapa de reflexion

            reflexion = reflexion? false : true;
            edificio.reset();
            break;        
        
        default:

            break;
    }
})