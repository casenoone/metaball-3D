attribute vec3 a_Position;
attribute vec4 a_Color;
uniform   mat4 mvpMatrix;
varying   vec4 v_Color;

void main() {
	
	gl_Position = mvpMatrix * vec4( a_Position, 1 );
	v_Color     = a_Color;

}