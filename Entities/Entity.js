var Entity = function ( model, vec3_position, vec3_rotation, vec3_scale )
{
	this.model    = model;
	this.position = vec3_position;
	this.rotation = vec3_rotation;
	this.scale    = vec3_scale;
}

Entity.prototype.changePosition = function ( vec3_delta )
{
	this.position.x += vec3_delta.x;
	this.position.y += vec3_delta.y;
	this.position.z += vec3_delta.z;
}

Entity.prototype.changeRotation = function ( vec3_delta )
{
	this.rotation.x += vec3_delta.x;
	this.rotation.y += vec3_delta.y;
	this.rotation.z += vec3_delta.z;
}
