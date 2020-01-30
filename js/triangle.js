onload = function() {


	//MFAC.gl.enable(MFAC.gl.DEPTH_TEST);//开启隐藏面消除
    MFAC.gl.enable(MFAC.gl.BLEND);//开启混合功能
    MFAC.gl.blendFunc(MFAC.gl.SRC_ALPHA, MFAC.gl.ONE_MINUS_SRC_ALPHA);//指定混合函数

    var shader  = new MFAC.Shaders();
	var vshader = shader.creatShader("vs", '../shaders/2.vert');
	var fshader = shader.creatShader("fs", '../shaders/2.frag');
	var prg     = shader.createProgram(vshader,fshader);

	var attlocation = new Array();//返回值与着色器中变量定义的顺序一致，例如着色器中先定义position变量，那么“position”代入函数返回的值就是
    attlocation[0] = MFAC.gl.getAttribLocation(prg, 'a_Position');
    attlocation[1] = MFAC.gl.getAttribLocation(prg, 'a_Color');
    

    var attstride = new Array();
    attstride[0] = 3;//坐标分量数
    attstride[1] = 4;//颜色分量数
    

    var unilocation = new Array();
    unilocation[0] = MFAC.gl.getUniformLocation(prg, 'mvpMatrix');
    

    var MatIV = new MFAC.MatIV();
  	var mMatrix   = MatIV.identity(MatIV.create());
    var vMatrix   = MatIV.identity(MatIV.create());
    var pMatrix   = MatIV.identity(MatIV.create());
    var tmpMatrix = MatIV.identity(MatIV.create());
    var mvpMatrix = MatIV.identity(MatIV.create());
    
    var camera = new MFAC.Camera.perspectiveCamera();
    vMatrix    = camera.lookAt([0.20, 0.25, 0.25], [0, 0, 0], [0, 1, 0],vMatrix);
    pMatrix    = camera.perspective(45, MFAC.CanvasType.width / MFAC.CanvasType.height, 0.1, 1000, pMatrix);

    camera.initlize(pMatrix,vMatrix);
    MatIV.multiply(pMatrix, vMatrix, tmpMatrix);

    var trackball = new MFAC.TrackBall(camera,0);

    var scene = new MFAC.Scene();
    var axis = new MFAC.Geometry.axis();
    scene.add(axis);

    
    var ve_T = new Float32Array([

    	1.5,  1.4,  -1.2,  
       -1.5,  1.4,  -1.2,  
        1.0, -1.6,  -1.2,  
    	
        ]);

    var color_T = new Float32Array([

    	1, 0, 0, 1.0,
    	1, 0, 0, 1.0,
    	1, 0, 0, 1.0

    	]);


    var index_T = new Uint8Array([

    	0, 1, 2

    	]);

    var triangle = new MFAC.Geometry.mesh(ve_T, color_T, index_T);

     var v0 = new Float32Array([

    	0.0,  0.5,  -0.4,   // The back green one
       -0.5, -0.5,  -0.4,  
        0.5, -0.5,  -0.4,   
   
        0.5,  0.4,  -0.2,   // The middle yerrow one
       -0.5,  0.4,  -0.2,  
        0.0, -0.6,  -0.2,   

        0.0,  0.5,   0.0,   // The front blue one 
       -0.5, -0.5,   0.0,  
        0.5, -0.5,   0.0,   

    	]);

    var c0 = new Float32Array([

    	0.4,  1.0,  0.4,  0.9,
        0.4,  1.0,  0.4,  0.9,
        1.0,  0.4,  0.4,  0.9,


        1.0,  0.4,  0.4,  0.4,
    	1.0,  1.0,  0.4,  0.4,
    	1.0,  1.0,  0.4,  0.4, 

    	0.4,  0.4,  1.0,  0.4, 
    	0.4,  0.4,  1.0,  0.4,
    	1.0,  0.4,  0.4,  0.4, 

    	]);


    var i0 = new Uint8Array([

    	6, 7, 8,
        3, 4, 5,
    	0, 1, 2,

    	]);

    var front = new MFAC.Geometry.mesh(v0, c0, i0);
    
    //scene.add(triangle);
    scene.add(front);


    render();

	

	function render() {

		MFAC.Init.setBackColor();//设置背景色

		var object = scene.next;
		while(object){

			//MFAC.gl.depthMask(false);
			traverseOpt(object.geometry,attlocation, attstride, unilocation,tmpMatrix)
			//MFAC.gl.depthMask(true);
			object = object.next;

		}
		
		trackball.update();
        
        camera.lookAt([camera.position.x, camera.position.y, camera.position.z], [camera.center.x, camera.center.y, camera.center.z], [camera.up.x, camera.up.y, camera.up.z],vMatrix);

    	MatIV.multiply(pMatrix, vMatrix, tmpMatrix);

		requestAnimationFrame(render);

	}

	function traverseOpt(object, attlocation, attstride, unilocation, tmpMatrix) {

		MFAC.Init.setAttribute([object.posvbo ,object.colvbo, object.norvbo],attlocation,attstride);//绑定当前顶点缓冲区
      	MFAC.gl.bindBuffer(MFAC.gl.ELEMENT_ARRAY_BUFFER, object.ibo);//绑定当前索引缓冲区
        object.matIV.multiply(tmpMatrix, object.mMatrix, object.mvpMatrix);
        MFAC.gl.uniformMatrix4fv(unilocation[0], false, object.mvpMatrix);
        MFAC.gl.drawElements(object.drawType, object.index.length, MFAC.gl.UNSIGNED_SHORT, 0);//object.oGl.LINE_LOOP:渲染成线框

	}//实在想不到更好的名字了


	var controls = new function () {

        this.openSphere = function(){
     		alert(camera.center.x)

        }

        this.openFace = function(){

          
        }

        this.Frontview = function(){            

        }

    }

    var gui = new dat.GUI();
    gui.add(controls,'Frontview').name("正视图");
    gui.add(controls,'openSphere').name("导入球颗粒");
    gui.add(controls,'openFace').name("导入固定面");

}