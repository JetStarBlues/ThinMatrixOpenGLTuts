// Diffuse with texture
//  https://learnopengl.com/Lighting/Basic-Lighting
const vs_diffuse_vertexColors = `#version 300 es

	precision mediump float;

	in  vec3 position;
	in  vec3 normal;
	in  vec4 vertexColor;

	out vec4 worldNormal;
	out vec3 toLightVector;
	out vec4 pass_vertexColor;

	uniform mat4 projectionMatrix;
	uniform mat4 transformationMatrix;
	uniform mat4 normalMatrix;
	uniform mat4 viewMatrix;
	uniform vec3 lightPosition;

	void main ( void )
	{
		pass_vertexColor = vertexColor;

		// Because position can change direction when model is translated/scaled/rotated
		vec4 worldPosition = transformationMatrix * vec4( position, 1.0 );

		// Because normal can change direction when model is rotated
		worldNormal = normalMatrix * vec4( normal, 0.0 );

		// Vector pointing from vertex to light
		toLightVector = lightPosition - worldPosition.xyz;


		//
		gl_Position = projectionMatrix * viewMatrix * worldPosition;
	}
`;
