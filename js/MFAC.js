MFAC.Shaders = function() { }

MFAC.Shaders.prototype = {

	createShader : function(id, fileName){

		var shader;
     	var scriptElement = id;
     	var text = 0;
     	
     	switch(scriptElement){

            	case 'vs':
                	shader = MFAC.gl.createShader(MFAC.gl.VERTEX_SHADER);
                	break;

            	case 'fs':
                	shader = MFAC.gl.createShader(MFAC.gl.FRAGMENT_SHADER);
                	break;

            	default :
                	return;   

      		}


     	var request = new XMLHttpRequest();
     	request.onreadystatechange = function() {
     		
      		if(request.readyState == 4 && request.status != 404) {

     			text = request.responseText;
      			MFAC.gl.shaderSource(shader, text);
      			MFAC.gl.compileShader(shader);
      			
     		}

      		
     	}

     	request.open('GET', fileName, false);
     	request.send();
     	
     	if(MFAC.gl.getShaderParameter(shader, MFAC.gl.COMPILE_STATUS)){
          			
          			return shader;

       			}
       			else{

            		alert(MFAC.gl.getShaderInfoLog(shader));

       			}

	},

	createProgram : function(vs, fs) {
		
		var program = MFAC.gl.createProgram();
     	MFAC.gl.attachShader(program,vs);
     	MFAC.gl.attachShader(program,fs);
     	MFAC.gl.linkProgram(program);
     	if(MFAC.gl.getProgramParameter(program,MFAC.gl.LINK_STATUS)){

        	MFAC.gl.useProgram(program);
        	return program;

     	}
     	else{

        	alert(MFAC.gl.getProgramInfoLog(program));

     	}

	},


}



MFAC.Init.setAttribute = function(vbo,attL,attS,){
    
    for(var i in vbo){
       
       if(vbo[i] != null){
       		
       		MFAC.gl.bindBuffer(MFAC.gl.ARRAY_BUFFER, vbo[i]);
       		MFAC.gl.enableVertexAttribArray(attL[i]);
      		MFAC.gl.vertexAttribPointer(attL[i], attS[i], MFAC.gl.FLOAT, false, 0, 0);
    	}
    }

}


MFAC.Init.createIbo = function(data){

    var ibo = MFAC.gl.createBuffer();
    MFAC.gl.bindBuffer(MFAC.gl.ELEMENT_ARRAY_BUFFER, ibo);
    MFAC.gl.bufferData(MFAC.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), MFAC.gl.DYNAMIC_DRAW);
    MFAC.gl.bindBuffer(MFAC.ELEMENT_ARRAY_BUFFER, null);

    return ibo;   

}


MFAC.Init.createVbo = function(data){

    var vbo = MFAC.gl.createBuffer();
    MFAC.gl.bindBuffer(MFAC.gl.ARRAY_BUFFER, vbo);
    MFAC.gl.bufferData(MFAC.gl.ARRAY_BUFFER, new Float32Array(data), MFAC.gl.STATIC_DRAW);
    MFAC.gl.bindBuffer(MFAC.gl.ARRAY_BUFFER, null);

    return vbo;

}

MFAC.Init.setBackColor = function(color){//设置背景色

    MFAC.gl.clearColor(0.0, 0.0, 0.9, 0.2);
    MFAC.gl.clearDepth(1.0);
    MFAC.gl.clear(MFAC.gl.COLOR_BUFFER_BIT | MFAC.gl.DEPTH_BUFFER_BIT);
    
}



MFAC.Scene = function() { this.next = null; this.geometry = null; };

MFAC.Scene.prototype = {

	add : function(object) {

		var head = this;
		var temp = new MFAC.Scene();
		temp.geometry = object;
		temp.next = head.next;
		head.next = temp;

	}

}

MFAC.Camera.perspectiveCamera = function() {

}

