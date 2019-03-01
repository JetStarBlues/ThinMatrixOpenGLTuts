// Global variables
var gl;
var program;
var loopID, isPaused;

var then, deltaTime;

var KEY_LEFT  = 37;
var KEY_RIGHT = 39;
var KEY_UP    = 38;
var KEY_DOWN  = 40;
var KEY_A     = 65;
var KEY_D     = 68;
var KEY_F     = 70;
var KEY_G     = 71;
var KEY_H     = 72;
var KEY_P     = 80;
var KEY_Q     = 81;
var KEY_S     = 83;
var KEY_X     = 88;
var KEY_Z     = 90;


// Entry
document.addEventListener( 'DOMContentLoaded', main, false );

function main ()
{
	setup();

	isPaused = false;
	then     = 0;
	loopID   = requestAnimationFrame( render );
}


// Setup
function setup ()
{
	// Initialize the GL context
	const canvas = document.querySelector( '#glCanvas' );
	gl = canvas.getContext( 'webgl2' );

	// Only continue if WebGL is available and working
	if ( gl === null ) {

		alert( 'Unable to initialize WebGL. Your browser or machine may not support it.' );
		return;
	}

	program = new MainGameLoop();
}


// Loop
function render ( now )
{
	// Get time
	now       *= 0.001;       // convert to seconds
	deltaTime  = now - then;
	then       = now;

	// TODO: split to Update(deltaTime) and Draw()
	// ...

	// Render
	program.render();

	// Loop
	loopID = requestAnimationFrame( render );
}


// Exit
function stop ()
{
	cancelAnimationFrame( loopID );  // stop loop

	program.cleanUp();

	console.log( 'Adios!' );
}


// Pause
function pause ()
{
	cancelAnimationFrame( loopID );  // stop loop

	isPaused = true;

	console.log( 'Paused' );
}
function resume ()
{
	isPaused = false;

	console.log( 'Resumed' );

	loopID = requestAnimationFrame( render );  // start loop
}


document.addEventListener( 'keydown', function ( evt ) {

	if ( evt.keyCode == KEY_Q )
	{
		stop();
	}
	else if ( evt.keyCode == KEY_P )
	{
		if ( isPaused )
		{
			resume();
		}
		else
		{
			pause();
		}
	}
} );
