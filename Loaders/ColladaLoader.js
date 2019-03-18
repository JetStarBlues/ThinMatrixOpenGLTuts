var ColladaLoader = function ()
{
	this.ready       = false;
	this.initialized = false;

	this.data = {

		'indices'       : [],
		'positions'     : [],
		'textureCoords' : [],
		'normals'       : [],
		'vertexColors'  : [],
	}

	this.loader   = null;
	this.rawModel = null;
}

ColladaLoader.prototype.loadColladaModel = function ( filepath, loader )
{
	this.loader = loader;

	this.readFile( filepath );
}

ColladaLoader.prototype.onLoad = function ( rawText )
{
	this.parseFile( rawText );

	this.rawModel = this.loader.loadToVAO( this.data, true );

	this.ready = true;

	console.log( 'Collada model is ready!' );
}

ColladaLoader.prototype.readFile = function ( filepath )
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

ColladaLoader.prototype.parseFile = function ( rawText )
{
	scene = Collada.parse( rawText );  // See 3rd party library collada.js

	console.log( scene );

	for ( var meshName in scene.meshes )
	{
		mesh = scene.meshes[ meshName ];

		// console.log( mesh );


		this.data[ 'indices' ]   = mesh.triangles;
		this.data[ 'positions' ] = mesh.vertices;

		if ( 'coords' in mesh )
		{
			this.data[ 'textureCoords' ] = mesh.coords;
		}
		if ( 'normals' in mesh )
		{
			this.data[ 'normals' ] = mesh.normals;
		}
		if ( 'color' in mesh )
		{
			this.data[ 'vertexColors' ] = mesh.color;
		}

		console.log( this.data );


		// Exit after first mesh
		break;
	}
}
