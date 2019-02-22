var ModelTexture = function ( textureID )
{
	this.textureID = textureID;

	this.shineDamper  = 1;    // 1..infinity; 1 represents no damping
	this.reflectivity = 0.1;  // 0..1;        0 represents no reflectivity
}
