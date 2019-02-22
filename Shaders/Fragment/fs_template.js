// https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html


// Template
const fs_template = `#version 300 es

	precision mediump float;

	in  vec4 vColor;

	out vec4 outputColor;

	void main ( void )
	{
		outputColor = vColor;
	}
`;
