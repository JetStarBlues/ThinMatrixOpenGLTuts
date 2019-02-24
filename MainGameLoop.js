var MainGameLoop = function ()
{
	this.objLoader     = null;
	this.loader        = null;
	this.textureLoader = null;

	this.renderer = null;
	this.light    = null;
	this.camera   = null;
	this.texture  = null;

	this.setup();
}

MainGameLoop.prototype.setup = function ()
{
	// Start loading models
	this.loader        = new Loader();
	this.objLoader     = new OBJLoader();
	this.textureLoader = new TextureLoader();

	this.objLoader.loadOBJModel( 'Resources/stall.obj', this.loader );
	// this.objLoader.loadOBJModel( 'Resources/Custom/cube.obj', this.loader );
	// this.objLoader.loadOBJModel( 'Resources/Custom/blenderMonkey.obj', this.loader );
	// this.objLoader.loadOBJModel( '../../3DModels/Temp/sonicTest.obj', this.loader );

	this.texture = new ModelTexture( this.textureLoader.loadTexture( 'Resources/stall.png', 'image' ) );
	// this.texture.shineDamper  = 1;
	// this.texture.reflectivity = 0.2;


	// Setup shaders
	// var vsSource = vs_specular;
	// var fsSource = fs_specular;
	var vsSource = vs_texture;
	var fsSource = fs_texture;


	// Setup light
	var position = {

		'x' : 20000,
		'y' : 20000,
		'z' : 2000,
	};
	var color = {

		'x' : 1,
		'y' : 1,
		'z' : 1,
	};

	this.light = new Light( position, color );


	// Setup camera
	this.camera = new Camera();


	// Setup renderer
	this.renderer = new MasterRenderer( vsSource, fsSource );
}

MainGameLoop.prototype.render = function ()
{
	// Check status of asynchronous events
	if ( ( ! this.objLoader.initialized ) && this.objLoader.ready )
	{
		// OBJ is loaded, can now generate dependencies
		this.setupEntities();

		// do this only once
		this.objLoader.initialized = true;
	}

	// Render
	this.renderer.render( this.light, this.camera );
}

MainGameLoop.prototype.setupEntities = function ()
{
	// Setup model
	var rawModel = this.objLoader.rawModel;

	var texturedModel = new TexturedModel( rawModel, this.texture );


	// Setup entities
	var rotation = {

		'x' : 0,
		'y' : 0,
		'z' : 0,
	};
	var scale = {

		'x' : 1, // 3,
		'y' : 1, // 3,
		'z' : 1, // 3,
	};

	var entities = [];

	// for ( var i = 0; i < 500; i += 1 )
	// for ( var i = 0; i < 5; i += 1 )
	for ( var i = 0; i < 1; i += 1 )
	{
		var position = {

			'x' :  0,
			'y' :  0,
			'z' : -4,

			// 'x' : Math.random() * 800 - 400,
			// 'y' : 0, // Math.random() * 800 - 400,
			// 'z' : Math.random() * ( - 600 ),
		};

		var entity = new Entity( texturedModel, position, rotation, scale );

		entities.push( entity );
	}

	for ( var i = 0; i < entities.length; i += 1 )
	{
		this.renderer.processEntity( entities[ i ] );
	}

	// console.log( this.renderer.entities );
}

MainGameLoop.prototype.cleanUp = function ()
{
	this.renderer.cleanUp();
	this.loader.cleanUp();
}
