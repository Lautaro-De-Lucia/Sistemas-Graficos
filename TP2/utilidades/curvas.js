class Curva {

	constructor() {
		this.puntosDeControl = [];
	}

	getPuntosDeControl(){return this.puntosDeControl;}

    //u en el rango [0,1]
	getPosicion(u) {}
	getTangente(u) {}
	getNormal(u) {}
	getBinormal(u) {}

}

//DISCLAIMER: 
	/*Por simplicidad, el segmento rectilineo debería tener la dirección de
	alguno de los ejes cartesianos. La superficie resultante del barrido luego
	puede rotarse aplicando transformaciones sobre sus vértices*/

class SegmentoRectilineo extends Curva {

	constructor() {
		super();
		this.director = vec3.create(); 
	}

	setPuntosDeControl(p0, p1) {

		this.puntosDeControl = [];

		this.puntosDeControl.push(p0);
		this.puntosDeControl.push(p1);

		vec3.subtract(this.director,p1,p0);
	}

	getNumPuntosDeControl() {return (this.puntosDeControl).length;}

	B0(u) {return 1-u;}
	B1(u) {return u;}

	dB0(u) {return -1;}
	dB1(u) {return 1;}

	ddB0(u) {return 0;}
	ddB1(u) {return 0;}

	getPosicion(u) {

		var b0 = this.B0(u);
		var b1 = this.B1(u);

		var p0, p1 = vec3.create();

		p0 = vec3.clone((this.puntosDeControl)[0]);
		p1 = vec3.clone((this.puntosDeControl)[1]);

		vec3.scale(p0, p0, b0);
		vec3.scale(p1, p1, b1);

		var punto = vec3.create();

		vec3.add(punto, p0, p1);

		return punto; 
	}
	
	getTangente(u) {
		if (this.director[1] == 0 && this.director[2] == 0)
			return vec3.fromValues(1,0,0);
		if (this.director[0] == 0 && this.director[2] == 0)
			return vec3.fromValues(0,1,0);
		if (this.director[0] == 0 && this.director[1] == 0)
			return vec3.fromValues(0,0,1);
	}

	getNormal(u) {
		if (this.director[1] == 0 && this.director[2] == 0)
			return vec3.fromValues(0,1,0);
		if (this.director[0] == 0 && this.director[2] == 0)
			return vec3.fromValues(1,0,0);
		if (this.director[0] == 0 && this.director[1] == 0)
			return vec3.fromValues(0,1,0);
	}

	getBinormal(u) {
		if (this.director[1] == 0 && this.director[2] == 0)
			return vec3.fromValues(1,0,0);
		if (this.director[0] == 0 && this.director[2] == 0)
			return vec3.fromValues(0,0,1);
		if (this.director[0] == 0 && this.director[1] == 0)
			return vec3.fromValues(0,0,-1);	}
}

class BezierCuadratica extends Curva {

	constructor() {
		super(); 
	}

	setPuntosDeControl(p0, p1, p2) {

		this.puntosDeControl = [];

		this.puntosDeControl.push(p0);
		this.puntosDeControl.push(p1);
		this.puntosDeControl.push(p2);
	}

	getNumPuntosDeControl() {return (this.puntosDeControl).length;}

	B0(u) {return (1-u)*(1-u);}
	B1(u) {return 2*(1-u)*u;}
	B2(u) {return u*u;}

	dB0(u) {return -2*(1-u);}
	dB1(u) {return 2*(1-2*u);}
	dB2(u) {return 2*u;}

	ddB0(u) {return 2;}
	ddB1(u) {return -4;}
	ddB2(u) {return 2;		}

