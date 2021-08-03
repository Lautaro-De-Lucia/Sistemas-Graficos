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


class SuperficieLosa extends SuperficieBarrido {

    constructor(forma, barrido, dF, dB) {
        super(forma, barrido, dF, dB);
    }

    agregarVerticesSuperficie() {

        var verticesPorNivel = this.perimetro.posiciones.length;
        
        for (let i = 0; i < this.niveles; i++) {

            var matrizDeNivel = this.obtenerMatrizDeNivel(i);
            
            for (let j = 0; j < verticesPorNivel; j++) {

                var posicion3D = vec3.clone(this.perimetro.posiciones[j]);
                var normal3D = vec3.clone(this.perimetro.normales[j]);
                
                var uv = vec2.fromValues(0,0);

                var posicion4D = vec4.fromValues(posicion3D[0], posicion3D[1], posicion3D[2], 1);
                var normal4D = vec4.fromValues(normal3D[0], normal3D[1], normal3D[2], 1);

                vec4.transformMat4(posicion4D, posicion4D, matrizDeNivel);
                vec4.transformMat4(normal4D, normal4D, matrizDeNivel);

                posicion3D = [posicion4D[0], posicion4D[1], posicion4D[2]];
                normal3D = [normal4D[0], normal4D[1], normal4D[2]];
                
                this.bufferPosicion.push(posicion3D[0]);
                this.bufferPosicion.push(posicion3D[1]);
                this.bufferPosicion.push(posicion3D[2]);
                this.bufferNormal.push(normal3D[0]);
                this.bufferNormal.push(normal3D[1]);
                this.bufferNormal.push(normal3D[2]);
                this.bufferUV.push(uv[0]);
                this.bufferUV.push(uv[1]);
            }
        }
    }

    agregarVerticesTapaInferior() {

        var centroInferior = this.barrido.getPosicion(0);
        var normalInferior = this.barrido.getTangente(0);
        vec3.scale(normalInferior, normalInferior, -1); 
        var uv = vec2.fromValues(0,0);

        this.bufferPosicion.push(centroInferior[0]);
        this.bufferPosicion.push(centroInferior[1]);
        this.bufferPosicion.push(centroInferior[2]);

        this.bufferNormal.push(normalInferior[0]);
        this.bufferNormal.push(normalInferior[1]);
        this.bufferNormal.push(normalInferior[2]);

        this.bufferUV.push(uv[0]);
        this.bufferUV.push(uv[1]);
    }

    agregarVerticesTapaSuperior() {

        var centroSuperior = this.barrido.getPosicion(1);
        var normalSuperior = this.barrido.getTangente(1);
        var uv = vec2.fromValues(0,0);

        this.bufferPosicion.push(centroSuperior[0]);
        this.bufferPosicion.push(centroSuperior[1]);
        this.bufferPosicion.push(centroSuperior[2]);

        this.bufferNormal.push(normalSuperior[0]);
        this.bufferNormal.push(normalSuperior[1]);
        this.bufferNormal.push(normalSuperior[2]);

        this.bufferUV.push(uv[0]);
        this.bufferUV.push(uv[1]);
    }

    generarIndexBuffer() {

        var indiceTapaInferior = this.bufferPosicion.length - 2;
        var indiceTapaSuperior = this.bufferPosicion.length - 1;

        var verticesPorNivel = this.perimetro.posiciones.length;

        for (let i = 0; i < verticesPorNivel; i++) {
            
            this.indexBuffer.push(indiceTapaInferior);
            this.indexBuffer.push(i); 
        }

        for (let nivel = 0; nivel < this.niveles; nivel++) {
            
            for (let punto = 0; punto < verticesPorNivel; punto++) {

                this.indexBuffer.push(((nivel+0)*verticesPorNivel)+punto);
                this.indexBuffer.push(((nivel+1)*verticesPorNivel)+punto);
            }

            this.indexBuffer.push((nivel*verticesPorNivel)+0);
        }

        for (let i = 0; i < verticesPorNivel; i++) {
            
            this.indexBuffer.push(indiceTapaSuperior);
            this.indexBuffer.push(i+(this.bufferPosicion.length-2-verticesPorNivel)); // last vertices
        }
    }

