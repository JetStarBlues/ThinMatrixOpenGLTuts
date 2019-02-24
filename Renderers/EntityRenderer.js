var EntityRenderer = function ( shader, projectionMatrix )
{
	this.shader = shader;

	this.shader.start();
	this.shader.loadProjectionMatrix( projectionMatrix );
	this.shader.stop();
}

EntityRenderer.prototype.render = function ( entities )
{
	var modelIDs = Object.keys( entities );

	for ( var i = 0; i < modelIDs.length; i += 1 )
	{
		// Prepare the model once
		var modelID = modelIDs[ i ];

		var batch = entities[ modelID ];

		// all items in a batch have the same model
		var model       = batch[ 0 ].model;
		var vertexCount = model.getVertexCount();

		this.prepareTexturedModel( model );


		// Draw it several times...
		for ( var j = 0; j < batch.length; j += 1 )
		{
			var entity = batch[ j ];

			// entity.changePosition( { 'x' : 0.00002, 'y' : 0, 'z' : 0 } );
			// entity.changePosition( { 'x' : 0, 'y' : 0, 'z' : -0.00002 } );
			entity.changeRotation( { 'x' : 0, 'y' : 0.5, 'z' : 0 } );
			// entity.changeRotation( { 'x' : 0.5, 'y' : 0.5, 'z' : 0 } );

			this.prepareInstance( entity );

			gl.drawElements(

				gl.TRIANGLES,       // mode
				// gl.LINE_STRIP,      // mode
				vertexCount,        // count
				gl.UNSIGNED_SHORT,  // type; gl.UNSIGNED_INT apparently supported in WEBGL2
				0                   // offset
			);
		}


		// Cleanup
		this.unbindTexturedModel();
	}
}

EntityRenderer.prototype.prepareTexturedModel = function ( model )
{
	gl.bindVertexArray( model.rawModel.vaoID );

	gl.enableVertexAttribArray( 0 );  // position
	gl.enableVertexAttribArray( 1 );  // texureCoordinates
	gl.enableVertexAttribArray( 2 );  // normal

	this.shader.loadShineDamper( model.texture.shineDamper );
	this.shader.loadReflectivity( model.texture.reflectivity );

	gl.activeTexture( gl.TEXTURE0 );
	gl.bindTexture( gl.TEXTURE_2D, model.texture.textureID );
}

EntityRenderer.prototype.prepareInstance = function ( entity )
{
	var transformationMatrix = Maths.createTransformationMatrix(

		entity.position,
		entity.rotation,
		entity.scale
	);

	var normalMatrix = Maths.createNormalMatrix( transformationMatrix );

	this.shader.loadTransformationMatrix( transformationMatrix );
	this.shader.loadNormalMatrix( normalMatrix );
}

EntityRenderer.prototype.unbindTexturedModel = function ()
{
	gl.disableVertexAttribArray( 0 );  // position
	gl.disableVertexAttribArray( 1 );  // texureCoordinates
	gl.disableVertexAttribArray( 2 );  // normal

	gl.bindVertexArray( null );
}
