void main()
{
	vec2 p = vec2(0.5)-TexCoord;
	vec4 res = vec4(0.0);
	vec2 d = (p/400.0)*Str;
	float w = 0.5;
	vec2 s = TexCoord;
	for ( int i=0; i<64; i++ )
	{
		res += w*texture(InputTexture,s);
		w *= 1.01;
		s += d;
	}
	res /= 16.0;
	FragColor = mix(texture(InputTexture,TexCoord),vec4(res.rgb,1.0),Fade*0.25);
}
