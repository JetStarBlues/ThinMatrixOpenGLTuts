var Camera = function ()
{
	this.position = {

		'x' : 0, //0.0,
		'y' : 0, //5.0,
		'z' : 0, //0.0
	}

	this.rotation = {

		'x' : 0,  //10.0,  // pitch
		'y' : 0,  //0.0,   // yaw
		'z' : 0,  //0.0,   // roll
	}

	this.posDelta = 0.2;


	// Add event listener for keydown
	var instance = this;

	document.addEventListener( 'keydown', function ( evt ) {

		instance.move( evt, evt.keyCode );
	} );
}

Camera.prototype.move = function ( evt, keyCode )
{
	if ( keyCode == KEY_RIGHT )
	{
		evt.preventDefault();  // disable document scroll

		this.position.x += this.posDelta;
		console.log( '+ camera pos x', this.position );
	}
	if ( keyCode == KEY_LEFT )
	{
		evt.preventDefault();  // disable document scroll

		this.position.x -= this.posDelta;
		console.log( '- camera pos x', this.position );
	}
	if ( keyCode == KEY_UP )
	{
		evt.preventDefault();  // disable document scroll

		this.position.y += this.posDelta;
		console.log( '+ camera pos y', this.position );
	}
	if ( keyCode == KEY_DOWN )
	{
		evt.preventDefault();  // disable document scroll

		this.position.y -= this.posDelta;
		console.log( '- camera pos y', this.position );
	}
	if ( keyCode == KEY_Z )
	{
		this.position.z += this.posDelta;
		console.log( '+ camera pos z', this.position );
	}
	if ( keyCode == KEY_X )
	{
		this.position.z -= this.posDelta;
		console.log( '- camera pos z', this.position );
	}
}
