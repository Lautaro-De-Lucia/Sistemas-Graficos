class SuperficieBarrido {

    // forma circle, curve, anything in 2D
    
    // barrido: curve, straight line (extrusion), anything that has the methods: 
    //      getPosicion();
    //      getTangente();
    //      getNormal();
    //      getBinormal();

    constructor(forma, barrido, deltaForma, deltaBarrido) {

        this.posicionBuffer = [];
        this.normalBuffer = [];
        this.uvBuffer = [];
        this.indexBuffer = [];

        this.forma = forma;  // Superficie en 2D que se barre
        this.barrido = barrido; // Recorrido del barrido

        this.deltaForma = deltaForma;
        this.deltaBarrido = deltaBarrido;
        
        this.niveles = 1/deltaBarrido;
        
        // posiciones, tangentes, binormales, normales
        this.perimetro = discretizarCurva(this.forma, this.deltaForma); // posiciones, tangentes, binormales and normales (y=0)
    }

    obtenerMatrizDeNivel(nivel) {

        // nivel 0, nivel 1, nivel 2, etc...
        // u=0, u=0.1, u=0.2, ... u=0.9, u=1.0
        var u = nivel/(this.niveles-1);

        var posicion = this.barrido.getPosicion(u);
        var tangente = this.barrido.getTangente(u);
        var binormal = this.barrido.getBinormal(u);
        var normal = this.barrido.getNormal(u);

        // HARDCODING
        //var normal = vec3.fromValues(1,0,0);
        //var tangente = vec3.fromValues(0,1,0);
        //var binormal = vec3.fromValues(0,0,1);

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


class TileSurface extends SuperficieBarrido {

    constructor(forma, barrido, deltaForma, deltaBarrido) {
        super(forma, barrido, deltaForma, deltaBarrido);
    }

    agregarVerticesSuperficie() {

        var verticesPorNivel = this.perimetro.posiciones.length;
        
        for (let i = 0; i < this.niveles; i++) {

            var matrizDeNivel = this.obtenerMatrizDeNivel(i);
            
            for (let j = 0; j < verticesPorNivel; j++) {

                var posicion3D = vec3.clone(this.perimetro.posiciones[j]);
                var normal3D = vec3.clone(this.perimetro.normales[j]);
                
                var uv = [0,0];

                var posicion4D = vec4.fromValues(posicion3D[0], posicion3D[1], posicion3D[2], 1);
                var normal4D = vec4.fromValues(normal3D[0], normal3D[1], normal3D[2], 1);

                vec4.transformMat4(posicion4D, posicion4D, matrizDeNivel);
                vec4.transformMat4(normal4D, normal4D, matrizDeNivel);

                posicion3D = [posicion4D[0], posicion4D[1], posicion4D[2]];
                normal3D = [normal4D[0], normal4D[1], normal4D[2]];
                
                this.posicionBuffer.push(posicion3D[0]);
                this.posicionBuffer.push(posicion3D[1]);
                this.posicionBuffer.push(posicion3D[2]);
                this.normalBuffer.push(normal3D[0]);
                this.normalBuffer.push(normal3D[1]);
                this.normalBuffer.push(normal3D[2]);
                this.uvBuffer.push(uv[0]);
                this.uvBuffer.push(uv[1]);
            }
        }
    }

    addBottomLidVertex() {

        var bottomCenterposicion = this.barrido.getPosicion(0);
        var bottomCenterNormal = this.barrido.getTangente(0);
        vec3.scale(bottomCenterNormal, bottomCenterNormal, -1); // if I use the barrido tangente vector as the surface normal, then it has to be inverted for the bottom lid
        var uv = [0,0];

        this.posicionBuffer.push(bottomCenterposicion[0]);
        this.posicionBuffer.push(bottomCenterposicion[1]);
        this.posicionBuffer.push(bottomCenterposicion[2]);

        this.normalBuffer.push(bottomCenterNormal[0]);
        this.normalBuffer.push(bottomCenterNormal[1]);
        this.normalBuffer.push(bottomCenterNormal[2]);

        this.uvBuffer.push(uv[0]);
        this.uvBuffer.push(uv[1]);
    }

    addTopLidVertex() {

        var topCenterposicion = this.barrido.getPosicion(1);
        var topCenterNormal = this.barrido.getTangente(1);
        var uv = [0,0];

        this.posicionBuffer.push(topCenterposicion[0]);
        this.posicionBuffer.push(topCenterposicion[1]);
        this.posicionBuffer.push(topCenterposicion[2]);

        this.normalBuffer.push(topCenterNormal[0]);
        this.normalBuffer.push(topCenterNormal[1]);
        this.normalBuffer.push(topCenterNormal[2]);

        this.uvBuffer.push(uv[0]);
        this.uvBuffer.push(uv[1]);
    }

    generarIndexBuffer() {

        var bottomLidIndex = this.posicionBuffer.length - 2;
        var topLidIndex = this.posicionBuffer.length - 1;

        var verticesPorNivel = this.perimetro.posiciones.length;

        // bottom lid

        for (let i = 0; i < verticesPorNivel; i++) {
            
            this.indexBuffer.push(bottomLidIndex);
            this.indexBuffer.push(i); // first vertices
        }

        // surface

        for (let nivel = 0; nivel < this.niveles; nivel++) {
            
            for (let point = 0; point < verticesPorNivel; point++) {

                this.indexBuffer.push(((nivel+0)*verticesPorNivel)+point);
                this.indexBuffer.push(((nivel+1)*verticesPorNivel)+point);
            }

            this.indexBuffer.push((nivel*verticesPorNivel)+0);
        }

        // top lid

        for (let i = 0; i < verticesPorNivel; i++) {
            
            this.indexBuffer.push(topLidIndex);
            this.indexBuffer.push(i+(this.posicionBuffer.length-2-verticesPorNivel)); // last vertices
        }
    }

    setupBuffersBarrido() {

        this.agregarVerticesSuperficie();
        this.addBottomLidVertex();
        this.addTopLidVertex();
        this.generarIndexBuffer();
        


        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.posicionBuffer), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = this.posicionBuffer.length / 3;
    
        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.normalBuffer.length / 3;
    
        var webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvBuffer), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = this.uvBuffer.length / 2;
    
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

    constructor(forma, barrido, deltaForma, deltaBarrido) {

        super(forma, barrido, deltaForma, deltaBarrido);
    }

    agregarVerticesSuperficie() {

        var verticesPorNivel = this.perimetro.posiciones.length - 1;
        
        for (let i = 0; i < this.niveles; i++) {

            var matrizDeNivel = this.obtenerMatrizDeNivel(i);
            
            for (let j = 0; j < verticesPorNivel; j++) {

                var posicion3D = vec3.clone(this.perimetro.posiciones[j]);
                var normal3D = vec3.clone(this.perimetro.normales[j]);
                var uv = [0,0];
                var posicion4D = vec4.fromValues(posicion3D[0], posicion3D[1], posicion3D[2], 1.0);
                var normal4D = vec4.fromValues(normal3D[0], normal3D[1], normal3D[2], 1.0);

                vec4.transformMat4(posicion4D, posicion4D, matrizDeNivel);
                vec4.transformMat4(normal4D, normal4D, matrizDeNivel);

                posicion3D = vec3.fromValues(posicion4D[0], posicion4D[1], posicion4D[2]);
                normal3D = vec3.fromValues(normal4D[0], normal4D[1], normal4D[2]);
                
                this.posicionBuffer.push(posicion3D[0]);
                this.posicionBuffer.push(posicion3D[1]);
                this.posicionBuffer.push(posicion3D[2]);
                this.normalBuffer.push(normal3D[0]);
                this.normalBuffer.push(normal3D[1]);
                this.normalBuffer.push(normal3D[2]);
                this.uvBuffer.push(uv[0]);
                this.uvBuffer.push(uv[1]);

            }

        }
    }

    generarIndexBuffer() {

        var verticesPorNivel = this.perimetro.posiciones.length - 1;

        for (let nivel = 0; nivel < this.niveles; nivel+=2) {
            
            for (let point = 0; point < verticesPorNivel; point++) {
                
                this.indexBuffer.push((((nivel+0)*verticesPorNivel)+point));
                this.indexBuffer.push((((nivel+1)*verticesPorNivel)+point));
            }

            if(nivel < this.niveles - 2) {

                for (let point = verticesPorNivel-1; point >= 0; point--) {

                    this.indexBuffer.push((((nivel+1)*verticesPorNivel)+point));
                    this.indexBuffer.push((((nivel+2)*verticesPorNivel)+point));
                }
            }
        }        
    }

    setupBuffersBarrido(){

        this.agregarVerticesSuperficie();
        this.generarIndexBuffer();

        var webgl_position_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_position_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.posicionBuffer), gl.STATIC_DRAW);
        webgl_position_buffer.itemSize = 3;
        webgl_position_buffer.numItems = this.posicionBuffer.length / 3;
    
        var webgl_normal_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_normal_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normalBuffer), gl.STATIC_DRAW);
        webgl_normal_buffer.itemSize = 3;
        webgl_normal_buffer.numItems = this.normalBuffer.length / 3;
    
        var webgl_uvs_buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, webgl_uvs_buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.uvBuffer), gl.STATIC_DRAW);
        webgl_uvs_buffer.itemSize = 2;
        webgl_uvs_buffer.numItems = this.uvBuffer.length / 2;
    
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