	getPosicion(u) {

		var b0 = this.B0(u);
		var b1 = this.B1(u);
		var b2 = this.B2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.puntosDeControl)[0]);
		p1 = vec3.clone((this.puntosDeControl)[1]);
		p2 = vec3.clone((this.puntosDeControl)[2]);

		vec3.scale(p0, p0, b0);
		vec3.scale(p1, p1, b1);
		vec3.scale(p2, p2, b2);

		var punto = vec3.create();

		vec3.add(punto, p0, p1);
		vec3.add(punto, punto, p2);

		return punto; 
	}

	getTangente(u) {

		var db0 = this.dB0(u);
		var db1 = this.dB1(u);
		var db2 = this.dB2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.puntosDeControl)[0]);
		p1 = vec3.clone((this.puntosDeControl)[1]);
		p2 = vec3.clone((this.puntosDeControl)[2]);

		vec3.scale(p0, p0, db0);
		vec3.scale(p1, p1, db1);
		vec3.scale(p2, p2, db2);

		var vectortangentee = vec3.create();

		vec3.add(vectortangentee, p0, p1);
		vec3.add(vectortangentee, vectortangentee, p2);

		vec3.normalize(vectortangentee, vectortangentee);

		return vectortangentee; 
	}

	getNormal(u) {

		var segundaDerivada = this.getSegundaDerivada(u);
		var vectortangentee = this.getTangente(u);

		var vectorNormal = vec3.create();

		vec3.cross(vectorNormal, vectortangentee, segundaDerivada);
		vec3.normalize(vectorNormal, vectorNormal);

		return vectorNormal; 
	}

	getSegundaDerivada(u) {

		var ddb0 = this.ddB0(u);
		var ddb1 = this.ddB1(u);
		var ddb2 = this.ddB2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.puntosDeControl)[0]);
		p1 = vec3.clone((this.puntosDeControl)[1]);
		p2 = vec3.clone((this.puntosDeControl)[2]);

		vec3.scale(p0, p0, ddb0);
		vec3.scale(p1, p1, ddb1);
		vec3.scale(p2, p2, ddb2);

		var segundaDerivada = vec3.create();

		vec3.add(segundaDerivada, p0, p1);
		vec3.add(segundaDerivada, segundaDerivada, p2);

		vec3.normalize(segundaDerivada, segundaDerivada);

		return vec3.fromValues(0,1,0);
	}

	getBinormal(u) {

		var vectortangentee = this.getTangente(u);
		var vectorNormal = this.getNormal(u);
		var vectorBinormal = vec3.create();

		vec3.cross(vectorBinormal, vectorNormal, vectortangentee);
		vec3.normalize(vectorBinormal, vectorBinormal);

		return vectorBinormal;
	}
}

class BezierCubica extends Curva {

	constructor() {

		super(); 
	}

	setPuntosDeControl(p0, p1, p2, p3) {

		this.puntosDeControl = [];

		this.puntosDeControl.push(p0);
		this.puntosDeControl.push(p1);
		this.puntosDeControl.push(p2);
		this.puntosDeControl.push(p3);
	}

	cargarPuntosDeControl(puntos){		
		this.puntosDeControl = puntos;
	}

	getNumPuntosDeControl() {
		return (this.puntosDeControl).length;
	}

	B0(u) {return (1-u)*(1-u)*(1-u);}
	B1(u) {return 3*(1-u)*(1-u)*u;}
	B2(u) {return 3*(1-u)*u*u;}
	B3(u) {return u*u*u;}

	dB0(u) {return -3*(1-u)*(1-u);}
	dB1(u) {return 3*(3*u*u-4*u+1);}
	dB2(u) {return 3*(-3*u*u+2*u);}
	dB3(u) {return 3*u*u;}

	ddB0(u) {return 6*(1-u);}
	ddB1(u) {return 3*(6*u-4);}
	ddB2(u) {return 3*(-6*u+2);	}
	ddB3(u) {return 6*u;}

	getPosicion(u) {

		var b0 = this.B0(u);
		var b1 = this.B1(u);
		var b2 = this.B2(u);
		var b3 = this.B3(u);

		var p0, p1, p2, p3 = vec3.create();

		p0 = vec3.clone((this.puntosDeControl)[0]);
		p1 = vec3.clone((this.puntosDeControl)[1]);
		p2 = vec3.clone((this.puntosDeControl)[2]);
		p3 = vec3.clone((this.puntosDeControl)[3]);

		vec3.scale(p0, p0, b0);
		vec3.scale(p1, p1, b1);
		vec3.scale(p2, p2, b2);
		vec3.scale(p3, p3, b3);

		var punto = vec3.create();

		vec3.add(punto, p0, p1);
		vec3.add(punto, punto, p2);
		vec3.add(punto, punto, p3);

		return punto; 
	}

