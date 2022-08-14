
// Example Pixel Shader

// uniform float exampleUniform;

uniform vec2 uPoint;

uniform float uFlow;
uniform float uRadius;
uniform float uAspectRatio;
uniform float uFlowFalloff;


// uniform float uPoint;/

out vec4 fragColor;

vec3 reinhard_extended(vec3 v, float max_white)
{
    vec3 numerator = v * (1.0f + (v / vec3(max_white * max_white)));
    return numerator / (1.0f + v);
}

float luminance(vec3 v)
{
    return dot(v, vec3(0.2126f, 0.7152f, 0.0722f));
}

vec3 change_luminance(vec3 c_in, float l_out)
{
    float l_in = luminance(c_in);
    return c_in * (l_out / l_in);
}

vec3 reinhard_extended_luminance(vec3 v, float max_white_l)
{
    float l_old = luminance(v);
    float numerator = l_old * (1.0f + (l_old / (max_white_l * max_white_l)));
    float l_new = numerator / (1.0f + l_old);
    return change_luminance(v, l_new);
}

vec3 uncharted2_tonemap_partial(vec3 x)
{
    float A = 0.15f;
    float B = 0.50f;
    float C = 0.10f;
    float D = 0.20f;
    float E = 0.02f;
    float F = 0.30f;
    return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;
}

vec3 uncharted2_filmic(vec3 v)
{
    float exposure_bias = 2.0f;
    vec3 curr = uncharted2_tonemap_partial(v * exposure_bias);

    vec3 W = vec3(11.2f);
    vec3 white_scale = vec3(1.0f) / uncharted2_tonemap_partial(W);
    return curr * white_scale;
}

vec3 aces_approx(vec3 v)
{
    v *= 0.6f;
    float a = 2.51f;
    float b = 0.03f;
    float c = 2.43f;
    float d = 0.59f;
    float e = 0.14f;
    return clamp((v*(a*v+b))/(v*(c*v+d)+e), 0.0f, 1.0f);
}

void main()



{
	
	vec2 p = vUV.xy;
	// p.x *= uAspectRatio;

	vec4 uColor = texture(sTD2DInputs[2], p);



	// vec3 splat = exp(-dot(vUV.xy,vUV.xy)/pow(texture(sTD2DInputs[1], vUV.xy).x*uRadius, 1)) * uColor.rgb;

	vec3 splat = texture(sTD2DInputs[1], vUV.xy).xyz * uColor.rgb;

	splat *= uFlow;

	splat = smoothstep(0,1,splat);
	
	vec3 base = texture(sTD2DInputs[0], vUV.xy).xyz;

	vec4 color = vec4(base+splat,1);


	// color.a*=uColor.a;

	// color.xyz = aces_approx(color.xyz);
	fragColor = TDOutputSwizzle(color);
}
