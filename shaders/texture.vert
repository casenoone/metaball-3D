attribute vec3 a_Position;
attribute vec3 a_Normal;
attribute vec2 a_TexCoord;
uniform   mat4 u_MvpMatrix;
varying   vec2 v_TexCoord;

void main(void) {
	
	gl_Position = vec4(a_Position, 1.0);
	v_TexCoord = a_TexCoord;
}