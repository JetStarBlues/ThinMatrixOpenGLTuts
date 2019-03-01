var TextureLoader = function ()
{
	this.mipLevel       = 0;
	this.internalFormat = gl.RGBA;
	this.srcFormat      = gl.RGBA;
	this.srcType        = gl.UNSIGNED_BYTE;

	this.image = null;
	// this.textureID = null;
};

TextureLoader.prototype.loadTexture = function ( filepath, type )
{
	var textureID = gl.createTexture();

	gl.bindTexture( gl.TEXTURE_2D, textureID );

	// While waiting for the texture to the load
	this.createPlaceholderTexture();

	// Load image
	if ( type == 'image' )
	{
		// save 'this'; https://stackoverflow.com/a/6985358
		var instance = this;

		// create container
		this.image = new Image();

		// create callback
		instance.image.onload = function ()
		{
			instance.createImageTexture();
		};

		// download the image
		this.image.src = filepath;
	}

	// else if ( type == 'video' ) {}

	else
	{
		alert( 'Unknown media type - loadTexture' );
	}


	return textureID;
}

TextureLoader.prototype.createPlaceholderTexture = function ()
{
	/* Because images/video have to be download over the internet
	   they might take a moment until they are ready.
	   Until then put a single pixel in the texture so we can
	   use it immediately. When the image has finished downloading
	   we'll update the texture with the contents of the image.
	*/
	const width  = 1;
	const height = 1;
	const border = 0;
	const pixel  = new Uint8Array( [ 0, 255, 255, 255 ] );  // opaque cyan

	gl.texImage2D(

		gl.TEXTURE_2D,
		this.mipLevel,
		this.internalFormat,
		width,
		height,
		border,
		this.srcFormat,
		this.srcType,
		pixel
	);
}

TextureLoader.prototype.createImageTexture = function ()
{
	gl.texImage2D(

		gl.TEXTURE_2D,
		this.mipLevel,
		this.internalFormat,
		this.srcFormat,
		this.srcType,
		this.image
	);

	gl.generateMipmap( gl.TEXTURE_2D );
}