	getTangente(u) {

		var db0 = this.dB0(u);
		var db1 = this.dB1(u);
		var db2 = this.dB2(u);
		var db3 = this.dB3(u);

		var p0, p1, p2, p3 = vec3.create();

		p0 = vec3.clone((this.puntosDeControl)[0]);
		p1 = vec3.clone((this.puntosDeControl)[1]);
		p2 = vec3.clone((this.puntosDeControl)[2]);
		p3 = vec3.clone((this.puntosDeControl)[3]);

		vec3.scale(p0, p0, db0);
		vec3.scale(p1, p1, db1);
		vec3.scale(p2, p2, db2);
		vec3.scale(p3, p3, db3);

		var vector = vec3.create();

		vec3.add(vector, p0, p1);
		vec3.add(vector, vector, p2);
		vec3.add(vector, vector, p3);

		vec3.normalize(vector, vector);

		return vector; 
	}

	getNormal(u) {

		var vectortangentee = this.getTangente(u);
		var vectorBinormal = this.getBinormal(u);

		var vectorNormal = vec3.create();

		vec3.cross(vectorNormal, vectortangentee, vectorBinormal);
		vec3.normalize(vectorNormal, vectorNormal);

		return vectorNormal;
	}

	getSegundaDerivada(u) {

		var ddb0 = this.ddB0(u);
		var ddb1 = this.ddB1(u);
		var ddb2 = this.ddB2(u);
		var ddb3 = this.ddB3(u);

		var p0, p1, p2, p3 = vec3.create();

		p0 = vec3.clone((this.puntosDeControl)[0]);
		p1 = vec3.clone((this.puntosDeControl)[1]);
		p2 = vec3.clone((this.puntosDeControl)[2]);
		p3 = vec3.clone((this.puntosDeControl)[3]);

		vec3.scale(p0, p0, ddb0);
		vec3.scale(p1, p1, ddb1);
		vec3.scale(p2, p2, ddb2);
		vec3.scale(p3, p3, ddb3);

		var segundaDerivada = vec3.create();

		vec3.add(segundaDerivada, p0, p1);
		vec3.add(segundaDerivada, segundaDerivada, p2);
		vec3.add(segundaDerivada, segundaDerivada, p3);

		vec3.normalize(segundaDerivada, segundaDerivada);

		return segundaDerivada; 
	}	

	getBinormal(u) {

		var vectortangentee = this.getTangente(u);
		var vectorBinormal = vec3.create();
		var segundaDerivada = this.getSegundaDerivada(u);

		vec3.cross(vectorBinormal, segundaDerivada, vectortangentee);
		vec3.normalize(vectorBinormal, vectorBinormal);

		return vectorBinormal;
	}
}

class BSplineCuadratica extends Curva {

	constructor() {
		super(); 
	}

	setPuntosDeControl(p0, p1, p2) {

		this.puntosDeControl = [];
		
		this.puntosDeControl.push(p0);
		this.puntosDeControl.push(p1);
		this.puntosDeControl.push(p2);
	}

	getNumPuntosDeControl() {

		return (this.puntosDeControl).length;
	}

	B0(u) {return (1/2)*(1-u)*(1-u);}
	B1(u) {return (1/2)+(1-u)*u;}
	B2(u) {return u*u/2;}

	dB0(u) {return u-1;}
	dB1(u) {return 1-2*u;}
	dB2(u) {return u;}

	ddB0(u) {return 1;}
	ddB1(u) {return -2;}
	ddB2(u) {return 1;}

