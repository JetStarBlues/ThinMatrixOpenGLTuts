var MasterRenderer = function ( vsSource, fsSource )
{
	this.configureGL();

	this.fieldOfView = Maths.toRadians( 70 );
	this.aspectRatio = gl.canvas.clientWidth / gl.canvas.clientHeight;
	this.zNear       = 0.1;
	this.zFar        = 1000;

	this.projectionMatrix = glMatrix.mat4.create();

	glMatrix.mat4.perspective(

		this.projectionMatrix,
		this.fieldOfView,
		this.aspectRatio,
		this.zNear,
		this.zFar
	);


	this.shader = new StaticShader( vsSource, fsSource );

	this.entities = {};

	this.renderer = new EntityRenderer( this.shader, this.projectionMatrix );
}

MasterRenderer.prototype.render = function ( sun, camera )
{
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	this.shader.start();

	this.shader.loadLight( sun );
	this.shader.loadViewMatrix( camera );

	this.renderer.render( this.entities );

	this.shader.stop();
}

MasterRenderer.prototype.configureGL = function ()
{
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );  // Clear to black, fully opaque

	// Depth test
	gl.clearDepth( 1.0 );                 // Clear everything
	gl.enable( gl.DEPTH_TEST );           // Enable depth testing
	gl.depthFunc( gl.LEQUAL );            // Near things obscure far things

	// Culling
	gl.enable( gl.CULL_FACE );            // enable culling
	gl.cullFace( gl.BACK );               // back-facing are candidates for culling
}

MasterRenderer.prototype.processEntity = function ( entity )
{
	var modelID = entity.model.getModelID();  // unique

	if ( modelID in this.entities )
	{
		// append
		this.entities[ modelID ].push( entity );
	}
	else
	{
		// create
		this.entities[ modelID ] = [ entity ];
	}
}

MasterRenderer.prototype.cleanUp = function ()
{
	this.shader.cleanUp();
}
