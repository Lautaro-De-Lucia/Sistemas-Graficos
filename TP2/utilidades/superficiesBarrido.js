class SuperficieBarrido {

    constructor(forma, barrido, dF, dB) {

        this.bufferPosicion = [];
        this.bufferNormal = [];
        this.bufferUV = [];
        this.indexBuffer = [];

        this.forma = forma;  
        this.barrido = barrido; 

        this.dF = dF;
        this.dB = dB;
        
        this.niveles = 1/dB;
        
        this.perimetro = discretizarCurva(this.forma, this.dF); 
    }

    obtenerMatrizDeNivel(nivel) {

        var u = nivel/(this.niveles-1);

        var posicion = this.barrido.getPosicion(u);
        var tangente = this.barrido.getTangente(u);
        var binormal = this.barrido.getBinormal(u);
        var normal = this.barrido.getNormal(u);

        var matrizDeNivel = mat4.fromValues(

            normal[0], tangente[0], binormal[0], posicion[0],
            normal[1], tangente[1], binormal[1], posicion[1],
            normal[2], tangente[2], binormal[2], posicion[2],
            0        , 0          , 0         , 1
        );

        mat4.transpose(matrizDeNivel, matrizDeNivel);

        return matrizDeNivel;
    }

    agregarVerticesSuperficie() {
    }

    generarIndexBuffer() {
    }

    setupBuffersBarrido() {
    }
}

