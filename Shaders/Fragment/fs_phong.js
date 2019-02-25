// Phong
//  https://learnopengl.com/Lighting/Basic-Lighting
const fs_phong = `#version 300 es

	precision mediump float;

	struct Material {

		vec3  color;
		float ambientStrength;
		float diffuseStrength;
		float specularStrength;
		float shininess;
	};

	in  vec4 worldNormal;
	in  vec3 toLightVector;
	in  vec3 toCameraVector;

	out vec4 outputColor;

	uniform Material material;
	uniform vec3     lightColor;

	void main ( void )
	{
		// Normalize so that size doesn't affect calculations, only direction
		vec3 unitNormal      = normalize( worldNormal.xyz );
		vec3 unitLightVector = normalize( toLightVector );


		// --- Ambient ---
		float ambientStrength = 0.15;
		vec3 ambient = material.ambientStrength * lightColor;


		// --- Diffuse ---
		/* Dot product represents angle between two vectors.
		   If pointing in same direction returns 1, otherwise a value < 1
		*/
		float normalDotLight = dot( unitNormal, unitLightVector );
		float brightness     = max( normalDotLight, 0.0 );          // Set lower limit for brightness
		vec3  diffuse        = material.diffuseStrength * brightness * lightColor;


		// --- Specular ---
		float shininess        = 5.0;  // ?  0+
		float specularStrength = 0.2;  // ?  0..1

		vec3 unitVectorToCamera      = normalize( toCameraVector );
		vec3 lightDirection          = - unitLightVector;           // vector pointing from light to object
		vec3 reflectedLightDirection = reflect( lightDirection, unitNormal );

		// Brightest when reflected light is pointing to camera
		float specularFactor = dot( reflectedLightDirection, unitVectorToCamera );
		specularFactor       = max( specularFactor, 0.0 );          // Set lower limit for brightness

		// Dampen
		float dampedFactor = pow( specularFactor, material.shininess );

		vec3 specular = material.specularStrength * dampedFactor * lightColor;


		// --- Final color ---
		vec3 finalColor = ( ambient + diffuse + specular ) * material.color;

		outputColor = vec4( finalColor, 1.0 );
	}
`;
