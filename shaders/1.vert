    attribute vec3 position;//����λ��
    attribute vec3 normal;//���㷨��
    attribute vec4 color;//������ɫ
    uniform   mat4 mvpMatrix;
    uniform   mat4 invMatrix;//ģ�;���������
    uniform   vec3 lightDirection;//��ķ�������
    uniform   vec3 eyeDirection;//��������
    uniform   vec3 ambientColor;//�������ǿ��������һ��ȡ0.2���£��������������ⷽ��
    varying   vec4 vColor;//��ƬԪ��ɫ�������ݵı���
    uniform float axis;//�궨���ղ�������������
    vec3 x = vec3(0.5,0.5,0.5);

    void main(void){

    /* ����invLight������㹫ʽ�����˱任��Ĺ������������巢����ת/�ƶ�������Ϣ��䣬������Ҫ��һ��ת�þ��� */
        vec3  invLight = normalize(invMatrix * vec4(lightDirection, 0.0)).xyz;
        vec3  invEye   = normalize(invMatrix * vec4(eyeDirection, 0.0)).xyz;
        vec3  halfLE   = normalize(invLight + invEye);
        float diffuse  = clamp((abs(dot(normal, invLight))), 0.2, 1.0);
        float specular = pow(clamp(abs(dot(normal, halfLE)), 0.2, 1.0), 60.0);//���淴��
        vec4  light    = color * vec4(vec3(diffuse), 1.0) + vec4(vec3(specular), 1.0);

        if(axis == 0.0){

            vColor  = color;

        }
        else{

            vColor  = light + vec4(ambientColor,1);//�������ʹ�ó˷������Ǽӷ���ʱ����úܰ���Ϊʲô��
            //����vec������˴�����ʲô��Ӧ���ǵõ�һ������   ��λ��ư�͸�����壿
        }
 
    gl_Position = mvpMatrix * vec4(position, 1.0);//����Ӹ�1.0����Ϊ��ͼ��ѧ������������ʾ��

  }