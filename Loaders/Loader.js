var Loader = function ()
{
	this.VAOs     = [];  // array object. Holds attributes (ex. pos, normal) in the form of buffers...
	this.VBOs     = [];  // buffer object
	this.textures = [];

	this.rawModelID = 0;  // Can't use an object instance as a key in JS

}

Loader.prototype.loadToVAO = function ( positions, textureCoords, normals, indices )
{
	var vaoID = this.createVAO();

	this.bindIndicesBuffer( indices );

	this.storeDataInAttributeList( 0, 3, positions );
	this.storeDataInAttributeList( 1, 2, textureCoords );
	this.storeDataInAttributeList( 2, 3, normals );

	this.unbindVAO();  // might load more...

	var rawModel = new RawModel( this.rawModelID, vaoID, indices.length );

	this.rawModelID += 1;

	return rawModel;
}

Loader.prototype.createVAO = function ()
{
	// var vaoID = gl.genVertexArrays();
	var vaoID = gl.createVertexArray();  // WEBGL...

	this.VAOs.push( vaoID );

	gl.bindVertexArray( vaoID );

	return vaoID;
}

Loader.prototype.unbindVAO = function ()
{
	gl.bindVertexArray( null );
}

Loader.prototype.bindIndicesBuffer = function ( indices )
{
	// var vboID = gl.genBuffers();
	var vboID = gl.createBuffer();  // WEBGL...

	this.VBOs.push( vboID );

	gl.bindBuffer(

		gl.ELEMENT_ARRAY_BUFFER,
		vboID
	);

	gl.bufferData(

		gl.ELEMENT_ARRAY_BUFFER,
		new Uint16Array( indices ),
		gl.STATIC_DRAW
	);
}

Loader.prototype.storeDataInAttributeList = function ( attributeNumber, coordinateSize, data )
{
	// var vboID = gl.genBuffers();
	var vboID = gl.createBuffer();  // WEBGL...

	this.VBOs.push( vboID );

	gl.bindBuffer(

		gl.ARRAY_BUFFER,
		vboID
	);

	gl.bufferData(

		gl.ARRAY_BUFFER,
		new Float32Array( data ),
		gl.STATIC_DRAW
	);

	gl.vertexAttribPointer(

		attributeNumber,  // index
		coordinateSize,   // size
		gl.FLOAT,         // type
		false,            // normalize
		0,                // stride
		0                 // offset
	);

	gl.bindBuffer(

		gl.ARRAY_BUFFER,
		null
	);
}

Loader.prototype.cleanUp = function ()
{
	for ( var i = 0; i < this.VAOs.length; i += 1 )
	{
		gl.deleteVertexArray( this.VAOs[ i ] );
	}

	for ( var i = 0; i < this.VBOs.length; i += 1 )
	{
		gl.deleteBuffer( this.VBOs[ i ] );
	}

	for ( var i = 0; i < this.textures.length; i += 1 )
	{
		gl.deleteTexture( this.textures[ i ] );
	}
}
