// Specular with texture
const fs_specular_texutre = `#version 300 es

	precision mediump float;

	in  vec2 pass_textureCoordinates;
	in  vec3 surfaceNormal;
	in  vec3 toLightVector;
	in  vec3 toCameraVector;

	out vec4 outputColor;

	uniform sampler2D modelTexture;
	uniform vec3      lightColor;
	uniform float     shineDamper;
	uniform float     reflectivity;

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


		// --- Specular ---
		vec3 unitVectorToCamera      = normalize( toCameraVector );
		vec3 lightDirection          = - unitLightVector;           // vector pointing from light to object
		vec3 reflectedLightDirection = reflect( lightDirection, unitNormal );

		// Brightest when reflected light is pointing to camera
		float specularFactor = dot( reflectedLightDirection, unitVectorToCamera );
		specularFactor       = max( specularFactor, 0.0 );          // Set lower limit for brightness

		// Dampen
		float dampedFactor  = pow( specularFactor, shineDamper );
		vec3  finalSpecular = dampedFactor * reflectivity * lightColor;


		// --- Texture ---
		vec4 textureColor = texture( modelTexture, pass_textureCoordinates );


		// --- Final color ---
		outputColor = vec4( diffuse, 1.0 ) * textureColor + vec4( finalSpecular, 1.0 );
	}
`;
