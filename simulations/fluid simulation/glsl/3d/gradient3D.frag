
// Example Pixel Shader

// uniform float exampleUniform;

#include "glsl_includes"


uniform float uDelta;
uniform float uVorticity; 


out vec4 fragColor;
void main()
{
    float L = texture(sTD2DInputs[0], pL).x;
    float R = texture(sTD2DInputs[0], pR).x;
    float T = texture(sTD2DInputs[0], pT).x;
    float B = texture(sTD2DInputs[0], pB).x;
    float front = (texture(sTD2DInputs[0], pT).z- texture(sTD2DInputs[0], pB).z);
    float back = (texture(sTD2DInputs[0], pL).z- texture(sTD2DInputs[0], pR).z);

    vec3 vel = texture(sTD2DInputs[1], vUV.xy).xyz;
    vel.xyz -= vec3(R - L, T - B, front-back);



	vec4 color = vec4(vel, 1.0);
	fragColor = TDOutputSwizzle(color);
}
