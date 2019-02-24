// Phong
//  https://learnopengl.com/Lighting/Basic-Lighting
const fs_phong = `#version 300 es

	precision mediump float;

	in  vec3 surfaceNormal;
	// in  vec3 toLightVector;
	// in  vec3 toCameraVector;
	in vec4 worldPosition;
	in vec4 viewPosition;
	in vec4 viewNormal;

	out vec4 outputColor;

	uniform vec3  lightColor;
	uniform vec3  lightPosition;
	// uniform float shineDamper;
	// uniform float reflectivity;

	void main ( void )
	{
		vec3 objectColor = vec3( 1.0 );  // white

		// --- Ambient ---
		float ambientStrength = 0.2;
		vec3 ambient = ambientStrength * lightColor;


		// // float shineDamper   = 1.0;
		// // float reflectivity  = 0.2;

		// vec3 surfaceNormal = pass_normal;
		// vec3 toLightVector = lightPosition - worldPosition.xyz;
		vec3 toLightVector = lightPosition - viewPosition.xyz;

		// Normalize so that size doesn't affect calculations, only direction
		vec3 unitNormal      = normalize( viewNormal.xyz );
		// vec3 unitNormal      = normalize( surfaceNormal );
		// vec3 unitNormal      = normalize( pass_normal );
		vec3 unitLightVector = normalize( toLightVector );


		// --- Diffuse ---
		/* Dot product represents angle between two vectors.
		   If pointing in same direction returns 1, otherwise a value < 1
		*/
		float normalDotLight = dot( unitNormal, unitLightVector );
		float brightness     = max( normalDotLight, 0.0 );          // Set lower limit for brightness
		vec3  diffuse        = brightness * lightColor;


		// // --- Specular ---
		// vec3 unitVectorToCamera      = normalize( toCameraVector );
		// vec3 lightDirection          = - unitLightVector;           // vector pointing from light to object
		// vec3 reflectedLightDirection = reflect( lightDirection, unitNormal );

		// // Brightest when reflected light is pointing to camera
		// float specularFactor = dot( reflectedLightDirection, unitVectorToCamera );
		// specularFactor       = max( specularFactor, 0.0 );          // Set lower limit for brightness

		// // Dampen
		// float dampedFactor  = pow( specularFactor, shineDamper );
		// vec3  finalSpecular = dampedFactor * reflectivity * lightColor;


		// --- Final color ---
		// outputColor = vec4( diffuse, 1.0 ) + vec4( finalSpecular, 1.0 );
		vec3 finalColor = ( ambient + diffuse ) * objectColor;

		outputColor = vec4( finalColor, 1.0 );
	}
`;
