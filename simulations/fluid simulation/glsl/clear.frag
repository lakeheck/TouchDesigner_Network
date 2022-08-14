
// Example Pixel Shader

// uniform float exampleUniform;
uniform float uClear;

out vec4 fragColor;
void main()
{
	vec4 color = uClear * texture(sTD2DInputs[0], vUV.xy);


	// vec4 color = vec4(1.0);
	fragColor = TDOutputSwizzle(color);
}
