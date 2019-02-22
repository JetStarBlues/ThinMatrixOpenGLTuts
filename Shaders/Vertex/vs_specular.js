// Specular
const vs_specular = `#version 300 es

	precision mediump float;

	in  vec3 position;
	in  vec3 normal;

	out vec3 surfaceNormal;
	out vec3 toLightVector;
	out vec3 toCameraVector;

	uniform mat4 projectionMatrix;
	uniform mat4 viewMatrix;
	uniform mat4 transformationMatrix;
	uniform vec3 lightPosition;

	void main ( void )
	{
		// Because position can change direction when model is translated/scaled/rotated
		vec4 worldPosition = transformationMatrix * vec4( position, 1.0 );

		// Because normal can change direction when model is rotated
		surfaceNormal = ( transformationMatrix * vec4( normal, 0.0 ) ).xyz;


		// Vector pointing from vertex to light
		toLightVector = lightPosition - worldPosition.xyz;


		// Get camera position from viewMatrix
		vec4 cameraPosition = inverse( viewMatrix ) * vec4( 0.0, 0.0, 0.0, 1.0 );

		// Vector pointing from vertex to camera
		toCameraVector = cameraPosition.xyz - worldPosition.xyz;


		//
		gl_Position = projectionMatrix * viewMatrix * worldPosition;
	}
`;
