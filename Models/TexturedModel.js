var TexturedModel = function ( model, texture )
{
	this.rawModel = model;
	this.texture  = texture;
}

TexturedModel.prototype.getModelID = function ()
{
	return this.rawModel.getModelID();
}

TexturedModel.prototype.getVertexCount = function ()
{
	return this.rawModel.getVertexCount();
}
