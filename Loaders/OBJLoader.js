var OBJLoader = function ()
{
	this.ready       = false;
	this.initialized = false;

	this.data = {

		'positions'     : [],
		'textureCoords' : [],
		'normals'       : [],
		'indices'       : [],
		'vertexColors'  : [],
	}

	this.loader   = null;
	this.rawModel = null;
	this.rawText  = null;
}

OBJLoader.prototype.loadOBJModel = function ( filepath, loader )
{
	this.loader = loader;

	// Because it might take a while to prepare...
	// this.createPlaceholder();

	this.readFile( filepath );
}

OBJLoader.prototype.createPlaceholder = function ()
{
	this.rawModel = this.loader.loadToVAO(

		OBJLoader.placeholderData.positions,
		OBJLoader.placeholderData.textureCoords,
		OBJLoader.placeholderData.normals,
		OBJLoader.placeholderData.indices
	);	
}

OBJLoader.prototype.onLoad = function ( rawText )
{
	this.rawText = rawText;

	this.parseFile();

	this.rawModel = this.loader.loadToVAO(

		this.data.positions,
		this.data.textureCoords,
		this.data.normals,
		this.data.indices
	);

	this.ready = true;

	console.log( 'OBJ model is ready!' );
}

OBJLoader.prototype.readFile = function ( filepath )
{
	// save 'this'; https://stackoverflow.com/a/6985358
	var instance = this;

	var request = new XMLHttpRequest();

	request.open( 'GET', filepath, true );

	request.onreadystatechange = function ()
	{
		if ( request.readyState === 4 )
		{
			if ( request.status === 200 || request.status === 0 )
			{
				instance.onLoad( request.responseText );
			}
		}
	}

	request.send( null );
}

OBJLoader.prototype.parseFile = function ()
{
	var lines = this.rawText.split( '\n' );

	var positions     = [];
	var textureCoords = [];
	var normals       = [];
	var faces         = [];
	var vertexColors  = [];

	for ( var i = 0; i < lines.length; i += 1 )
	{
		line = lines[ i ].split( ' ' );

		// console.log( line );

		// vertex coordinates
		if ( line[ 0 ] == 'v' )
		{
			var coordRaw = line.slice( 1 );
			var coord    = [];

			for ( var j = 0; j < 3; j += 1 )
			{
				coord.push( parseFloat( coordRaw[ j ] ) );
			}

			// console.log( 'v', coord );

			// positions.push( coord );
			Array.prototype.push.apply( positions, coord );  // extend

			// vertex colors
			if ( coordRaw.length > 3 )
			{
				var color = [];

				for ( var j = 3; j < 6; j += 1 )
				{
					color.push( parseFloat( coordRaw[ j ] ) );
				}

				color.push( 1.0 );  // will ignore object alpha...

				// console.log( 'vc', color );

				// vertexColors.push( color );
				Array.prototype.push.apply( vertexColors, color );
			}
		}

		// texture coordinates
		else if ( line[ 0 ] == 'vt' )
		{
			var coordRaw = line.slice( 1 );
			var coord    = [];

			for ( var j = 0; j < 2; j += 1 )
			{
				coord.push( parseFloat( coordRaw[ j ] ) );
			}

			coord[ 1 ] = 1 - coord[ 1 ];  // something about Blender vs OpenGL yAxis

			// console.log( 'vt', coord );

			textureCoords.push( coord );
		}

		// normal coordinates
		else if ( line[ 0 ] == 'vn' )
		{
			var coordRaw = line.slice( 1 );
			var coord    = [];

			for ( var j = 0; j < 3; j += 1 )
			{
				coord.push( parseFloat( coordRaw[ j ] ) );
			}

			// console.log( 'vn', coord );

			normals.push( coord );
		}

		// face
		else if ( line[ 0 ] == 'f' )
		{
			var coordRaw = line.slice( 1 );
			var coord    = [];

			for ( var j = 0; j < coordRaw.length; j += 1 )
			{
				var indicesRaw = coordRaw[ j ].split( '/' );
				var indices = [];

				for ( var k = 0; k < indicesRaw.length; k += 1 )
				{
					indices.push( parseInt( indicesRaw[ k ] ) );
				}

				coord.push( indices );
			}

			// console.log( 'f', coord );

			faces.push( coord );
		}
	}


	// Create indexed blah...
	this.data[ 'positions' ] = positions;

	if ( vertexColors.length != 0 )
	{
		this.data[ 'vertexColors' ] = vertexColors;
	}

	for ( var i = 0; i < faces.length; i += 1 )
	{
		var face = faces[ i ];

		// console.log( 'face', face );

		// for each vert that defines the face...
		for ( var j = 0; j < face.length; j += 1 )
		{
			var vertexData = face[ j ];

			this.data[ 'vertexCount' ] += 1;

			// console.log( 'vertexData', vertexData );

			var vertexIndex = vertexData[ 0 ];
			var textureIndex;
			var normalIndex;

			// console.log( 'vertexIndex', vertexIndex );

			this.data[ 'indices'  ].push( vertexIndex - 1 );  // OBJ one vs zero-indexed

			if ( vertexData.length == 2 || vertexData.length == 3 )
			{
				textureIndex = vertexData[ 1 ];

				// console.log( 'textureIndex', textureIndex, textureCoords[ textureIndex - 1 ] );

				// this.data[ 'textureCoords' ].push( textureCoords[ textureIndex ] );
				Array.prototype.push.apply( this.data[ 'textureCoords' ], textureCoords[ textureIndex - 1 ] );
			}

			if ( vertexData.length == 3 )
			{
				normalIndex  = vertexData[ 2 ];

				// console.log( 'normalIndex', normalIndex, normals[ normalIndex - 1 ] );

				// this.data[ 'normals' ].push( normals[ normalIndex ] );
				Array.prototype.push.apply( this.data[ 'normals' ], normals[ normalIndex - 1 ] );
			}
		}
	}
}


