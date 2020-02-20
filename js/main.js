onload = function() {


	MFAC.gl.enable(MFAC.gl.DEPTH_TEST);//开启隐藏面消除
	//MFAC.gl.enable(MFAC.gl.BLEND);//开启混合功能
	//MFAC.gl.blendFunc(MFAC.gl.SRC_ALPHA, MFAC.gl.SRC_COLOR);//指定混合函数

	var shader  = new MFAC.Shaders();
	var vshader = shader.creatShader("vs", '../shaders/1.vert');
	var fshader = shader.creatShader("fs", '../shaders/1.frag');
	var prg     = shader.createProgram(vshader,fshader);

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
    vMatrix    = camera.lookAt([20, 20, 50], [0, 0, 0], [0, 1, 0],vMatrix);
    pMatrix    = camera.perspective(45, MFAC.CanvasType.width / MFAC.CanvasType.height, 0.1, 1000, pMatrix);
    //MatIV.translate(vMatrix, [20,0,0],vMatrix)

    camera.initlize(pMatrix,vMatrix);
    MatIV.multiply(pMatrix, vMatrix, tmpMatrix);

    var trackball = new MFAC.TrackBall(camera,0);

    var scene = new MFAC.Scene();
    var axis = new MFAC.Geometry.axis();
    scene.add(axis);

    var sphere1 = new MFAC.Geometry.sphere(new MFAC.Vector3(20 ,20 ,20), 1.5);
    scene.add(sphere1);

    var sphere2 = new MFAC.Geometry.sphere(new MFAC.Vector3(0 ,0 ,0), 1.5);
    scene.add(sphere2);

    var sphere3 = new MFAC.Geometry.sphere(new MFAC.Vector3(0 ,20 ,20), 1.5);
    scene.add(sphere3);

    var sphere4 = new MFAC.Geometry.sphere(new MFAC.Vector3(20 ,0 ,20), 1.5);
    scene.add(sphere4);

    var sphere5 = new MFAC.Geometry.sphere(new MFAC.Vector3(0 ,0 ,20), 1.5);
    scene.add(sphere5);

    var sphere6 = new MFAC.Geometry.sphere(new MFAC.Vector3(20 ,20 ,0), 1.5);
    scene.add(sphere6);

    var sphere7 = new MFAC.Geometry.sphere(new MFAC.Vector3(0 ,20 ,0), 1.5);
    scene.add(sphere7);

    var sphere8 = new MFAC.Geometry.sphere(new MFAC.Vector3(20 ,0 ,0), 1.5);
    scene.add(sphere8);

    var vertices = new Float32Array([//32位浮点数，4个字节

              5.0, 5.0, 5.0,  -5.0, 5.0, 5.0,  -5.0,-5.0, 5.0,   5.0,-5.0, 5.0, // v0-v1-v2-v3 front
              5.0, 5.0, 5.0,   5.0,-5.0, 5.0,   5.0,-5.0,-5.0,   5.0, 5.0,-5.0, // v0-v3-v4-v5 right
              5.0, 5.0, 5.0,   5.0, 5.0,-5.0,  -5.0, 5.0,-5.0,  -5.0, 5.0, 5.0, // v0-v5-v6-v1 up
             -5.0, 5.0, 5.0,  -5.0, 5.0,-5.0,  -5.0,-5.0,-5.0,  -5.0,-5.0, 5.0, // v1-v6-v7-v2 left
             -5.0,-5.0,-5.0,   5.0,-5.0,-5.0,   5.0,-5.0, 5.0,  -5.0,-5.0, 5.0, // v7-v4-v3-v2 down
              5.0,-5.0,-5.0,  -5.0,-5.0,-5.0,  -5.0, 5.0,-5.0,   5.0, 5.0,-5.0  // v4-v7-v6-v5 back

          ]);
         
         var color = new Float32Array([
              0.5, 0.5, 1.0, 0.4,  0.5, 0.5, 1.0, 0.4,  0.5, 0.5, 1.0, 0.4,  0.5, 0.5, 1.0, 0.4,  // v0-v1-v2-v3 front(blue)
              0.5, 1.0, 0.5, 0.4,  0.5, 1.0, 0.5, 0.4,  0.5, 1.0, 0.5, 0.4,  0.5, 1.0, 0.5, 0.4,  // v0-v3-v4-v5 right(green)
              1.0, 0.5, 0.5, 0.4,  1.0, 0.5, 0.5, 0.4,  1.0, 0.5, 0.5, 0.4,  1.0, 0.5, 0.5, 0.4,  // v0-v5-v6-v1 up(red)
              1.0, 1.0, 0.5, 0.4,  1.0, 1.0, 0.5, 0.4,  1.0, 1.0, 0.5, 0.4,  1.0, 1.0, 0.5, 0.4,  // v1-v6-v7-v2 left
              1.0, 1.0, 1.0, 0.4,  1.0, 1.0, 1.0, 0.4,  1.0, 1.0, 1.0, 0.4,  1.0, 1.0, 1.0, 0.4,  // v7-v4-v3-v2 down
              0.5, 1.0, 1.0, 0.4,  0.5, 1.0, 1.0, 0.4,  0.5, 1.0, 1.0, 0.4,  0.5, 1.0, 1.0, 0.4   // v4-v7-v6-v5 back
          ]);

        

    var cube1 = new MFAC.Geometry.cube(vertices, color);
    //scene.add(cube1);

    var ve_T = new Float32Array([

    	0.5,  0.4,  -0.2,  
       -0.5,  0.4,  -0.2,  
        0.0, -0.6,  -0.2,  
    	
        ]);

    var color_T = new Float32Array([

    	1, 0, 0, 1,
    	1, 0, 0, 1,
    	1, 0, 0, 1

    	]);


    var index_T = new Uint8Array([

    	0, 1, 2

    	]);

    var triangle = new MFAC.Geometry.mesh(ve_T, color_T, index_T);

     var v0 = new Float32Array([

    	0.0,  0.5,  -0.4,  
   		-0.5, -0.5,  -0.4,
    	0.5, -0.5,  -0.4,
    	0.5,  0.4,  -0.2,  
   		-0.5,  0.4,  -0.2,  
    	0.0, -0.6,  -0.2,    

    	]);

    var c0 = new Float32Array([

    	1.0,  1.0,  0,  0.0,
    	1.0,  1.0,  0,  0.0,
    	1.0,  0.4,  0,  0.0, 

    	1.0,  0,  0,  0.0, 
    	1.0,  0,  0,  0.0,
    	1.0,  0,  0,  0.0, 

    	]);


    var i0 = new Uint8Array([

    	3, 4, 5,
    	0, 1, 2,

    	]);

    var front = new MFAC.Geometry.mesh(v0, c0, i0);
    
    //scene.add(triangle);
    //scene.add(front);

    render();

	/***********************METABALL START*************************/
    
    var Ball = function(center, r) {

        this.center = center;
        this.r = r;

    }

    var voxelVertex = function() {

        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.value = 0;//体素顶点权值

    };

    var voxel = function() {

        this.x = 0;//体素基准点
        this.y = 0;
        this.z = 0;
        this.vertex = new Array();
        for(var i = 0; i < 8; i++){

            this.vertex[i] = new voxelVertex();

        }

    };

    var edgeIndex = function() {

        this.edge = 0;
        this.type = 0;//x方向坐标不同,其他坐标都相同

    }


    var eIndex = new Array();//通过边的索引找到边
    for(var i = 0; i < 12; i++) {

        eIndex[i] = new edgeIndex();

    }

    /*eIndex[0].edge   = new MFAC.Vector2(0, 1);      eIndex[0].type  = "Z-DIF";
    eIndex[1].edge   = new MFAC.Vector2(1, 2);      eIndex[1].type  = "Y-DIF";       
    eIndex[2].edge   = new MFAC.Vector2(2, 3);      eIndex[2].type  = "Z-DIF";
    eIndex[3].edge   = new MFAC.Vector2(3, 0);      eIndex[3].type  = "Y-DIF"; 
    eIndex[4].edge   = new MFAC.Vector2(4, 5);      eIndex[4].type  = "Z-DIF";
    eIndex[5].edge   = new MFAC.Vector2(5, 6);      eIndex[5].type  = "Y-DIF";
    eIndex[6].edge   = new MFAC.Vector2(6, 7);      eIndex[6].type  = "Z-DIF";
    eIndex[7].edge   = new MFAC.Vector2(7, 4);      eIndex[7].type  = "Y-DIF";
    eIndex[8].edge   = new MFAC.Vector2(0, 4);      eIndex[8].type  = "X-DIF";
    eIndex[9].edge   = new MFAC.Vector2(1, 5);      eIndex[9].type  = "X-DIF";
    eIndex[10].edge  = new MFAC.Vector2(2, 6);      eIndex[10].type = "X-DIF";
    eIndex[11].edge  = new MFAC.Vector2(3, 7);      eIndex[11].type = "X-DIF";*/

    eIndex[0].edge   = new MFAC.Vector2(0, 1);      eIndex[0].type  = "X-DIF";
    eIndex[1].edge   = new MFAC.Vector2(1, 2);      eIndex[1].type  = "Z-DIF";       
    eIndex[2].edge   = new MFAC.Vector2(2, 3);      eIndex[2].type  = "X-DIF";
    eIndex[3].edge   = new MFAC.Vector2(3, 0);      eIndex[3].type  = "Z-DIF"; 
    eIndex[4].edge   = new MFAC.Vector2(4, 5);      eIndex[4].type  = "X-DIF";
    eIndex[5].edge   = new MFAC.Vector2(5, 6);      eIndex[5].type  = "Z-DIF";
    eIndex[6].edge   = new MFAC.Vector2(6, 7);      eIndex[6].type  = "X-DIF";
    eIndex[7].edge   = new MFAC.Vector2(7, 4);      eIndex[7].type  = "Z-DIF";
    eIndex[8].edge   = new MFAC.Vector2(0, 4);      eIndex[8].type  = "Y-DIF";
    eIndex[9].edge   = new MFAC.Vector2(1, 5);      eIndex[9].type  = "Y-DIF";
    eIndex[10].edge  = new MFAC.Vector2(2, 6);      eIndex[10].type = "Y-DIF";
    eIndex[11].edge  = new MFAC.Vector2(3, 7);      eIndex[11].type = "Y-DIF";

    var trianglTable = getTriangle();
    
    function getVoxelConfig(vertex) {

        var result = "";
        var temp = 0;
        for(var i = 0; i < 8; i++) {

            temp = vertex[i];
            if(temp > 1) {

                temp = 1;

            }
            else {

                temp = 0;

            }

            result = result + String(temp);

        }

        result = parseInt(result,2);
        result = result.toString(10); 
        return Number(result);//返回三角形类型编号

    }

    function calculateLinePoint(eIndex,voxel, i ,lineNum, s) {

        var x, y, z;

        var pointNum1 = eIndex[lineNum].edge.x//顶点1编号
        var pointNum2 = eIndex[lineNum].edge.y//顶点2编号

        var x1 = voxel[i].vertex[pointNum1].x;
        var y1 = voxel[i].vertex[pointNum1].y;
        var z1 = voxel[i].vertex[pointNum1].z;
        var x2 = voxel[i].vertex[pointNum2].x;
        var y2 = voxel[i].vertex[pointNum2].y;
        var z2 = voxel[i].vertex[pointNum2].z;

    
        var temps = ((0.6 - voxel[i].vertex[pointNum1].value) / (voxel[i].vertex[pointNum2].value - voxel[i].vertex[pointNum1].value));
        var type  = eIndex[lineNum].type;

        if(type == "X-DIF") {

            x = x1 + (x2 - x1) * temps;
            y = y1;
            z = z1;

        }
        else if(type == "Y-DIF"){  

            x = x1;
            y = y1 + (y2 - y1) * temps;
            z = z1;

        }
        else{//Z-DIF
        
            x = x1;
            y = y1;
            z = z1 + (z2 - z1) * temps;
        }

        return new MFAC.Vector3(x*s, y*s, z*s);

    }

    function createCell(d, column, row, layer) {

        d = 0.5;
        var cell  = new Array();
       
        var length = 0;
        
        for(var i = 0; i < layer; i+=d) {
        
            for(var j = 0; j < row; j+=d) {

                for(var k = 0; k < column; k+=d) {

                    /*var ve_T = new Float32Array([

                    k, j, i,

                    k, j+d, i,

                    k, j+d, i+d,

                    k+d,j+d,  i 
        
                    ]);

                var color_T = new Float32Array([

                    0, 0, 1, 1,
                    0, 0, 1, 1,
                    0, 0, 1, 1,
                    0, 0, 1, 1,
                    0, 0, 1, 1,

                    ]);
                 var index_T = new Uint8Array([

                    0, 1,
                    1, 2,
                    1, 3


                    ]);

                    var mesh = new MFAC.Geometry.mesh(ve_T, color_T, index_T);
                    mesh.drawType = MFAC.gl.LINES;
                    scene.add(mesh)*/

                    /*cell[length] = new voxel();//2号顶点是基准点
                    cell[length].vertex[0].x = k;
                    cell[length].vertex[0].y = j + d;
                    cell[length].vertex[0].z = i + d;
                    cell[length].vertex[1].x = k;
                    cell[length].vertex[1].y = j + d;
                    cell[length].vertex[1].z = i;
                    cell[length].vertex[2].x = k;
                    cell[length].vertex[2].y = j;
                    cell[length].vertex[2].z = i;
                    cell[length].vertex[3].x = k;
                    cell[length].vertex[3].y = j;
                    cell[length].vertex[3].z = i + d;
                    cell[length].vertex[4].x = k + d;
                    cell[length].vertex[4].y = j + d;
                    cell[length].vertex[4].z = i + d;
                    cell[length].vertex[5].x = k + d;
                    cell[length].vertex[5].y = j + d;
                    cell[length].vertex[5].z = i;
                    cell[length].vertex[6].x = k + d;
                    cell[length].vertex[6].y = j;
                    cell[length].vertex[6].z = i;
                    cell[length].vertex[7].x = k + d;
                    cell[length].vertex[7].y = j;
                    cell[length].vertex[7].z = i + d;
                    cell[length].x = k;
                    cell[length].y = j;
                    cell[length].z = i;*/

                    /*var sphere = new MFAC.Geometry.sphere(new MFAC.Vector3(k ,j ,i), 0.4);
                    scene.add(sphere); */                    
                    
                    cell[length] = new voxel();//2号顶点是基准点
                    cell[length].vertex[0].x = k;
                    cell[length].vertex[0].y = j;
                    cell[length].vertex[0].z = i;
                    cell[length].vertex[1].x = k + d;
                    cell[length].vertex[1].y = j;
                    cell[length].vertex[1].z = i;
                    cell[length].vertex[2].x = k + d;
                    cell[length].vertex[2].y = j;
                    cell[length].vertex[2].z = i + d;
                    cell[length].vertex[3].x = k;
                    cell[length].vertex[3].y = j;
                    cell[length].vertex[3].z = i + d;
                    cell[length].vertex[4].x = k;
                    cell[length].vertex[4].y = j + d;
                    cell[length].vertex[4].z = i;
                    cell[length].vertex[5].x = k + d;
                    cell[length].vertex[5].y = j + d;
                    cell[length].vertex[5].z = i;
                    cell[length].vertex[6].x = k + d;
                    cell[length].vertex[6].y = j + d;
                    cell[length].vertex[6].z = i + d;
                    cell[length].vertex[7].x = k;
                    cell[length].vertex[7].y = j + d;
                    cell[length].vertex[7].z = i + d;
                    cell[length].x = k;
                    cell[length].y = j;
                    cell[length].z = i;
                    length++;

            }

        }
    }

        return cell;

    }

    function muraKami(r,R) {//势函数

        if(r > R) {

            return 0;

        }

        else
        {

            return (1 - (r/R) * (r/R)) * (1 - (r/R) * (r/R));

        }

    }

    /*function calculatePointValue(x, y, z, ball) {

        var length = ball.length;
        var E = 0; var E1 = 0;
        for(var i = 0; i < length; i++) {

            E1 = (ball[i].r * ball[i].r) / ((x - ball[i].center.x ) * (x - ball[i].center.x ) + (y - ball[i].center.y ) * (y - ball[i].center.y ) + (z - ball[i].center.z ) * (z - ball[i].center.z ));
            if(E1 == Infinity){
                
                E1 = 1;
            }
            E += E1;
        }
        

        return E;

    }*/

    function calculatePointValue(x, y, z, ball) {

        var length = ball.length;    
        var R = 15;
     
        var E = 0;
        for(var i = 0; i < length; i++) {

            var r = ((x - ball[i].center.x) * (x - ball[i].center.x) + (y - ball[i].center.y) * (y - ball[i].center.y) + (z - ball[i].center.z) * (z - ball[i].center.z));
            var r_sqrt = Math.sqrt(r);
            var EN = ball[i].r * ball[i].r / r;//muraKami(ball[i].r,r_sqrt);
            E += (EN * EN) / r;
            //if(r == 0)alert(x - ball[i].center.x)

        }
        return E;

    }

    function draw(cell,ball,eIndex,s) {

        var length = cell.length;  
        for(var i = 0; i < length; i++) {

            var temp1 = new Array();
            for(var j = 0; j < 8; j++) {

                cell[i].vertex[j].value = calculatePointValue(cell[i].vertex[j].x, cell[i].vertex[j].y, cell[i].vertex[j].z, ball);
                
                temp1.push(cell[i].vertex[j].value);//alert(cell[i].vertex[j].value)
        
            }

            var voxelNum = getVoxelConfig(temp1);
        
            var temp2 = new Array();//边的编号
            for(var k = 0; k < 16; k+=3) {

                var temp3 = trianglTable[voxelNum][k];
                if(temp3 != -1) {

                    temp2.push(temp3);
                    temp2.push(trianglTable[voxelNum][k+1]);
                    temp2.push(trianglTable[voxelNum][k+2]);

                }

            }

            var temp4 = new Array();
            var length1 = temp2.length;
            for(var m = 0; m < length1; m++) {
  
                var result = calculateLinePoint(eIndex,cell, i ,temp2[m],s);
                temp4.push(result.x);
                temp4.push(result.y);
                temp4.push(result.z);

            }

            var length4 = temp4.length; 

            for(var n = 0; n < length4; n += 9) {

                 var ve_T = new Float32Array([

                    temp4[n],  temp4[n+1],  temp4[n+2],  
                    temp4[n+3],  temp4[n+4],  temp4[n+5],  
                    temp4[n+6],  temp4[n+7],  temp4[n+8],  
        
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

                var triangle = new MFAC.Geometry.mesh(ve_T, color_T, index_T);
                //triangle.drawType = MFAC.gl.LINES;
                scene.add(triangle);

                        }


                    }

    }

    var cell = createCell(1, 10, 10, 10);
    var ball1 = new Ball(new MFAC.Vector3(3, 3, 3), 3);
    //var ball2 = new Ball(new MFAC.Vector3(3, 3, 3), 6);
    draw(cell,[ball1,],eIndex,1);



    /***********************METABALL END*************************/


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

        }

    }

    var gui = new dat.GUI();
    gui.add(controls,'Frontview').name("正视图");
    gui.add(controls,'openSphere').name("导入球颗粒");
    gui.add(controls,'openFace').name("导入固定面");

}