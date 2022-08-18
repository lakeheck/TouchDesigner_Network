
// Example Pixel Shader

// uniform float exampleUniform;

#include "glsl_includes"


uniform float uDelta;
uniform float uVorticity; 


out vec4 fragColor;
void main()
{
    float L = texture(sTD2DInputs[1], pL).x;
    float R = texture(sTD2DInputs[1], pR).x;
    float T = texture(sTD2DInputs[1], pT).x;
    float B = texture(sTD2DInputs[1], pB).x;
    
    float C = texture(sTD2DInputs[1], vUV.xy).x;


    // float curl = R - L - T + B;

    vec2 force = 0.5*vec2(abs(T) - abs(B), abs(R) - abs(L)); //should probably inlude sampleing from front/back as well 

    force /= length(force) + 0.0001;
    force *= uVorticity * C;
    force.y *= -1.0;

    vec3 vel = texture(sTD2DInputs[0], vUV.xy).xyz;


	vec4 color = vec4(vel.xy + force * uDelta, vel.z, 1.0); //error potential 
	fragColor = TDOutputSwizzle(color);
}