OBJLoader.placeholderData = {

	// Cube
	'positions' :
	[
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
	],
	'textureCoords' :
	[
		// Front
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Back
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Top
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Bottom
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Right
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
		// Left
		0.0,  0.0,
		1.0,  0.0,
		1.0,  1.0,
		0.0,  1.0,
	],
	'normals' :
	[
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
	],
	'indices' :
	[
		0,  1,  2,      0,  2,  3,    // front
		4,  5,  6,      4,  6,  7,    // back
		8,  9,  10,     8,  10, 11,   // top
		12, 13, 14,     12, 14, 15,   // bottom
		16, 17, 18,     16, 18, 19,   // right
		20, 21, 22,     20, 22, 23,   // left
	],
}

OBJLoader.placeholderData_rectangle = {

	'positions' : [

		-0.5,  0.5, 0,  // v0
		-0.5, -0.5, 0,  // v1
		 0.5, -0.5, 0,  // v2
		 0.5,  0.5, 0,  // v3
	],
	'textureCoords' : [

		0, 0,  // v0
		0, 1,  // v1
		1, 1,  // v2
		1, 0   // v3
	],
	'normals' : [],
	'indices' : [

		0, 1, 3,  // top left triangle (v0, v1, v3)
		3, 1, 2   // bottom right triangle (v3, v1, v2)
	],
}

OBJLoader.placeholderData_cubeTut = {

	'positions' : [

		-0.5, 0.5,-0.5,	
		-0.5,-0.5,-0.5,	
		 0.5,-0.5,-0.5,	
		 0.5, 0.5,-0.5,		

		-0.5, 0.5, 0.5,	
		-0.5,-0.5, 0.5,	
		 0.5,-0.5, 0.5,	
		 0.5, 0.5, 0.5,

		 0.5, 0.5,-0.5,	
		 0.5,-0.5,-0.5,	
		 0.5,-0.5, 0.5,	
		 0.5, 0.5, 0.5,

		-0.5, 0.5,-0.5,	
		-0.5,-0.5,-0.5,	
		-0.5,-0.5, 0.5,	
		-0.5, 0.5, 0.5,

		-0.5, 0.5, 0.5,
		-0.5, 0.5,-0.5,
		 0.5, 0.5,-0.5,
		 0.5, 0.5, 0.5,

		-0.5,-0.5, 0.5,
		-0.5,-0.5,-0.5,
		 0.5,-0.5,-0.5,
		 0.5,-0.5, 0.5
	],
	'textureCoords' : [

		0,0,
		0,1,
		1,1,
		1,0,			
		0,0,
		0,1,
		1,1,
		1,0,			
		0,0,
		0,1,
		1,1,
		1,0,
		0,0,
		0,1,
		1,1,
		1,0,
		0,0,
		0,1,
		1,1,
		1,0,
		0,0,
		0,1,
		1,1,
		1,0
	],
	'normals' : [],
	'indices' : [

		 0, 1, 3,	
		 3, 1, 2,	
		 4, 5, 7,
		 7, 5, 6,
		 8, 9,11,
		11, 9,10,
		12,13,15,
		15,13,14,	
		16,17,19,
		19,17,18,
		20,21,23,
		23,21,22
	],
}
