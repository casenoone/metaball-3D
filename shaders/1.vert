    attribute vec3 position;//顶点位置
    attribute vec3 normal;//顶点法线
    attribute vec4 color;//顶点颜色
    uniform   mat4 mvpMatrix;
    uniform   mat4 invMatrix;//模型矩阵的逆矩阵
    uniform   vec3 lightDirection;//光的方向向量
    uniform   vec3 eyeDirection;//视线向量
    uniform   vec3 ambientColor;//环境光的强度向量（一般取0.2以下）环境光来自任意方向
    varying   vec4 vColor;//向片元着色器传数据的变量
    uniform float axis;//标定光照不作用于坐标轴
    vec3 x = vec3(0.5,0.5,0.5);

    void main(void){

    /* 下面invLight这个计算公式计算了变换后的光线向量（物体发生旋转/移动后法线信息会变，所以需要乘一个转置矩阵） */
        vec3  invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
        vec3  invEye   = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
        vec3  halfLE   = normalize(invLight + invEye);
        float diffuse  = clamp((abs(dot(normal, invLight))), 0.2, 1.0);
        float specular = pow(clamp(abs(dot(normal, halfLE)), 0.2, 1.0), 60.0);//镜面反射
        vec4  light    = color * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);

        if(axis == 0.0){

            vColor  = color;

        }
        else{

            vColor  = light + vec4(ambientColor,1);//这里如果使用乘法而不是加法的时候会变得很暗（为什么）
            //两个vec变量相乘代表着什么？应该是得到一个数吧   如何绘制半透明物体？
        }
 
    gl_Position = mvpMatrix * vec4(position, 1.0);//后面加个1.0是因为在图形学中用齐次坐标表示点

  }