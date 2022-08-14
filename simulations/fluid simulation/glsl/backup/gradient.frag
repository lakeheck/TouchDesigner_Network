
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

    vec2 vel = texture(sTD2DInputs[1], vUV.xy).xy;
    vel.xy -= vec2(R - L, T - B);



	vec4 color = vec4(vel, 0.0, 1.0);
	fragColor = TDOutputSwizzle(color);
}
