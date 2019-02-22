var ShaderProgram = function ( vsSource, fsSource )
{
	this.programID = gl.createProgram();

	this.vertexShaderID   = this.loadShader( gl.VERTEX_SHADER,   vsSource );
	this.fragmentShaderID = this.loadShader( gl.FRAGMENT_SHADER, fsSource );

	gl.attachShader( this.programID, this.vertexShaderID );
	gl.attachShader( this.programID, this.fragmentShaderID );

	this.bindAttributes();

	gl.linkProgram( this.programID );

	// If creating the shader program failed, alert
	if ( ! gl.getProgramParameter( this.programID, gl.LINK_STATUS ) )
	{
		var info = gl.getProgramInfoLog( this.programID );

		alert( 'Unable to initialize the shader program: ' + info );
	}

	gl.validateProgram( this.programID );

	this.getAllUniformLocations();
}


ShaderProgram.prototype.bindAttribute = function ( index, name )
{
	gl.bindAttribLocation( this.programID, index, name );
}

ShaderProgram.prototype.bindAttributes = function ()
{
	// Defined by child
}


ShaderProgram.prototype.getUniformLocation = function ( name )
{
	return gl.getUniformLocation( this.programID, name );
}

ShaderProgram.prototype.getAllUniformLocations = function ()
{
	// Defined by child
}


ShaderProgram.prototype.start = function ()
{
	gl.useProgram( this.programID );
}

ShaderProgram.prototype.stop = function ()
{
	gl.useProgram( null );
}

ShaderProgram.prototype.cleanUp = function ()
{
	this.stop();

	gl.detachShader( this.programID, this.vertexShaderID );
	gl.detachShader( this.programID, this.fragmentShaderID );

	gl.deleteShader( this.vertexShaderID );
	gl.deleteShader( this.fragmentShaderID );

	gl.deleteProgram( this.programID );
}


ShaderProgram.prototype.loadFloat = function ( location, value )
{
	gl.uniform1f( location, value );
}

ShaderProgram.prototype.loadVector3 = function ( location, value )
{
	gl.uniform3f( location, value.x, value.y, value.z );
}

ShaderProgram.prototype.loadBoolean = function ( location, value )
{
	var _value = value ? 1 : 0;

	gl.uniform1f( location, _value );
}

ShaderProgram.prototype.loadMatrix4 = function ( location, matrix )
{
	gl.uniformMatrix4fv(

		location,
		false,
		matrix
	);
}


ShaderProgram.prototype.loadShader = function ( type, shaderText )
{
	var shaderID = gl.createShader( type );

	gl.shaderSource( shaderID, shaderText );

	gl.compileShader( shaderID );

	// See if it compiled successfully
	if ( ! gl.getShaderParameter( shaderID, gl.COMPILE_STATUS ) )
	{
		var info = gl.getShaderInfoLog( shaderID );

		alert( 'An error occurred compiling the shader: ' + info );

		gl.deleteShader( shaderID );

		return null;
	}

	return shaderID;
}