	getPosicion(u) {

		var b0 = this.B0(u);
		var b1 = this.B1(u);
		var b2 = this.B2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.puntosDeControl)[0]);
		p1 = vec3.clone((this.puntosDeControl)[1]);
		p2 = vec3.clone((this.puntosDeControl)[2]);

		vec3.scale(p0, p0, b0);
		vec3.scale(p1, p1, b1);
		vec3.scale(p2, p2, b2);

		var punto = vec3.create();

		vec3.add(punto, p0, p1);
		vec3.add(punto, punto, p2);

		return punto; 
	}

	getTangente(u) {

		var db0 = this.dB0(u);
		var db1 = this.dB1(u);
		var db2 = this.dB2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.puntosDeControl)[0]);
		p1 = vec3.clone((this.puntosDeControl)[1]);
		p2 = vec3.clone((this.puntosDeControl)[2]);

		vec3.scale(p0, p0, db0);
		vec3.scale(p1, p1, db1);
		vec3.scale(p2, p2, db2);

		var vector = vec3.create();

		vec3.add(vector, p0, p1);
		vec3.add(vector, vector, p2);

		vec3.normalize(vector, vector);

		return vector; 
	}

	getNormal(u) {

		var vectortangentee = this.getTangente(u);
		var vectorBinormal = this.getBinormal(u);
		var vectorNormal = vec3.create();

		vec3.cross(vectorNormal, vectortangentee, vectorBinormal);
		vec3.normalize(vectorNormal, vectorNormal);

		return vectorNormal;
	}

	getSegundaDerivada(u) {

		var ddb0 = this.ddB0(u);
		var ddb1 = this.ddB1(u);
		var ddb2 = this.ddB2(u);

		var p0, p1, p2 = vec3.create();

		p0 = vec3.clone((this.puntosDeControl)[0]);
		p1 = vec3.clone((this.puntosDeControl)[1]);
		p2 = vec3.clone((this.puntosDeControl)[2]);

		vec3.scale(p0, p0, ddb0);
		vec3.scale(p1, p1, ddb1);
		vec3.scale(p2, p2, ddb2);

		var segundaDerivada = vec3.create();

		vec3.add(segundaDerivada, p0, p1);
		vec3.add(segundaDerivada, segundaDerivada, p2);

		vec3.normalize(segundaDerivada, segundaDerivada);

		return segundaDerivada; 
	}

	getBinormal(u) {
		
		var vectortangentee = this.getTangente(u);
		var vectorBinormal = vec3.fromValues(u);
		var segundaDerivada = this.getSegundaDerivada(u);

		vec3.cross(vectorBinormal, segundaDerivada, vectortangentee);
		vec3.normalize(vectorBinormal, vectorBinormal);

		return vec3.fromValues(0,-1,0);

	}
}

class multiplesBezierCuadratica extends Curva {

	constructor(){		
		super();
		this.curvas = [];
	}

	cargarPuntosDeControl(puntos){
		this.puntosDeControl = puntos;
		this.inicializarCurva();
	}

	inicializarCurva(){
		for(let i = 0; i < this.puntosDeControl.length-1; i+=2){
			var nuevaCurva = new BezierCuadratica();
			nuevaCurva.setPuntosDeControl(this.puntosDeControl[i],this.puntosDeControl[i+1],this.puntosDeControl[i+2]);
			this.curvas.push(nuevaCurva);		
		}
	}

	getPosicion(u){
	
		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1));

        //REFACTOR: Ver si hay una forma más elegante de solucionarlo
		if(numCurvas == this.curvas.length) {
			numCurvas = this.curvas.length-1;
			t = this.curvas.length-0.0000001;
		}
		
		return (this.curvas[numCurvas]).getPosicion(t%1);
	}

	getTangente(u){
	
		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1));

		if(numCurvas == this.curvas.length) {
			numCurvas = this.curvas.length-1;
			t = this.curvas.length-0.0000001;
		}

		return (this.curvas[numCurvas]).getTangente(t%1);
	}

	getNormal(u){
		
		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1)); 

		if(numCurvas == this.curvas.length) {
			numCurvas = this.curvas.length-1;
			t = this.curvas.length-0.0000001;
		}

		return (this.curvas[numCurvas]).getNormal(t%1);
	}
	
	getBinormal(u){

		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1));

		if(numCurvas == this.curvas.length) {
			numCurvas = this.curvas.length-1;
			t = this.curvas.length-0.0000001;
		}

		return (this.curvas[numCurvas]).getBinormal(t%1);
	}
}

class multiplesBSpineCuadratica extends Curva{

	constructor(){		
		super();
		this.curvas = [];
	}

	cargarPuntosDeControl(puntos){
		this.puntosDeControl = puntos;
		this.inicializarCurva();
	}

