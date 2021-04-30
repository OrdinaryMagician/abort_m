// https://www.shadertoy.com/view/4dSyWK

/*
 * Created by Hadyn Lander
 * 3D noise from Nikita Miropolskiy, nikat/2013 https://www.shadertoy.com/view/XsX3zB
 * That basically includes all of this neat looking code up top:
 */

/* discontinuous pseudorandom uniformly distributed in [-0.5, +0.5]^3 */
vec3 random3(vec3 c) {
	float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
	vec3 r;
	r.z = fract(512.0*j);
	j *= .125;
	r.x = fract(512.0*j);
	j *= .125;
	r.y = fract(512.0*j);
	return r-0.5;
}

/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;

/* 3d simplex noise */
float simplex3d(vec3 p) {
	 /* 1. find current tetrahedron T and it's four vertices */
	 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
	 /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/

	 /* calculate s and x */
	 vec3 s = floor(p + dot(p, vec3(F3)));
	 vec3 x = p - s + dot(s, vec3(G3));

	 /* calculate i1 and i2 */
	 vec3 e = step(vec3(0.0), x - x.yzx);
	 vec3 i1 = e*(1.0 - e.zxy);
	 vec3 i2 = 1.0 - e.zxy*(1.0 - e);

	 /* x1, x2, x3 */
	 vec3 x1 = x - i1 + G3;
	 vec3 x2 = x - i2 + 2.0*G3;
	 vec3 x3 = x - 1.0 + 3.0*G3;

	 /* 2. find four surflets and store them in d */
	 vec4 w, d;

	 /* calculate surflet weights */
	 w.x = dot(x, x);
	 w.y = dot(x1, x1);
	 w.z = dot(x2, x2);
	 w.w = dot(x3, x3);

	 /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
	 w = max(0.6 - w, 0.0);

	 /* calculate surflet components */
	 d.x = dot(random3(s), x);
	 d.y = dot(random3(s + i1), x1);
	 d.z = dot(random3(s + i2), x2);
	 d.w = dot(random3(s + 1.0), x3);

	 /* multiply d by w^4 */
	 w *= w;
	 w *= w;
	 d *= w;

	 /* 3. return the sum of the four surflets */
	 return dot(d, vec4(52.0));
}

/*
* The following is all my mess:
*/

#define RADIUS 2.0
#define EDGE 0.6
#define NOISEBIGNESS 0.01
#define NIGHTSPEEDBONUS 4.0
#define PI 3.14159265359

void main()
{
    float time = 28.22+NIGHTSPEEDBONUS*Timer;
    float bignessScale = 1.0/NOISEBIGNESS;
	vec2 ts = textureSize(InputTexture,0);
	vec2 p = (TexCoord*ts) / ts.y;
    float aspect = ts.x/ts.y;
    vec2 positionFromCenter = p-vec2(0.5*aspect, 0.5);

    p = vec2(0.5*aspect, 0.5)+normalize(positionFromCenter)*min(length(positionFromCenter)+0.00, 0.05);

    // Noise:
    vec3 p3 = bignessScale*0.25*vec3(p.x, p.y, 0.0) + vec3(0.0, 0.0, time*0.025);
    float noise = simplex3d(p3*32.0);
	noise = 0.5 + 0.5*noise;

    float distanceFromCenter = clamp(length(positionFromCenter)/RADIUS, 0.0, 1.0)*(noise);

    float falloffMask = 2.0*distanceFromCenter-1.0;
    falloffMask = 1.0-pow(abs(falloffMask), 4.0);

    float thinnerMask = 2.0*distanceFromCenter-1.0;
    thinnerMask = pow(1.0-abs(thinnerMask), 4.0);
    float steppedValue = smoothstep(EDGE,EDGE+0.1, noise*falloffMask);

    float finalValue = steppedValue;
    finalValue = falloffMask;
    // uncomment the above line for a softer effect.

    finalValue = smoothstep(EDGE,EDGE+0.1, noise*finalValue)*0.3*Fade;

    vec3 finalColor = vec3(1.0)*finalValue;
	FragColor = texture(InputTexture,TexCoord)+vec4(finalColor,0.0);
}
