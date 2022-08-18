
// Example Pixel Shader

// uniform float exampleUniform;

uniform vec2 uPoint;
uniform float uRadius; //dont use since we use maps
uniform float uAspectRatio;
uniform float uFlowFalloff;


// uniform float uPoint;/

out vec4 fragColor;
void main()


{
	
	vec2 p = vUV.xy;

	//p.x *= uAspectRatio;


	vec4 force = texture(sTD2DInputs[2], p);

	// vec3 splat = exp(-dot(vUV.xy,vUV.xy)/pow(texture(sTD2DInputs[1], vUV.xy).x*uRadius, 1)) * force.rgb;

	vec2 splat = smoothstep(0,1,texture(sTD2DInputs[1], vUV.xy).x) * force.rg;

	splat *= force.a;

	// splat = smoothstep(0,1,splat);
	
	vec3 base = texture(sTD2DInputs[0], vUV.xy).xyz;

	vec4 color = vec4(base.xy+splat.xy,base.z, 1);


	// color.a*=uColor.a;


	fragColor = TDOutputSwizzle(color);
}
