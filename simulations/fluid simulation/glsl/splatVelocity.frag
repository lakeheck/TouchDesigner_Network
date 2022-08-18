
// Example Pixel Shader

// uniform float exampleUniform;

uniform vec2 uPoint;

uniform vec4 uColor;
uniform float uRadius;
uniform float uAspectRatio;
uniform float uFlowFalloff;


// uniform float uPoint;/

out vec4 fragColor;
void main()


{
	
	// vec2 p = vUV.xy - uPoint;

	// vec4 uColor = texture(sTD2DInputs[2], vUV.st);


	// p.x *= uAspectRatio;

	// vec3 splat = exp(-dot(vUV.xy,vUV.xy)/pow(texture(sTD2DInputs[1], vUV.xy).x*uRadius, 1)) * uColor.rgb;

	vec3 splat = texture(sTD2DInputs[1], vUV.xy).xyz * uColor.rgb;

	splat *= uColor.a;
	
	vec3 base = texture(sTD2DInputs[0], vUV.xy).xyz;

	vec4 color = vec4(base+splat,1);


	// color.a*=uColor.a;


	fragColor = TDOutputSwizzle(color);
}
