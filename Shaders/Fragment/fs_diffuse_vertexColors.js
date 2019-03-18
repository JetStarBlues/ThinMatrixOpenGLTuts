// Diffuse with texture
//  https://learnopengl.com/Lighting/Basic-Lighting
const fs_diffuse_vertexColors = `#version 300 es

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
	in  vec4 pass_vertexColor;

	out vec4 outputColor;

	uniform Material  material;
	uniform vec3      lightColor;
	uniform sampler2D modelTexture;

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


		// --- Final color ---
		vec3 finalColor = ( ambient + diffuse ) * pass_vertexColor.rgb;

		outputColor = vec4( finalColor, 1.0 );
	}
`;
