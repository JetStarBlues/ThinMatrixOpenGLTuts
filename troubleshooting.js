// Global variables
var gl;
var loopID;

var program, vao;

var positionAttributeLocation;
var normalAttributeLocation;

var projectionMatrixUniformLocation;
var viewMatrixUniformLocation;
var transformationMatrixUniformLocation;
var lightPositionUniformLocation;
var lightColorUniformLocation;


var entity = {

	'position' : {

		'x' : 0,
		'y' : 0,
		'z' : -4,
	},
	'rotation' : {

		'x' : 0,
		'y' : 0,
		'z' : 0,
	},
	'scale' : {

		'x' : 1,
		'y' : 1,
		'z' : 1,
	},
}

var camera = {

	'position' : {

		'x' : 0,
		'y' : 0,
		'z' : 0,
	},
	'rotation' : {

		'x' : 0,
		'y' : 0,
		'z' : 0,
	},
}

var light = {

	'position' : {

		'x' : 0, // 20000,
		'y' : 0, // 20000,
		'z' : 0, // 2000,
	},
	'color' : {

		'x' : 1,
		'y' : 1,
		'z' : 1,
	},	
}


var KEY_Q = 81;


// Entry
document.addEventListener( 'DOMContentLoaded', main, false );

function main ()
{
	setup();

	// programRender();

	loopID = requestAnimationFrame( render );
}


// Setup
function setup ()
{
	// Initialize the GL context
	const canvas = document.querySelector( '#glCanvas' );
	gl = canvas.getContext( 'webgl2' );

	// Only continue if WebGL is available and working
	if ( gl === null ) {

		alert( 'Unable to initialize WebGL. Your browser or machine may not support it.' );
		return;
	}

	programSetup();
}


// Loop
function render ( now )
{
	// Get time
	now *= 0.001;  // convert to seconds

	// Check status of asynchronous events
	// ...

	// Render
	programRender();

	// Loop
	loopID = requestAnimationFrame( render );
}


// Exit
function stop ()
{
	cancelAnimationFrame( loopID );  // stop loop

	console.log( 'Adios!' );
}

document.addEventListener( 'keydown', function ( evt ) {

	if ( evt.keyCode == KEY_Q )
	{
		stop();
	}
} );


// ______________________________________________________________

function programSetup ()
{
	// Configure GL
	gl.clearColor( 0, 0, 0, 1 );

	gl.enable( gl.DEPTH_TEST );
	gl.depthFunc( gl.LEQUAL );
	gl.clearDepth( 1.0 );

	gl.enable( gl.CULL_FACE );
	gl.cullFace( gl.BACK );


	// Create GLSL shaders, upload the GLSL source, compile the shaders
	// var vertexShader   = createShader( gl.VERTEX_SHADER,   vs_template );
	// var fragmentShader = createShader( gl.FRAGMENT_SHADER, fs_template );
	// var vertexShader   = createShader( gl.VERTEX_SHADER,   vs_diffuse );
	// var fragmentShader = createShader( gl.FRAGMENT_SHADER, fs_diffuse );
	var vertexShader   = createShader( gl.VERTEX_SHADER,   vs_specular );
	var fragmentShader = createShader( gl.FRAGMENT_SHADER, fs_specular );


	// Link the two shaders into a program
	program = createProgram( vertexShader, fragmentShader );


	// Get uniform locations
	projectionMatrixUniformLocation     = gl.getUniformLocation( program, 'projectionMatrix' );
	viewMatrixUniformLocation           = gl.getUniformLocation( program, 'viewMatrix' );
	transformationMatrixUniformLocation = gl.getUniformLocation( program, 'transformationMatrix' );
	lightPositionUniformLocation        = gl.getUniformLocation( program, 'lightPosition' );
	lightColorUniformLocation           = gl.getUniformLocation( program, 'lightColor' );


	// Load object vertex data
	loadToVAO();


	// Projection matrix ___________________________

	var projectionMatrix;
	// ___ Create matrix ___
	{
		const fieldOfView      = toRadians( 70 );
		const aspect           = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const zNear            = 0.1;
		const zFar             = 1000.0;

		projectionMatrix = glMatrix.mat4.create();

		glMatrix.mat4.perspective(

			projectionMatrix,
			fieldOfView,
			aspect,
			zNear,
			zFar
		);
	}
	// ___ Assign matrix ___
	{
		gl.useProgram( program );

		gl.uniformMatrix4fv(

			projectionMatrixUniformLocation,
			false,
			projectionMatrix
		);

		gl.useProgram( null );
	}
}

