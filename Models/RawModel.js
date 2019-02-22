var RawModel = function ( rawModelID, vaoID, vertexCount )
{
	this.rawModelID  = rawModelID;
	this.vaoID       = vaoID;
	this.vertexCount = vertexCount;
}

RawModel.prototype.getModelID = function ()
{
	return this.rawModelID;
}

RawModel.prototype.getVertexCount = function ()
{
	return this.vertexCount;
}