MFAC.Camera.perspectiveCamera.prototype = {

	initlize : function(pMatrix, vMatrix) {

		this.pMatrix = pMatrix;
		this.vMatrix = vMatrix;
		this.eye     = new MFAC.Vector3(this.vMatrix[2], this.vMatrix[6], this.vMatrix[10]);//相机视线，用于实时改变光线
		this.up      = new MFAC.Vector3(this.vMatrix[1], this.vMatrix[5], this.vMatrix[9]);//相机上方向
	},

	lookAt : function(eye, center, up, dest) {

		this.position= new MFAC.Vector3(eye[0], eye[1], eye[2]);//相机位置
		this.center  = new MFAC.Vector3(center[0], center[1], center[2]);

		var eyeX    = eye[0],    eyeY    = eye[1],    eyeZ    = eye[2],
            upX     = up[0],     upY     = up[1],     upZ     = up[2],
            centerX = center[0], centerY = center[1], centerZ = center[2];
        if(eyeX == centerX && eyeY == centerY && eyeZ == centerZ){return this.identity(dest);}
        var x0, x1, x2, y0, y1, y2, z0, z1, z2, l;
        z0 = eyeX - center[0]; z1 = eyeY - center[1]; z2 = eyeZ - center[2];
        l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
        z0 *= l; z1 *= l; z2 *= l;
        x0 = upY * z2 - upZ * z1;
        x1 = upZ * z0 - upX * z2;
        x2 = upX * z1 - upY * z0;
        l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
        if(!l){
            x0 = 0; x1 = 0; x2 = 0;
        } else {
            l = 1 / l;
            x0 *= l; x1 *= l; x2 *= l;
        }
        y0 = z1 * x2 - z2 * x1; y1 = z2 * x0 - z0 * x2; y2 = z0 * x1 - z1 * x0;
        l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
        if(!l){
            y0 = 0; y1 = 0; y2 = 0;
        } else {
            l = 1 / l;
            y0 *= l; y1 *= l; y2 *= l;
        }
        dest[0] = x0; dest[1] = y0; dest[2]  = z0; dest[3]  = 0;
        dest[4] = x1; dest[5] = y1; dest[6]  = z1; dest[7]  = 0;
        dest[8] = x2; dest[9] = y2; dest[10] = z2; dest[11] = 0;
        dest[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
        dest[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
        dest[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
        dest[15] = 1;
        return dest;
        //z0 z1 z2是视线向量
        //y0 y1 y2 应该是相机的上方向
        //x0 x1 x2 是相机的右向量
	},

	perspective : function(fovy, aspect, near, far, dest) {

		var t = near * Math.tan(fovy * Math.PI / 360);
        var r = t * aspect;
        var a = r * 2, b = t * 2, c = far - near;
        dest[0] = near * 2 / a;
        dest[1] = 0;
        dest[2] = 0;
        dest[3] = 0;
        dest[4] = 0;
        dest[5] = near * 2 / b;
        dest[6] = 0;
        dest[7] = 0;
        dest[8] = 0;
        dest[9] = 0;
        dest[10] = -(far + near) / c;
        dest[11] = -1;
        dest[12] = 0;
        dest[13] = 0;
        dest[14] = -(far * near * 2) / c;
        dest[15] = 0;
        return dest;

	},

	cameraUpdate : function() {
		
		this.vMatrix[2] = this.eye.x;
		this.vMatrix[6] = this.eye.y;
		this.vMatrix[10]= this.eye.z;

		this.vMatrix[1] = this.up.x;
		this.vMatrix[5] = this.up.y;
		this.vMatrix[9] = this.up.z;
	
	}

}


//思路：把mesh当作父类，子类进行继承
MFAC.Geometry.mesh = function(position, color, index, transparency) {//法线没搞懂，应该可以自动计算出

	this.drawType     = MFAC.gl.TRIANGLES;
    this.name         = "mesh";
    this.position     = position;
    this.color        = color;
    this.normal       = new Array();
    this.index        = index;
    this.transparency = transparency | 1.0;

    var length = this.index.length;
    for(var i = 0; i < length; i += 3){

    	var t1 = this.index[i] * 3;
    	var t2 = this.index[i + 1] * 3;
    	var t3 = this.index[i + 2] * 3;
    	var p0 = new MFAC.Vector3(this.position[t1], this.position[t1 + 1], this.position[t1 + 2]);
    	var p1 = new MFAC.Vector3(this.position[t2], this.position[t2 + 1], this.position[t2 + 2]);
    	var p2 = new MFAC.Vector3(this.position[t3], this.position[t3 + 1], this.position[t3 + 2]);
    	var p01= p1.subtract(p0);
    	var p02= p2.subtract(p0);
    	var N = p01.cross(p02).normalize();
    	for(var j = 0; j < 3; j++){

    		this.normal.push(N.x);
    		this.normal.push(N.y);
    		this.normal.push(N.z);

    	}
    }

    //下面这些语句可以封装为一个方法，继承给其他geometry函数
    this.posvbo    = MFAC.Init.createVbo(this.position);
    this.colvbo    = MFAC.Init.createVbo(this.color);
    this.norvbo    = MFAC.Init.createVbo(this.normal);
    this.ibo       = MFAC.Init.createIbo(this.index);
    this.matIV     = new MFAC.MatIV();
    this.mMatrix   = this.matIV.identity(this.matIV.create());
    this.mvpMatrix = this.matIV.identity(this.matIV.create());

    

}

MFAC.Geometry.metaball  = function() {

    
    
}

MFAC.Geometry.cube = function(position, color, transparency) {

	this.drawType = MFAC.gl.TRIANGLES;
    this.name     = "mesh";
    this.transparency = transparency | 1.0
    this.position = position;
    this.normal   = new Array();
    this.color    = color;
    this.index    = new Uint8Array([

              0, 1, 2,   0, 2, 3,    // front
              4, 5, 6,   4, 6, 7,    // right
              8, 9,10,   8,10,11,    // up
              12,13,14,  12,14,15,    // left
              16,17,18,  16,18,19,    // down
              20,21,22,  20,22,23     // back

              ]);  

    
    var length = this.position.length;
    for(var i = 0; i < length; i += 12){

    	var line1 = new MFAC.Vector3(position[i] - position[i+3], position[i+1] - position[i+4], position[i+2] - position[i+5]);
    	var line2 = new MFAC.Vector3(position[i] - position[i+6], position[i+1] - position[i+7], position[i+2] - position[i+8]);
    	var N = line1.cross(line2);
    	N = N.normalize();
    	for(var j = 0; j < 4; j ++){

    		this.normal.push(N.x);
    		this.normal.push(N.y);
    		this.normal.push(N.z);

    	}

    }
    
    this.posvbo    = MFAC.Init.createVbo(this.position);
    this.colvbo    = MFAC.Init.createVbo(this.color);
    this.norvbo    = MFAC.Init.createVbo(this.normal);
    this.ibo       = MFAC.Init.createIbo(this.index);
    this.matIV     = new MFAC.MatIV();
    this.mMatrix   = this.matIV.identity(this.matIV.create());
    this.mvpMatrix = this.matIV.identity(this.matIV.create());

}


MFAC.Geometry.sphere = function(center, radius, transparency) {

	this.center       = center;
	this.radius       = radius;
	this.row          = 16;
	this.column       = 16;
	this.name         = "sphere";
	this.transparency = transparency | 1.0;
    this.position     = new Array();
	this.color        = new Array();
	this.normal       = new Array();
	this.index        = new Array();
	this.drawType     = MFAC.gl.TRIANGLES;

	var color = new MFAC.Color(Math.random() ,Math.random(), Math.random());

	for(var i = 0;i <= this.row; i++)
        {
     
         	var r  = Math.PI / this.row * i;
         	var ry = Math.cos(r);
         	var rr = Math.sin(r);
       
           	for(var ii = 0;ii <= this.column;ii++){
         
             	var tr = Math.PI * 2 / this.column * ii;
             	var tx = rr * radius * Math.cos(tr) + center.x;
             	var ty = ry * radius + center.y;
             	var tz = rr * radius * Math.sin(tr) + center.z;
             	var rx = rr * Math.cos(tr);
             	var rz = rr * Math.sin(tr);         
             	this.position.push(tx, ty, tz);
             	this.normal.push(rx, ry, rz);
             	this.color.push(color.r, color.b, color.g, 1.0);
       
           }
   
        }
    
       r = 0;
       for(i = 0; i < this.row; i++){
     
         for(ii = 0; ii < this.column; ii++){
        
            r = (this.column + 1) * i + ii;
            this.index.push(r, r + 1, r + this.column + 2);
            this.index.push(r, r + this.column + 2, r + this.column + 1);

      	 }	
       }


      this.posvbo    = MFAC.Init.createVbo(this.position);
      this.colvbo    = MFAC.Init.createVbo(this.color);
      this.norvbo    = MFAC.Init.createVbo(this.normal);
      this.ibo       = MFAC.Init.createIbo(this.index);
      this.matIV     = new MFAC.MatIV();
      this.mMatrix   = this.matIV.identity(this.matIV.create());
      this.mvpMatrix = this.matIV.identity(this.matIV.create());



}

var matIV = new MFAC.MatIV();

MFAC.Geometry.sphere.prototype = {

    atLocation : function(x, y, z) {

        var target = new MFAC.Vector3(x, y, z);
        var delta =  target.subtract(this.center);
        
        matIV.translate(this.mMatrix,  [delta.x, delta.y ,delta.z ],  this.mMatrix);//平移
        
        this.center.x = x;
        this.center.y = y;
        this.center.z = z;

    
    }

}




MFAC.Geometry.Circle = function() {



}

MFAC.Geometry.Circle.prototype = {



}


MFAC.Geometry.axis = function() {

	this.position = new Float32Array([
     
     	0,0,0, 0,0,10,//Z轴

     	0,0,0, 0,10,0,//Y轴

     	0,0,0, 10,0,0,//X轴

    ]);

    this.index = new Uint8Array([
 
       0,1,

       2,3,

       4,5

    ]);

    this.color = new Float32Array([

       1,0,0,1.0, 1,0,0,1.0,
      
       0,0,1,1.0, 0,0,1,1.0,
                 
       0,1,0,1.0, 0,1,0,1.0

    ]);

    this.drawType = MFAC.gl.LINES;
    this.name      = "axis";

    this.posvbo    = MFAC.Init.createVbo(this.position);
    this.colvbo    = MFAC.Init.createVbo(this.color);
    this.norvbo    = null;
    this.ibo       = MFAC.Init.createIbo(this.index);
    this.matIV     = new MFAC.MatIV();
    this.mMatrix   = this.matIV.identity(this.matIV.create());
    this.mvpMatrix = this.matIV.identity(this.matIV.create());

}

MFAC.Geometry.axis.prototype.fuck = function() {}

MFAC.Geometry.axis.prototype = {


}



MFAC.readFile.sphere = function() {}

MFAC.readFile.sphere.prototype = {

	getPosition : function() {

		return position;

	},


}


MFAC.readFile.triangle = function() {}

MFAC.readFile.triangle.prototype = {

	getIndex : function() {

		return index;

	},

	getPosition : function() {

		return position;

	},

	getColor : function() {

		return color;

	},

}



