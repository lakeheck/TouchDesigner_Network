
// Example Pixel Shader

// uniform float exampleUniform;

out vec4 fragColor;

uniform float u_time;
uniform float jitterBrightness;

//hashing functions to generate random noise using bit shifting 
uint hashInt1D( uint x )
{
	x += x >> 11;
	x ^= x << 7;
	x += x >> 15;
	x ^= x << 5;
	x += x >> 12;
	x ^= x << 9;
	return x;
}

uint hashInt2D( uint x, uint y )
{
	x += x >> 11;
	x ^= x << 7;
	x += y;
	x ^= x << 6;
	x += x >> 15;
	x ^= x << 5;
	x += x >> 12;
	x ^= x << 9;
	return x;
}

uint hashInt3D( uint x, uint y, uint z )
{
	x += x >> 11;
	x ^= x << 7;
	x += y;
	x ^= x << 3;
	x += z ^ ( x >> 14 );
	x ^= x << 6;
	x += x >> 15;
	x ^= x << 5;
	x += x >> 12;
	x ^= x << 9;
	return x;

}

//helper functions for casting and overlow definitions for ease of use 

float hash(float x){
	// uvec2 unsign = uvec2(floatBitsToUint(x), floatBitsToUint(y));
	uint r = hashInt1D(floatBitsToUint(x));
	return uintBitsToFloat(r);
}

float hash(float x, float y){
	// uvec2 unsign = uvec2(floatBitsToUint(x), floatBitsToUint(y));
	uint r = hashInt2D(floatBitsToUint(x), floatBitsToUint(y));
	return uintBitsToFloat(r);
	
}

float hash(vec2 v){
	uint r = hashInt2D(floatBitsToUint(v.x), floatBitsToUint(v.y));
	return uintBitsToFloat(r);
}

float hash(float x, float y, float z){
	// uvec2 unsign = uvec2(floatBitsToUint(x), floatBitsToUint(y));
	uint r = hashInt3D(floatBitsToUint(x), floatBitsToUint(y), floatBitsToUint(z));
	return uintBitsToFloat(r);
	
}

float hash(vec3 v){
	// uvec2 unsign = uvec2(floatBitsToUint(x), floatBitsToUint(y));
	uint r = hashInt3D(floatBitsToUint(v.x), floatBitsToUint(v.y), floatBitsToUint(v.z));
	return uintBitsToFloat(r);
	
}


void main()
{
	vec4 input = texture(sTD2DInputs[0], vUV.st);

	float noise = texture(sTD2DInputs[1], vUV.st).r;

	vec3 hsb = TDRGBToHSV(input.xyz);

	float r = clamp(hash(gl_FragCoord.xyz),0,1);

    hsb.z += r*jitterBrightness/100.0*noise; 

    vec3 rgb = TDHSVToRGB(hsb);

    float a = 1.0; 

    vec4 color = vec4(rgb, a);
 	fragColor = TDOutputSwizzle(color);

}
