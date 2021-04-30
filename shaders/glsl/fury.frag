vec4 ProcessTexel()
{
	vec4 res = getTexel(vTexCoord.st);
	float f = texture(fury,vTexCoord.st).x;
	f = fract(f+timer);
	res.rgb *= 1.0+f;
	return res;
}
