// Texture
const fs_texture = `#version 300 es

	precision mediump float;

	in  vec2 pass_textureCoordinates;

	out vec4 outputColor;

	uniform sampler2D modelTexture;

	void main ( void )
	{
		outputColor = texture( modelTexture, pass_textureCoordinates );
	}
`;
