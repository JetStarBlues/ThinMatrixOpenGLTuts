var StaticShader = function ( vsSource, fsSource )
{
	// Uniforms
	this.projectionMatrix     = null;
	this.transformationMatrix = null;
	this.normalMatrix         = null;
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
	this.projectionMatrix         = this.getUniformLocation( 'projectionMatrix' );
	this.transformationMatrix     = this.getUniformLocation( 'transformationMatrix' );
	this.normalMatrix             = this.getUniformLocation( 'normalMatrix' );
	this.viewMatrix               = this.getUniformLocation( 'viewMatrix' );
	this.lightPosition            = this.getUniformLocation( 'lightPosition' );
	this.lightColor               = this.getUniformLocation( 'lightColor' );

	this.materialColor            = this.getUniformLocation( 'material.color' );
	this.materialAmbientStrength  = this.getUniformLocation( 'material.ambientStrength' );
	this.materialDiffuseStrength  = this.getUniformLocation( 'material.diffuseStrength' );
	this.materialSpecularStrength = this.getUniformLocation( 'material.specularStrength' );
	this.materialShininess        = this.getUniformLocation( 'material.shininess' );
}


StaticShader.prototype.loadProjectionMatrix = function ( projectionMatrix )
{
	this.loadMatrix4( this.projectionMatrix, projectionMatrix );
}

StaticShader.prototype.loadTransformationMatrix = function ( transformationMatrix )
{
	this.loadMatrix4( this.transformationMatrix, transformationMatrix );
}

StaticShader.prototype.loadNormalMatrix = function ( normalMatrix )
{
	this.loadMatrix4( this.normalMatrix, normalMatrix );
}

StaticShader.prototype.loadViewMatrix = function ( camera )
{
	var viewMatrix = Maths.createViewMatrix( camera );

	this.loadMatrix4( this.viewMatrix, viewMatrix );
}

StaticShader.prototype.loadLight = function ( light )
{
	this.loadVector3( this.lightPosition, light.position );
	this.loadVector3( this.lightColor,    light.color );
}

StaticShader.prototype.loadMaterial = function ( material )
{
	this.loadVector3( this.materialColor,            material.color );
	this.loadFloat(   this.materialAmbientStrength,  material.ambientStrength );
	this.loadFloat(   this.materialDiffuseStrength,  material.diffuseStrength );
	this.loadFloat(   this.materialSpecularStrength, material.specularStrength );
	this.loadFloat(   this.materialShininess,        material.shininess );
}
