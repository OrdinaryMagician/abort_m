vec3 hsv2rgb( vec3 c )
{
	vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,0.0,1.0);
	return c.z*mix(vec3(1.0),rgb,c.y);
}

vec4 ProcessTexel()
{
	vec4 px = getTexel(vTexCoord.st);
	px.a = (px.a*2.0)-1.0;
	return vec4(hsv2rgb(vec3(fract(timer),1.0,px.r)),px.a);
}
