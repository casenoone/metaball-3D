onload = function() {


	MFAC.gl.enable(MFAC.gl.DEPTH_TEST);//开启隐藏面消除
	//MFAC.gl.enable(MFAC.gl.BLEND);//开启混合功能
	//MFAC.gl.blendFunc(MFAC.gl.SRC_ALPHA, MFAC.gl.SRC_COLOR);//指定混合函数

	var shader  = new MFAC.Shaders();
	var vshader = shader.createShader("vs", '../shaders/1.vert');
	var fshader = shader.createShader("fs", '../shaders/1.frag');
	var prg     = shader.createProgram(vshader,fshader);

	/*****纹理shader*****/

    /*var shader_Texture  = new MFAC.Shaders();
    var vshader_Texture = shader_Texture.createShader("vs", '../shaders/texture.vert');
    var fshader_Texture = shader_Texture.createShader("fs", '../shaders/texture.frag');
    var prg_Texture     = shader_Texture.createProgram(vshader_Texture, fshader_Texture);
    */
    
    /*****纹理shader*****/


    var attlocation = new Array();//返回值与着色器中变量定义的顺序一致，例如着色器中先定义position变量，那么“position”代入函数返回的值就是
    attlocation[0] = MFAC.gl.getAttribLocation(prg, 'position');
    attlocation[1] = MFAC.gl.getAttribLocation(prg, 'color');
    attlocation[2] = MFAC.gl.getAttribLocation(prg, 'normal');


    var attstride = new Array();
    attstride[0] = 3;//坐标分量数
    attstride[1] = 4;//颜色分量数
    attstride[2] = 3;//法线分量数

    var unilocation = new Array();
    unilocation[0] = MFAC.gl.getUniformLocation(prg, 'mvpMatrix');
    unilocation[1] = MFAC.gl.getUniformLocation(prg, 'invMatrix');
    unilocation[2] = MFAC.gl.getUniformLocation(prg, 'lightDirection');
    unilocation[3] = MFAC.gl.getUniformLocation(prg, 'ambientColor');
    unilocation[4] = MFAC.gl.getUniformLocation(prg, 'eyeDirection');
    unilocation[5] = MFAC.gl.getUniformLocation(prg, 'axis');

    var MatIV = new MFAC.MatIV();
  	var mMatrix   = MatIV.identity(MatIV.create());
    var vMatrix   = MatIV.identity(MatIV.create());
    var pMatrix   = MatIV.identity(MatIV.create());
    var tmpMatrix = MatIV.identity(MatIV.create());
    var mvpMatrix = MatIV.identity(MatIV.create());
    var invMatrix = MatIV.identity(MatIV.create());

    var lightDirection = [28, 10, 50];//平行光
    var ambientColor   = [0.1,0.1,0.1];
    var eyeDirection   = [0.6, 0.6, 0.6];
    MFAC.gl.uniform3fv(unilocation[3], ambientColor);

    var camera = new MFAC.Camera.perspectiveCamera();
    //vMatrix    = camera.lookAt([20, 20, 50], [0, 0, 0], [0, 1, 0],vMatrix);
    vMatrix    = camera.lookAt([0, 0, 50], [0, 0, 0], [0, 1, 0],vMatrix);
    pMatrix    = camera.perspective(45, MFAC.CanvasType.width / MFAC.CanvasType.height, 0.1, 1000, pMatrix);
    //MatIV.translate(vMatrix, [20,0,0],vMatrix)

    camera.initlize(pMatrix,vMatrix);
    MatIV.multiply(pMatrix, vMatrix, tmpMatrix);

    var trackball = new MFAC.TrackBall(camera,0);

    var scene = new MFAC.Scene();
    var axis = new MFAC.Geometry.axis();
    scene.add(axis);

    var sphere1 = new MFAC.Geometry.sphere(new MFAC.Vector3(9 ,9 ,0), 0.5);
    //scene.add(sphere1);

    var sphere2 = new MFAC.Geometry.sphere(new MFAC.Vector3(-9 ,-9 ,0), 0.5);
    //scene.add(sphere2);

    var sphere3 = new MFAC.Geometry.sphere(new MFAC.Vector3(-9 ,9 ,0), 0.5);
    //scene.add(sphere3);

    var sphere4 = new MFAC.Geometry.sphere(new MFAC.Vector3(9 ,-9 ,0), 0.5);
    //scene.add(sphere4);

	/************************METABALL2.0 START*************************/

    var grass_Position = new Float32Array([

         -11, 11, 0,
          11, 11, 0,
         -11,-11, 0,
          11,-11, 0,               
                        ]);

    

    var grass_Color = new Float32Array([

           0, 0, 1, 1, 
           0, 0, 1, 1,
           0, 0, 1, 1,
           0, 0, 1, 1,           

                       ]);


    var grass_Index = new Uint8Array([

                  0, 1, 2, 
                  2, 3, 1     

                     ]);


                 
    var grass = new MFAC.Geometry.mesh(grass_Position, grass_Color, grass_Index);
    scene.add(grass);
    var maxGridSize = 60;
    var minGridSize = 10;
    var gridSize    = 60;
    var threshold   = 1;
    var edgeTable = getEdgeTable();
    var triTable  = getTriangle();

    var verticesAtEndsOfEdges = new Array();
    verticesAtEndsOfEdges = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];
    
    var METABALL = function(position, squaredRadius) {

        this.position = position;
        this.squaredRadius = squaredRadius;

    }

    var SURFACE_VERTEX = function() {

        this.position = new MFAC.Vector3(0, 0, 0);
        this.normal = new MFAC.Vector3(0, 0, 0);

    }

    var CUBE_GRID_VERTEX = function() {

        this.position = new MFAC.Vector3(0, 0, 0);
        this.value = 0;
        this.normal = new MFAC.Vector3(0, 0, 0);

    }

    var CUBE_GRID_CUBE = function() {

        this.vertices = new Array();
        for(var i = 0; i < 8; i++) {

            this.vertices[i] = new CUBE_GRID_VERTEX();

        }

    }

    var CUBE_GRID = function() {

        this.numVertices = 0;
        this.vertices = new Array();
        this.numFacesDrawn = 0;
        this.cubes = new Array();
        this.numCubes = 0;
    }

    CUBE_GRID.prototype = {

        CreateMemory : function() {

            var L1 = (maxGridSize + 1) * (maxGridSize + 1) * (maxGridSize + 1);
            for(var i = 0; i < L1; i++) {

                this.vertices[i] = new CUBE_GRID_VERTEX();

            }

            var L2 = maxGridSize * maxGridSize * maxGridSize;
            for(var j = 0; j < L2; j++) {

                this.cubes[j] = new CUBE_GRID_CUBE();

            }

            
        },

         Init : function(gridSize) {//初始化也不会出问题

            this.numVertices = (gridSize + 1) * (gridSize + 1) * (gridSize + 1);
             var  currentVertex = 0;

             for(var i = 0; i < gridSize + 1; i++) {

                for(var j = 0; j < gridSize + 1; j++) {

                    for(var k = 0; k < gridSize + 1; k++) {

                        this.vertices[currentVertex].position = new MFAC.Vector3((i * 20) / (gridSize) - 10, (j * 20) / (gridSize) - 10, (k * 20) / (gridSize) - 10);
                        currentVertex++;
                    }

                }

             }
            

            this.numCubes = (gridSize) * (gridSize) * (gridSize);

            var currentCube = 0;

            for(var i = 0; i < gridSize; i++) {

                for(var j = 0; j < gridSize; j++) {

                    for(var k = 0; k < gridSize; k++) {
                        //赋值地址
                        this.cubes[currentCube].vertices[0] = this.vertices[(i*(gridSize+1)+j)*(gridSize+1)+k];
                        this.cubes[currentCube].vertices[1] = this.vertices[(i*(gridSize+1)+j)*(gridSize+1)+k+1];
                        this.cubes[currentCube].vertices[2] = this.vertices[(i*(gridSize+1)+(j+1))*(gridSize+1)+k+1];
                        this.cubes[currentCube].vertices[3] = this.vertices[(i*(gridSize+1)+(j+1))*(gridSize+1)+k];
                        this.cubes[currentCube].vertices[4] = this.vertices[((i+1)*(gridSize+1)+j)*(gridSize+1)+k];
                        this.cubes[currentCube].vertices[5] = this.vertices[((i+1)*(gridSize+1)+j)*(gridSize+1)+k+1];
                        this.cubes[currentCube].vertices[6] = this.vertices[((i+1)*(gridSize+1)+(j+1))*(gridSize+1)+k+1];
                        this.cubes[currentCube].vertices[7] = this.vertices[((i+1)*(gridSize+1)+(j+1))*(gridSize+1)+k];

                        currentCube++;
                    }

                }

             }


        },

        DrawSurface : function(threshold) {//顶点势能计算是正常的。那么只可能是在根据顶点势能计算线上的点的时候出现错误

            this.numFacesDrawn = 0;
            var edgeVertices = new Array();
            for(var i = 0; i < 12; i++) {

                edgeVertices[i] = new SURFACE_VERTEX();

            }
            
            for(var i = 0; i < this.numCubes; i++) {

                var cubeIndex = 0;//每个体素的顶点有256种情况，用edgeTable[256]来保存这256种情况

                if(this.cubes[i].vertices[0].value < threshold) {

                    cubeIndex |= 1;

                }

                 if(this.cubes[i].vertices[1].value < threshold) {

                    cubeIndex |= 2;

                }

                if(this.cubes[i].vertices[2].value < threshold) {

                    cubeIndex |= 4;

                }

                 if(this.cubes[i].vertices[3].value < threshold) {

                    cubeIndex |= 8;

                }

                if(this.cubes[i].vertices[4].value < threshold) {

                    cubeIndex |= 16;

                }

                 if(this.cubes[i].vertices[5].value < threshold) {

                    cubeIndex |= 32;

                }

                if(this.cubes[i].vertices[6].value < threshold) {

                    cubeIndex |= 64;

                }

                 if(this.cubes[i].vertices[7].value < threshold) {

                    cubeIndex |= 128;

                }

                var usedEdges = edgeTable[cubeIndex];

                if(usedEdges==0 || usedEdges==255)
                    continue;

                for(var currentEdge = 0; currentEdge < 12; currentEdge++) {//遍历体素中的12条边

                    if(usedEdges & 1<<currentEdge) {

                        var v1 = this.cubes[i].vertices[verticesAtEndsOfEdges[currentEdge*2]];
                        var v2 = this.cubes[i].vertices[verticesAtEndsOfEdges[currentEdge*2+1]];
                        var delta = (threshold - v1.value) / (v2.value - v1.value);
                    
                        edgeVertices[currentEdge].position.x = v1.position.x + delta * (v2.position.x - v1.position.x);
                        edgeVertices[currentEdge].position.y = v1.position.y + delta * (v2.position.y - v1.position.y);
                        edgeVertices[currentEdge].position.z = v1.position.z + delta * (v2.position.z - v1.position.z);

                        edgeVertices[currentEdge].normal.x = v1.normal.x + delta * (v2.normal.x - v1.normal.x);
                        edgeVertices[currentEdge].normal.y = v1.normal.y + delta * (v2.normal.y - v1.normal.y);
                        edgeVertices[currentEdge].normal.z = v1.normal.z + delta * (v2.normal.z - v1.normal.z);

                    }

                }

                for(var k = 0; triTable[cubeIndex][k] != -1; k+=3) {
                
                    var x1 = edgeVertices[triTable[cubeIndex][k+0]].position.x;
                    var y1 = edgeVertices[triTable[cubeIndex][k+0]].position.y;
                    var z1 = edgeVertices[triTable[cubeIndex][k+0]].position.z;
                    var x2 = edgeVertices[triTable[cubeIndex][k+1]].position.x;
                    var y2 = edgeVertices[triTable[cubeIndex][k+1]].position.y;
                    var z2 = edgeVertices[triTable[cubeIndex][k+1]].position.z;
                    var x3 = edgeVertices[triTable[cubeIndex][k+2]].position.x;
                    var y3 = edgeVertices[triTable[cubeIndex][k+2]].position.y;
                    var z3 = edgeVertices[triTable[cubeIndex][k+2]].position.z;

                    var Nx1 = edgeVertices[triTable[cubeIndex][k+0]].normal.x;
                    var Ny1 = edgeVertices[triTable[cubeIndex][k+0]].normal.y;
                    var Nz1 = edgeVertices[triTable[cubeIndex][k+0]].normal.z;
                    var Nx2 = edgeVertices[triTable[cubeIndex][k+1]].normal.x;
                    var Ny2 = edgeVertices[triTable[cubeIndex][k+1]].normal.y;
                    var Nz2 = edgeVertices[triTable[cubeIndex][k+1]].normal.z;
                    var Nx3 = edgeVertices[triTable[cubeIndex][k+2]].normal.x;
                    var Ny3 = edgeVertices[triTable[cubeIndex][k+2]].normal.y;
                    var Nz3 = edgeVertices[triTable[cubeIndex][k+2]].normal.z;
                    

                    var ve_T = new Float32Array([

                        x1, y1, z1,
                        x2, y2, z2,
                        x3, y3, z3,
        
                        ]);

                    var a, b, c;
                        a = 1;
                        b = 0;
                        c = 0;
                
                    var color_T = new Float32Array([

                        a, b, c, 1,
                        a, b, c, 1,
                        a, b, c, 1

                        ]);


                    var index_T = new Uint8Array([

                        0, 1, 2

                        ]);

                    var normal = new Float32Array([
                        
                        Nx1, Ny1, Nz1,
                        Nx2, Ny2, Nz2,
                        Nx3, Ny3, Nz3

                    ]);

                 
                        var triangle = new MFAC.Geometry.mesh(ve_T, color_T, index_T);
                    
                        //triangle.drawType = MFAC.gl.LINES;
                        scene.add(triangle);
                    
                        this.numFacesDrawn++;

                }
            } 
           
        },


    }

   
    function UpdateFrame() {//为什么半径超过一定限度球体就不会变大了？这个函数肯定没有问题，也就是说，每一个顶点的势能的计算是没有问题的

        for(var i=0; i < cubeGrid.numVertices; i++) {
            cubeGrid.vertices[i].value = 0;
            cubeGrid.vertices[i].normal.LoadZero();
        }


        var ballToPoint = new MFAC.Vector3(0, 0, 0);
        var squaredRadius = 0;
        var ballPosition = 0;
        var normalScale = 0;

        for(var i = 0; i < numMetaballs; i++) {

            squaredRadius = metaballs[i].squaredRadius;
            ballPosition = metaballs[i].position;
            for(var j = 0; j < cubeGrid.numVertices; j++) {

                ballToPoint.x = cubeGrid.vertices[j].position.x - ballPosition.x;
                ballToPoint.y = cubeGrid.vertices[j].position.y - ballPosition.y;
                ballToPoint.z = cubeGrid.vertices[j].position.z - ballPosition.z;

                var squaredDistance = ballToPoint.x * ballToPoint.x + ballToPoint.y * ballToPoint.y + ballToPoint.z * ballToPoint.z;
                if(squaredDistance == 0) {

                    squaredDistance = 0.0001;

                }

                
                var z = cubeGrid.vertices[j].position.z;
                var z0= metaballs[i].position.z;
                var square_R = metaballs[i].squaredRadius;
                var r = Math.sqrt(metaballs[i].squaredRadius);
                var cos_th = 0.5;
                var E = 0;
                //if(z >= r*cos_th + z0) {

                    
                    
                    if(squaredDistance > squaredRadius ) {

                        E = 0;

                    }
                    else {

                        var temp1 = (1 - (squaredDistance / squaredRadius));
                        E = temp1 * temp1 * temp1 * temp1 / squaredDistance; 
                        //E = squaredRadius / squaredDistance;
                    }
                    

                    cubeGrid.vertices[j].value += E;
                    //cubeGrid.vertices[j].value += (1 - (squaredRadius / squaredDistance)) * ((1 - (squaredRadius / squaredDistance))) / squaredDistance; //顶点势能计算
                    //cubeGrid.vertices[j].value += squaredRadius / squaredDistance
                    normalScale = squaredRadius / (squaredDistance * squaredDistance);

                    cubeGrid.vertices[j].normal.x += ballToPoint.x * normalScale;
                    cubeGrid.vertices[j].normal.y += ballToPoint.y * normalScale;
                    cubeGrid.vertices[j].normal.z += ballToPoint.z * normalScale;

               //}
            
            }

        }

    }

    /********************纹理配置***************/
    
    /*MFAC.Init.setBackColor();//设置背景色

    var n = initVertexBuffers();
    initTextures(n);

    function initVertexBuffers() {

        var verticesTexCoords = new Float32Array([
        
        // 顶点坐标， 纹理坐标
        -0.5,  0.5,  0.0, 1.0,
        -0.5, -0.5,  0.0, 0.0,
         0.5,  0.5,  1.0, 1.0,
         0.5, -0.5,  1.0, 0.0
        
        ]);

        var n = 4;

        var vertexTexCoordBuffer = MFAC.gl.createBuffer();
        MFAC.gl.bindBuffer(MFAC.gl.ARRAY_BUFFER, vertexTexCoordBuffer);
        MFAC.gl.bufferData(MFAC.gl.ARRAY_BUFFER, verticesTexCoords, MFAC.gl.STATIC_DRAW);
        
        var FSIZE = verticesTexCoords.BYTES_PER_ELEMENT;

        //var a_Position = MFAC.gl.getAttribLocation(prg, 'a_Position');
        var a_Position = attlocation[0];

        MFAC.gl.vertexAttribPointer(a_Position, 2, MFAC.gl.FLOAT, false, FSIZE * 4, 0);
        MFAC.gl.enableVertexAttribArray(a_Position);  // Enable the assignment of the buffer object

        var a_TexCoord = MFAC.gl.getAttribLocation(prg, 'a_TexCoord');
        
        MFAC.gl.vertexAttribPointer(a_TexCoord, 2, MFAC.gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
        MFAC.gl.enableVertexAttribArray(a_TexCoord);  // Enable the assignment of the buffer object
        return n;

    }

    function initTextures(n) {

        var texture = MFAC.gl.createTexture();
        if(!texture) {

            alert("创建纹理对象失败");
            return false;

        }

        var u_Sampler = MFAC.gl.getUniformLocation(prg, 'u_Sampler');
        
        if(!u_Sampler) {

            alert("获取变量u_Sampler失败");
            return false;

        }

        var image = new Image();
        image.onload = function(ev) {

            loadTexture(n, texture, u_Sampler, image);


        }

        image.src = '../images/sky.JPG';

        return true;
    }

    function loadTexture(n, texture, u_Sampler, image) {

        MFAC.gl.pixelStorei(MFAC.gl.UNPACK_FLIP_Y_WEBGL, 1);
        MFAC.gl.activeTexture(MFAC.gl.TEXTURE0);
        MFAC.gl.bindTexture(MFAC.gl.TEXTURE_2D,texture);
        MFAC.gl.texParameteri(MFAC.gl.TEXTURE_2D, MFAC.gl.TEXTURE_MIN_FILTER, MFAC.gl.LINEAR);
        MFAC.gl.texImage2D(MFAC.gl.TEXTURE_2D, 0, MFAC.gl.RGB, MFAC.gl.RGB, MFAC.gl.UNSIGNED_BYTE, image);
        MFAC.gl.uniform1i(u_Sampler, 0);
        MFAC.gl.clear(MFAC.gl.COLOR_BUFFER_BIT);
        MFAC.gl.drawArrays(MFAC.gl.TRIANGLE_STRIP, 0, n);
    }



    /********************纹理配置***************/






    var numMetaballs = 20;

    var cubeGrid = new CUBE_GRID();
    var metaballs = new Array();
    
    function calculateRainDropWeight(cos_th, m) {

        var r = Math.pow((3 * m / (Math.PI*(2 + cos_th * cos_th * cos_th - 3 * cos_th))),0.33);
        return r;
    }

    
    var count_1 = 9;
    for(var i = 0; i < numMetaballs; i++) {

        
        var factor1 = Math.random();
        var factor2 = Math.random();
        if(factor1 > 0.5) 
            factor1 = 1;
        else
            factor1 = -1;

        if(factor2 > 0.5) 
            factor2 = 1;
        else
            factor2 = -1;
    
        metaballs[i] = new METABALL(new MFAC.Vector3(factor1*Math.random()*10, factor2*Math.random()*10, 0), 2); // 9*9*9
        //count_1-=2;
    }
       
    
  
    cubeGrid.CreateMemory();
    cubeGrid.Init(gridSize);
    UpdateFrame();
    cubeGrid.DrawSurface(threshold);
    
    render();
        
    function render() {

        MFAC.Init.setBackColor();//设置背景色

        MFAC.gl.uniform3fv(unilocation[2], lightDirection);
        MFAC.gl.uniform3fv(unilocation[4], eyeDirection);
        MFAC.gl.uniformMatrix4fv(unilocation[1], false, invMatrix);

        
        var object = scene.next;
        while(object){

            if(object.geometry.name == "axis"){

                MFAC.gl.uniform1f(unilocation[5], 0.0);

            }
            else{

                MFAC.gl.uniform1f(unilocation[5], 1.0);

            }
            
            if(object.geometry.name != "axis"){

                //MatIV.rotate(object.geometry.mMatrix, 0.05, [1, 0 ,0], object.geometry.mMatrix);
                //MatIV.translate(object.geometry.mMatrix,  [0, 0 ,1 ],  object.geometry.mMatrix);//平移
                //object.geometry.atLocation(10, 10, 10);//定位物体
                //MatIV.scale(object.geometry.mMatrix, [0.9, 0.9, 0.9], object.geometry.mMatrix);
            }

            //MFAC.gl.depthMask(false);
            traverseOpt(object.geometry,attlocation, attstride, unilocation,tmpMatrix)
            //MFAC.gl.depthMask(true);
            object = object.next;

        }
        
        trackball.update();
        
        camera.lookAt([camera.position.x, camera.position.y, camera.position.z], [camera.center.x, camera.center.y, camera.center.z], [camera.up.x, camera.up.y, camera.up.z],vMatrix);
        lightDirection = [camera.vMatrix[2],camera.vMatrix[6],camera.vMatrix[10]]

        MatIV.multiply(pMatrix, vMatrix, tmpMatrix);

        requestAnimationFrame(render);

    }

    

    /************************METABALL2.0 END*************************/


	
    //MatIV.translate(scene.next.geometry.mMatrix,  [4, 4 ,0 ],  scene.next.geometry.mMatrix);//平移
    
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

            vMatrix    = camera.lookAt([0, 0, 50], [0, 0, 0], [0, 1, 0],vMatrix);
            camera.initlize(pMatrix,vMatrix);
        
        }

    }
    
    var gui = new dat.GUI();
    gui.add(controls,'Frontview').name("正视图");
    gui.add(controls,'openSphere').name("导入球颗粒");
    gui.add(controls,'openFace').name("导入固定面");

}