function programRender ()
{
	// Clear the canvas
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	// Hmmm
	gl.useProgram( program );
	gl.bindVertexArray( vao );
	gl.enableVertexAttribArray( positionAttributeLocation );
	gl.enableVertexAttribArray( normalAttributeLocation );

	gl.uniform3f( lightPositionUniformLocation, light.position.x, light.position.y, light.position.z );
	gl.uniform3f( lightColorUniformLocation, light.color.x, light.color.y, light.color.z );

	// Update
	entity.rotation.x += 0.5;
	entity.rotation.y += 0.5;

	// Update uniforms

	loadViewMatrix();
	loadTransformationMatrix();


	// Draw
	var primitiveType = gl.TRIANGLES;
	// var primitiveType = gl.LINE_STRIP;
	var count         = 36;
	var type          = gl.UNSIGNED_SHORT;
	var offset        = 0;

	gl.drawElements(

		primitiveType,
		count,
		type,
		offset
	);


	// Hmmm
	gl.disableVertexAttribArray( positionAttributeLocation );
	gl.disableVertexAttribArray( normalAttributeLocation );
	gl.bindVertexArray( null );
	gl.useProgram( null );
}


function bindAttributeLocations ( program )
{
	positionAttributeLocation = 0;
	normalAttributeLocation   = 1;
	gl.bindAttribLocation( program, positionAttributeLocation, 'position' );
	gl.bindAttribLocation( program, normalAttributeLocation,     'normal' );
}

function loadToVAO ()
{
	// Create a vertex array object ( attribute state )
	vao = gl.createVertexArray();

	// and make it the one we're currently working with
	gl.bindVertexArray( vao );

	{
		// Create a buffer and put three 2d clip space points in it
		var positionBuffer = gl.createBuffer();

		// Bind it to ARRAY_BUFFER ( think of it as ARRAY_BUFFER = positionBuffer )
		gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );

		var positions = [

			// Front face
			-1.0, -1.0,  1.0,
			 1.0, -1.0,  1.0,
			 1.0,  1.0,  1.0,
			-1.0,  1.0,  1.0,

			// Back face
			-1.0, -1.0, -1.0,
			-1.0,  1.0, -1.0,
			 1.0,  1.0, -1.0,
			 1.0, -1.0, -1.0,

			// Top face
			-1.0,  1.0, -1.0,
			-1.0,  1.0,  1.0,
			 1.0,  1.0,  1.0,
			 1.0,  1.0, -1.0,

			// Bottom face
			-1.0, -1.0, -1.0,
			 1.0, -1.0, -1.0,
			 1.0, -1.0,  1.0,
			-1.0, -1.0,  1.0,

			// Right face
			 1.0, -1.0, -1.0,
			 1.0,  1.0, -1.0,
			 1.0,  1.0,  1.0,
			 1.0, -1.0,  1.0,

			// Left face
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0,
			-1.0,  1.0,  1.0,
			-1.0,  1.0, -1.0,
		];

		gl.bufferData(

			gl.ARRAY_BUFFER,
			new Float32Array( positions ),
			gl.STATIC_DRAW
		);


		// look up where the vertex data needs to go.
		// var positionAttributeLocation = gl.getAttribLocation( program, "position" );

		// Turn on the attribute
		// gl.enableVertexAttribArray( positionAttributeLocation );

		// Tell the attribute how to get data out of positionBuffer ( ARRAY_BUFFER )
		var size      = 3;         // 2 components per iteration
		var type      = gl.FLOAT;  // the data is 32bit floats
		var normalize = false;     // don't normalize the data
		var stride    = 0;         // 0 = move forward size * sizeof( type ) each iteration to get the next position
		var offset    = 0;         // start at the beginning of the buffer

		gl.vertexAttribPointer( 

			positionAttributeLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);


		//
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	}

	{
		// Create a buffer and put three 2d clip space points in it
		var normalBuffer = gl.createBuffer();

		// Bind it to ARRAY_BUFFER ( think of it as ARRAY_BUFFER = normalBuffer )
		gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );

		var normals = [

			// Front
			0.0,  0.0,  1.0,
			0.0,  0.0,  1.0,
			0.0,  0.0,  1.0,
			0.0,  0.0,  1.0,

			// Back
			0.0,  0.0, -1.0,
			0.0,  0.0, -1.0,
			0.0,  0.0, -1.0,
			0.0,  0.0, -1.0,

			// Top
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,
			0.0,  1.0,  0.0,

			// Bottom
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,
			0.0, -1.0,  0.0,

			// Right
			1.0,  0.0,  0.0,
			1.0,  0.0,  0.0,
			1.0,  0.0,  0.0,
			1.0,  0.0,  0.0,

			// Left
			-1.0,  0.0,  0.0,
			-1.0,  0.0,  0.0,
			-1.0,  0.0,  0.0,
			-1.0,  0.0,  0.0
		];

		gl.bufferData(

			gl.ARRAY_BUFFER,
			new Float32Array( normals ),
			gl.STATIC_DRAW
		);


		// look up where the vertex data needs to go.
		// var normalAttributeLocation = gl.getAttribLocation( program, "normal" );

		// Turn on the attribute
		// gl.enableVertexAttribArray( normalAttributeLocation );

		// Tell the attribute how to get data out of normalBuffer ( ARRAY_BUFFER )
		var size      = 3;         // 2 components per iteration
		var type      = gl.FLOAT;  // the data is 32bit floats
		var normalize = false;     // don't normalize the data
		var stride    = 0;         // 0 = move forward size * sizeof( type ) each iteration to get the next normal
		var offset    = 0;         // start at the beginning of the buffer

		gl.vertexAttribPointer( 

			normalAttributeLocation,
			size,
			type,
			normalize,
			stride,
			offset
		);


		//
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	}

	{
		var indexBuffer = gl.createBuffer();

		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );

		var indices = [

			0,  1,  2,      0,  2,  3,    // front
			4,  5,  6,      4,  6,  7,    // back
			8,  9,  10,     8,  10, 11,   // top
			12, 13, 14,     12, 14, 15,   // bottom
			16, 17, 18,     16, 18, 19,   // right
			20, 21, 22,     20, 22, 23,   // left
		];

		gl.bufferData(

			gl.ELEMENT_ARRAY_BUFFER,
			new Uint16Array( indices ),
			gl.STATIC_DRAW
		)
	}

	//
	gl.bindVertexArray( null );
}