	inicializarCurva(){
		for(let i = 0; i < this.puntosDeControl.length-2; i+=1){
			var nuevaCurva = new BSplineCuadratica();
			nuevaCurva.setPuntosDeControl(this.puntosDeControl[i],this.puntosDeControl[i+1],this.puntosDeControl[i+2]);
			this.curvas.push(nuevaCurva);		
		}
	}

	getPosicion(u){
	
		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1));

        //REFACTOR: Ver si hay una forma más elegante de solucionarlo
		if(numCurvas == this.curvas.length) {
			numCurvas = this.curvas.length-1;
			t = this.curvas.length-0.0000001;
		}
		
		return (this.curvas[numCurvas]).getPosicion(t%1);
	}

	getTangente(u){
	
		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1));

		if(numCurvas == this.curvas.length) {
			numCurvas = this.curvas.length-1;
			t = this.curvas.length-0.0000001;
		}

		return (this.curvas[numCurvas]).getTangente(t%1);
	}

	getNormal(u){
		
		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1)); 

		if(numCurvas == this.curvas.length) {
			numCurvas = this.curvas.length-1;
			t = this.curvas.length-0.0000001;
		}

		return (this.curvas[numCurvas]).getNormal(t%1);
	}
	
	getBinormal(u){

		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1));

		if(numCurvas == this.curvas.length) {
			numCurvas = this.curvas.length-1;
			t = this.curvas.length-0.0000001;
		}

		return (this.curvas[numCurvas]).getBinormal(t%1);
	}
}

class BSplineCuadraticaCerrada extends Curva{
	constructor() {
		super();
		this.centro;
		this.curvas = []
	}

	setCentro(centro) {	this.centro = centro;}
	getCentro() {return this.centro;}

	cargarPuntosDeControl(puntos){
		this.puntosDeControl = puntos;
		this.inicializarCurva();
	}

	inicializarCurva(){
		for(let i = 0; i < this.puntosDeControl.length-2; i+=1){
			var nuevaCurva = new BSplineCuadratica();
			nuevaCurva.setPuntosDeControl(this.puntosDeControl[i],this.puntosDeControl[i+1],this.puntosDeControl[i+2]);
			this.curvas.push(nuevaCurva);		
		}
		var curvaCierre1 = new BSplineCuadratica();
		curvaCierre1.setPuntosDeControl(this.puntosDeControl[this.puntosDeControl.length-2],this.puntosDeControl[this.puntosDeControl.length-1],this.puntosDeControl[0]);
		this.curvas.push(curvaCierre1);
		var curvaCierre2 = new BSplineCuadratica();
		curvaCierre2.setPuntosDeControl(this.puntosDeControl[this.puntosDeControl.length-1],this.puntosDeControl[0],this.puntosDeControl[1]);
		this.curvas.push(curvaCierre2);
	}

	getpuntosDeControl() {return this.puntosDeControl;}

	getNumPuntosDeControl() {return this.puntosDeControl.length;}

	getPosicion(u){
		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1));
		return (this.curvas[numCurvas]).getPosicion(t%1);
	}

	getTangente(u){
		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1));
		return (this.curvas[numCurvas]).getTangente(t%1);
	}

	getNormal(u){
		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1)); 
		return (this.curvas[numCurvas]).getNormal(t%1);
	}
	
	getBinormal(u){
		var t = u*this.curvas.length; 
		var numCurvas = (t-(t%1));
		return (this.curvas[numCurvas]).getBinormal(t%1);
	}
}

function discretizarCurva(curva, d) {


	var posiciones = [];
	var tangentes = [];
	var binormales = [];
	var normales = [];

	var posicion = vec3.create();
	var tangente = vec3.create();
	var binormal = vec3.create();
	var normal = vec3.create();

	for (var i = 0; i <= 1; i+=d) {
		
		posicion = curva.getPosicion(i);
		tangente = curva.getTangente(i);
		binormal = curva.getBinormal(i);
		normal = curva.getNormal(i);

		posiciones.push(posicion);
		tangentes.push(tangente);
		binormales.push(binormal);
		normales.push(normal);
	}

	return {
		
		posiciones: posiciones,
		tangentes: tangentes,
		binormales: binormales,
		normales: normales
	};
}