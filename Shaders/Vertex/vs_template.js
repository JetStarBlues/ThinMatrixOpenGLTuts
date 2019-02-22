// https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html


// Template
const vs_template = `#version 300 es

	precision mediump float;

	in  vec3 position;

	out vec4 vColor;

	uniform mat4 projectionMatrix;
	uniform mat4 viewMatrix;
	uniform mat4 transformationMatrix;

	void main ( void )
	{
		vColor = vec4( 1.0, 0.0, 0.0, 1.0 );

		gl_Position = projectionMatrix * viewMatrix * transformationMatrix * vec4( position, 1.0 );
	}
`;
