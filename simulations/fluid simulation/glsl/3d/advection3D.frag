
// Example Pixel Shader

// uniform float exampleUniform;
uniform float uDelta;
uniform float uDiffusion; 


out vec4 fragColor;
void main()
{
	vec2 size = uTD2DInfos[1].res.xy;

    vec3 coord = vUV.xyz - uDelta * texture(sTD2DInputs[1], vUV.xy).xyz * vec3(size.xy,1);

    vec4 result = texture(sTD2DInputs[0], coord.xy);

    float decay = 1.0 + uDiffusion*uDelta;


	vec4 color = result/decay;
	fragColor = TDOutputSwizzle(color);
}
