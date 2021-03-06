// Texture
const vs_texture = `#version 300 es

	precision mediump float;

	in  vec3 position;
	in  vec2 textureCoordinates;

	out vec2 pass_textureCoordinates;

	uniform mat4 projectionMatrix;
	uniform mat4 viewMatrix;
	uniform mat4 transformationMatrix;

	void main ( void )
	{
		pass_textureCoordinates = textureCoordinates;

		// Because position can change direction when model is translated/scaled/rotated
		vec4 worldPosition = transformationMatrix * vec4( position, 1.0 );

		//
		gl_Position = projectionMatrix * viewMatrix * worldPosition;
	}
`;
