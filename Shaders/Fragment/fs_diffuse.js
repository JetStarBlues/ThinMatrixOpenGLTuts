// Diffuse
const fs_diffuse = `#version 300 es

	precision mediump float;

	in  vec3 surfaceNormal;
	in  vec3 toLightVector;

	out vec4 outputColor;

	uniform vec3 lightColor;

	void main ( void )
	{
		// Normalize so that size doesn't affect calculations, only direction
		vec3 unitNormal      = normalize( surfaceNormal );
		vec3 unitLightVector = normalize( toLightVector );


		// --- Diffuse ---
		/* Dot product represents angle between two vectors.
		   If pointing in same direction returns 1, otherwise a value < 1
		*/
		float normalDotLight = dot( unitNormal, unitLightVector );
		float brightness     = max( normalDotLight, 0.2 );          // Set lower limit for brightness
		vec3  diffuse        = brightness * lightColor;


		// --- Final color ---
		outputColor = vec4( diffuse, 1.0 );
	}
`;
