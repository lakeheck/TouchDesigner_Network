
// Example Pixel Shader

// uniform float exampleUniform;

uniform vec3 uPoint;

uniform vec4 uColor;
uniform float uRadius;
uniform float uAspectRatio;
uniform float uFlowFalloff;


// uniform float uPoint;/

out vec4 fragColor;
void main()


{
	
	vec3 p = vUV.xyz - uPoint;


	p.x *= uAspectRatio;

	vec3 splat = exp(-dot(p,p)/pow(uRadius, 1)) * uColor.rgb;

	splat *= uColor.a; //uColor.a is set to 1 in the velocity shader so this only affects color
	
	vec3 base = texture(sTD2DInputs[0], vUV.xy).xyz;

	vec4 color = vec4(base+splat,1);


	// color.a*=uColor.a;


	fragColor = TDOutputSwizzle(color);
}