    setupBuffersBarrido() {

        this.agregarVerticesSuperficie();
        this.agregarVerticesTapaInferior();
        this.agregarVerticesTapaSuperior();
        this.generarIndexBuffer();

        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferPosicion), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = this.bufferPosicion.length / 3;
    
        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferNormal), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.bufferNormal.length / 3;
    
        var webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferUV), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = this.bufferUV.length / 2;
    
        var webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);
        webgl_index_buffer.itemSize = 1;
        webgl_index_buffer.numItems = this.indexBuffer.length;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
            webgl_uvs_buffer,
            webgl_index_buffer
        }
    }
}

class SuperficieTobogan extends SuperficieBarrido {

    constructor(forma, barrido, dF, dB) {

        super(forma, barrido, dF, dB);
    }

    agregarVerticesSuperficie() {

        var verticesPorNivel = this.perimetro.posiciones.length - 1;
        
        for (let i = 0; i < this.niveles; i++) {

            var matrizDeNivel = this.obtenerMatrizDeNivel(i);
            
            for (let j = 0; j < verticesPorNivel; j++) {

                var posicion3D = vec3.clone(this.perimetro.posiciones[j]);
                var normal3D = vec3.clone(this.perimetro.normales[j]);
                var uv = vec2.fromValues(0,0);
                var posicion4D = vec4.fromValues(posicion3D[0], posicion3D[1], posicion3D[2], 1.0);
                var normal4D = vec4.fromValues(normal3D[0], normal3D[1], normal3D[2], 1.0);

                vec4.transformMat4(posicion4D, posicion4D, matrizDeNivel);
                vec4.transformMat4(normal4D, normal4D, matrizDeNivel);

                posicion3D = vec3.fromValues(posicion4D[0], posicion4D[1], posicion4D[2]);
                normal3D = vec3.fromValues(normal4D[0], normal4D[1], normal4D[2]);
                
                this.bufferPosicion.push(posicion3D[0]);
                this.bufferPosicion.push(posicion3D[1]);
                this.bufferPosicion.push(posicion3D[2]);
                this.bufferNormal.push(normal3D[0]);
                this.bufferNormal.push(normal3D[1]);
                this.bufferNormal.push(normal3D[2]);
                this.bufferUV.push(uv[0]);
                this.bufferUV.push(uv[1]);

            }

        }
    }

    generarIndexBuffer() {

        var verticesPorNivel = this.perimetro.posiciones.length - 1;

        for (let nivel = 0; nivel < this.niveles; nivel+=2) {
            
            for (let punto = 0; punto < verticesPorNivel; punto++) {
                
                this.indexBuffer.push((((nivel+0)*verticesPorNivel)+punto));
                this.indexBuffer.push((((nivel+1)*verticesPorNivel)+punto));
            }

            if(nivel < this.niveles - 2) {

                for (let punto = verticesPorNivel-1; punto >= 0; punto--) {

                    this.indexBuffer.push((((nivel+1)*verticesPorNivel)+punto));
                    this.indexBuffer.push((((nivel+2)*verticesPorNivel)+punto));
                }
            }
        }        
    }

    setupBuffersBarrido(){

        this.agregarVerticesSuperficie();
        this.generarIndexBuffer();

        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferPosicion), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = this.bufferPosicion.length / 3;
    
        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferNormal), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.bufferNormal.length / 3;
    
        var webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.bufferUV), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = this.bufferUV.length / 2;
    
        var webgl_index_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webgl_index_buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indexBuffer), gl.STATIC_DRAW);
        webgl_index_buffer.itemSize = 1;
        webgl_index_buffer.numItems = this.indexBuffer.length;

        return {
            webgl_position_buffer,
            webgl_normal_buffer,
            webgl_uvs_buffer,
            webgl_index_buffer
        }
    }
}