var loadViewMatrix = function ()
{
	var viewMatrix;

	// ___ Create matrix ___
	{
		viewMatrix = glMatrix.mat4.create();

		glMatrix.mat4.identity( viewMatrix );

		// Rotate
		glMatrix.mat4.rotate(

			viewMatrix,                      // destination matrix
			viewMatrix,                      // matrix to rotate
			toRadians( camera.rotation.x ),  // amount to rotate in radians
			[ 1, 0, 0 ],                     // axis to rotate around
		);
		glMatrix.mat4.rotate(

			viewMatrix,                      // destination matrix
			viewMatrix,                      // matrix to rotate
			toRadians( camera.rotation.y ),  // amount to rotate in radians
			[ 0, 1, 0 ],                     // axis to rotate around
		);
		glMatrix.mat4.rotate(

			viewMatrix,                      // destination matrix
			viewMatrix,                      // matrix to rotate
			toRadians( camera.rotation.z ),  // amount to rotate in radians
			[ 0, 0, 1 ],                     // axis to rotate around
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
	}

	// ___ Assign matrix ___
	{

		gl.uniformMatrix4fv(

			viewMatrixUniformLocation,
			false,
			viewMatrix
		);
	}
}

function loadTransformationMatrix ()
{
	var transformationMatrix;

	// ___ Create matrix ___
	{
		transformationMatrix = glMatrix.mat4.create();

		// Translate
		glMatrix.mat4.translate(

			transformationMatrix,    // destination matrix
			transformationMatrix,    // matrix to translate
			[                        // amount to translate
				entity.position.x,
				entity.position.y,
				entity.position.z,
			]
		);

		// Rotate
		glMatrix.mat4.rotate(

			transformationMatrix,            // destination matrix
			transformationMatrix,            // matrix to rotate
			toRadians( entity.rotation.x ),  // amount to rotate in radians
			[ 1, 0, 0 ],                     // axis to rotate around
		);
		glMatrix.mat4.rotate(

			transformationMatrix,            // destination matrix
			transformationMatrix,            // matrix to rotate
			toRadians( entity.rotation.y ),  // amount to rotate in radians
			[ 0, 1, 0 ],                     // axis to rotate around
		);
		glMatrix.mat4.rotate(

			transformationMatrix,            // destination matrix
			transformationMatrix,            // matrix to rotate
			toRadians( entity.rotation.z ),  // amount to rotate in radians
			[ 0, 0, 1 ],                     // axis to rotate around
		);

		// Scale
		glMatrix.mat4.scale(

			transformationMatrix,  // destination matrix
			transformationMatrix,  // matrix to scale
			[                      // amount to scale
				entity.scale.x,
				entity.scale.y,
				entity.scale.z
			]
		);
	}

	// ___ Assign matrix ___
	{
		gl.uniformMatrix4fv(

			transformationMatrixUniformLocation,
			false,
			transformationMatrix
		);
	}
}


function createShader ( type, source )
{
	var shader = gl.createShader( type );
	gl.shaderSource( shader, source );
	gl.compileShader( shader );

	var success = gl.getShaderParameter( shader, gl.COMPILE_STATUS );

	if ( success )
	{
		return shader;
	}

	console.log( gl.getShaderInfoLog( shader ) );  // eslint-disable-line

	gl.deleteShader( shader );

	return undefined;
}

function createProgram ( vertexShader, fragmentShader )
{
	var program = gl.createProgram();

	gl.attachShader( program, vertexShader );
	gl.attachShader( program, fragmentShader );

	bindAttributeLocations( program );

	gl.linkProgram( program );

	var success = gl.getProgramParameter( program, gl.LINK_STATUS );

	if ( success )
	{
		return program;
	}

	console.log( gl.getProgramInfoLog( program ) );  // eslint-disable-line

	gl.deleteProgram( program );

	return undefined;
}


function toRadians ( deg )
{
	return deg * Math.PI / 180;
}
