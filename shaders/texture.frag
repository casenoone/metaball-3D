#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D u_Sampler; //取样器
varying vec2 v_TexCoord; //接受纹理坐标
void main(void){

      gl_FragColor = texture2D(u_Sampler, v_TexCoord);

}