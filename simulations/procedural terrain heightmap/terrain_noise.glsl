

uniform float uOffset;
uniform float uSimplexPeriod;
uniform float uOctaves;
uniform float uLacunarity;
uniform float uGain;
uniform float H;
uniform vec3 uTranslate;
out vec4 fragColor;


uniform vec3 a;
uniform vec3 b;
uniform vec3 c;
uniform vec3 d;

#define TWOPI 6.28318530718


void main()
{
	// vec4 noise = texture(sTD2DInputs[0], vUV.st);
	vec3 point = (vUV.xyz + uTranslate) * uSimplexPeriod;
	float noise = TDSimplexNoise(point);

	float signal = noise;

	signal = abs(signal);
	signal = uOffset - signal;
	signal *= signal; //added for preference

	//initialize
	float result = signal;
	float weight = 1;
	float frequency = 1.0;
	vec4 color = vec4(0);
	//begin accumulating octaves
	for(int i=0; i<uOctaves; i++){
		point.x *= uLacunarity;
		point.y *= uLacunarity;
		point.z *= uLacunarity;

		weight = signal * uGain;
		weight = clamp(weight, 0 , 1);
		signal = TDSimplexNoise(point);
		signal *= (signal < 0) ? -1 : 1;
		signal *= weight;
		result += signal * pow(frequency, -H);
		frequency *= uLacunarity;
	}

	color += mod(result, 0.9)*.051; //tweak for aesthetics 

	color.xyz *= result;
	fragColor = TDOutputSwizzle(color);
	fragColor = TDOutputSwizzle(vec4(result, result, result , 1));
}
