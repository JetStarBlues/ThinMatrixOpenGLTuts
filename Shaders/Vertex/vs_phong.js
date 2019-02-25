// Phong
//  https://learnopengl.com/Lighting/Basic-Lighting
const vs_phong = `#version 300 es

	precision mediump float;

	in  vec3 position;
	in  vec3 normal;

	out vec4 surfaceNormal;
	// out vec3 toLightVector;
	out vec3 toCameraVector;
	out vec4 worldPosition;
	// out vec3 unitNormal;
	// out vec3 unitLightVector;
	// out vec3 pass_normal;

	uniform mat4 projectionMatrix;
	uniform mat4 transformationMatrix;
	uniform mat4 normalMatrix;
	uniform mat4 viewMatrix;
	// uniform vec3 lightPosition;

	void main ( void )
	{
		// pass_normal = normal;
		surfaceNormal = normalMatrix * vec4( normal, 1.0 );
		// vec4 surfaceNormal = normalMatrix * vec4( normal, 1.0 );
		// unitNormal = normalize( surfaceNormal.xyz );

		// Because position can change direction when model is translated/scaled/rotated
		worldPosition = transformationMatrix * vec4( position, 1.0 );

		// viewPosition = viewMatrix * worldPosition;
		// viewNormal = viewMatrix * fuck;
		// viewNormal = transpose( inverse( viewMatrix ) ) * fuck;

		// Because normal can change direction when model is rotated
		// surfaceNormal = ( transformationMatrix * vec4( normal, 0.0 ) ).xyz;


		// Vector pointing from vertex to light
		// toLightVector = lightPosition - worldPosition.xyz;
		// vec3 toLightVector = lightPosition - worldPosition.xyz;
		// unitLightVector = normalize( toLightVector );


		// Get camera position from viewMatrix
		vec4 cameraPosition = inverse( viewMatrix ) * vec4( 0.0, 0.0, 0.0, 1.0 );

		// Vector pointing from vertex to camera
		toCameraVector = cameraPosition.xyz - worldPosition.xyz;


		//
		gl_Position = projectionMatrix * viewMatrix * worldPosition;
	}
`;
