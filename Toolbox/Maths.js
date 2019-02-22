var Maths = function () {}

Maths.toRadians = function ( deg )
{
	return deg * Math.PI / 180;
}

Maths.toDegrees = function ( rad )
{
	return rad * 180 / Math.PI;
}

Maths.isPowerOf2 = function ( x )
{
	return ( x & ( x - 1 ) ) == 0;
}


Maths.createTransformationMatrix = function ( vec3_translation, vec3_rotation, vec3_scale )
{
	var matrix = glMatrix.mat4.create();

	glMatrix.mat4.identity( matrix );

	// Translate
	glMatrix.mat4.translate(

		matrix,                  // destination matrix
		matrix,                  // matrix to translate
		[                        // amount to translate
			vec3_translation.x,
			vec3_translation.y,
			vec3_translation.z,
		]
	);

	// Rotate
	glMatrix.mat4.rotate(

		matrix,                              // destination matrix
		matrix,                              // matrix to rotate
		Maths.toRadians( vec3_rotation.x ),  // amount to rotate in radians
		[ 1, 0, 0 ],                         // axis to rotate around
	);
	glMatrix.mat4.rotate(

		matrix,                               // destination matrix
		matrix,                               // matrix to rotate
		Maths.toRadians( vec3_rotation.y ),   // amount to rotate in radians
		[ 0, 1, 0 ],                          // axis to rotate around
	);
	glMatrix.mat4.rotate(

		matrix,                               // destination matrix
		matrix,                               // matrix to rotate
		Maths.toRadians( vec3_rotation.z ),   // amount to rotate in radians
		[ 0, 0, 1 ],                          // axis to rotate around
	);

	// Scale
	glMatrix.mat4.scale(

		matrix,            // destination matrix
		matrix,            // matrix to scale
		[                  // amount to scale
			vec3_scale.x,
			vec3_scale.y,
			vec3_scale.z
		]
	);

	return matrix;
}


Maths.createViewMatrix = function ( camera )
{
	var viewMatrix = glMatrix.mat4.create();

	glMatrix.mat4.identity( viewMatrix );

	// Rotate
	glMatrix.mat4.rotate(

		viewMatrix,                            // destination matrix
		viewMatrix,                            // matrix to rotate
		Maths.toRadians( camera.rotation.x ),  // amount to rotate in radians
		[ 1, 0, 0 ],                           // axis to rotate around
	);
	glMatrix.mat4.rotate(

		viewMatrix,                            // destination matrix
		viewMatrix,                            // matrix to rotate
		Maths.toRadians( camera.rotation.y ),  // amount to rotate in radians
		[ 0, 1, 0 ],                           // axis to rotate around
	);
	glMatrix.mat4.rotate(

		viewMatrix,                            // destination matrix
		viewMatrix,                            // matrix to rotate
		Maths.toRadians( camera.rotation.z ),  // amount to rotate in radians
		[ 0, 0, 1 ],                           // axis to rotate around
	);

	// Translate
	// something about camera opposite direction...
	glMatrix.mat4.translate(

		viewMatrix,                // destination matrix
		viewMatrix,                // matrix to translate
		[                          // amount to translate
			- camera.position.x,
			- camera.position.y,
			- camera.position.z,
		]
	);

	return viewMatrix;
}
