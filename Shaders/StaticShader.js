var StaticShader = function ( vsSource, fsSource )
{
	// Uniforms
	this.transformationMatrix = null;
	this.projectionMatrix     = null;
	this.viewMatrix           = null;
	this.lightPosition        = null;
	this.lightColor           = null;
	this.shineDamper          = null;
	this.reflectivity         = null;

	// Extends ShaderProgram; get fields
	ShaderProgram.call ( this, vsSource, fsSource );
}

// Extends ShaderProgram; get methods
StaticShader.prototype = Object.create( ShaderProgram.prototype );


StaticShader.prototype.bindAttributes = function ()
{
	this.bindAttribute( 0, 'position' );
	this.bindAttribute( 1, 'texureCoordinates' );
	this.bindAttribute( 2, 'normal' );
}


StaticShader.prototype.getAllUniformLocations = function ()
{
	this.transformationMatrix = this.getUniformLocation( 'transformationMatrix' );
	this.projectionMatrix     = this.getUniformLocation( 'projectionMatrix' );
	this.viewMatrix           = this.getUniformLocation( 'viewMatrix' );
	this.lightPosition        = this.getUniformLocation( 'lightPosition' );
	this.lightColor           = this.getUniformLocation( 'lightColor' );
	this.shineDamper          = this.getUniformLocation( 'shineDamper' );
	this.reflectivity         = this.getUniformLocation( 'reflectivity' );
}


StaticShader.prototype.loadTransformationMatrix = function ( transformationMatrix )
{
	this.loadMatrix4( this.transformationMatrix, transformationMatrix );
}

StaticShader.prototype.loadProjectionMatrix = function ( projectionMatrix )
{
	this.loadMatrix4( this.projectionMatrix, projectionMatrix );
}

StaticShader.prototype.loadViewMatrix = function ( camera )
{
	var viewMatrix = Maths.createViewMatrix( camera );

	this.loadMatrix4( this.viewMatrix, viewMatrix );
}

StaticShader.prototype.loadLight = function ( light )
{
	this.loadVector3( this.lightPosition, light.position );
	this.loadVector3( this.lightColor, light.color );
}

StaticShader.prototype.loadShineDamper = function ( value )
{
	this.loadFloat( this.shineDamper, value );
}

StaticShader.prototype.loadReflectivity = function ( value )
{
	this.loadFloat( this.reflectivity, value );
}
