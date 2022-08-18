// #extension GL_EXT_gpu_shader4 : enable
//# define NUM_ATTR 20

// uniforms
uniform vec3 uLimitPos;
uniform vec3 uLimitNeg;
uniform vec4 uExternalForce;
uniform float uExternalVariance;
uniform vec4 uWind;
uniform float uWindVariance;
uniform float uLife;
uniform float uLifeVariance;
uniform float uFPS;
uniform float uDragM;
uniform float uMass;
uniform vec4 uTurbulence;
uniform float uTurbJitterM;
uniform vec4 uRotationM;
uniform vec4 uRotationInit;
uniform int uHit;
uniform vec4 uMapSize;

//flocking uniforms
uniform float closest_allowed_dist;// = .02;
uniform vec4 rules;
uniform float speed_limit;
uniform float speed_var;
uniform vec3 goal;// = vec3(0.0);
// uniform float timestep = 0.4;
uniform float flock_dist;
uniform vec4 attractors[NUM_ATTR];
uniform float attractor_dist;

layout(location = 0) out vec4 oPosAndLife;
layout(location = 1) out vec4 oVelocity;
layout(location = 2) out vec4 oRotation;
layout(location = 3) out vec4 oLife;
layout(location = 4) out vec4 test;

// 2D Input textures are:
#define POS_LIFE 0
#define VELOCITY 1
#define POS_NOISE 2
#define ROTATION 3
#define ROTATIONINIT 4
#define VARIANCE 5
#define SOURCE 6
#define LIFE 7
#define ALIFE 8

// 3D Input textures are:
#define TURBULENCE 9

float reMap(in float value, in float low1, in float high1, in float low2, in float high2){
	return float(low2 + (value - low1) * (high2 - low2) / (high1 - low1));
}

// new particle is born
void birthParticle(in vec4 noiseVals, in vec4 variance, out vec4 posLife, out vec4 life, out vec4 velocity, inout vec4 rotation, in vec4 uRotationInit)
{
	vec4 sourcePos = texture(sTD2DInputs[SOURCE], vec2(noiseVals.x,0.25));
	vec4 sourceVelocity = texture(sTD2DInputs[SOURCE], vec2(noiseVals.x,0.75));
	// calculate life and variance
	life.rg = vec2(uLife + variance.b*uLifeVariance);
	life.b = 1.0;
	posLife.xyz = sourcePos.xyz;
	posLife.w = 1.0;
	velocity = vec4(vec3(sourceVelocity*0.01),0.0);
	rotation = texture(sTD2DInputs[ROTATIONINIT], vUV.st) * uRotationInit * 360.0;
}

// apply external forces such as gravity
vec3 externalForce(in vec4 variance)
{

	///id def here
	#if EXT_FORCE_MAP == 0
	vec3 force = (uExternalForce.xyz + (abs(variance.r) * uExternalVariance) * sign(uExternalForce.xyz)) * uExternalForce.w/100.0;
	#else
	vec4 force = texture(sTD2DInputs[10], vUV.st);
	force.xyz = (force.xyz + abs(variance.r) * uExternalVariance * sign(force.xyz)) * force.w/100.0;
	#endif
	return force.xyz / uFPS;
}

// apply wind force
vec3 windForce(in vec4 variance, in vec4 velocity)
{
	vec3 force = (uWind.xyz + (abs(variance.g) * uWindVariance) * sign(uWind.xyz)) * uWind.w/100.0;
	bvec3 windLimit = lessThan(abs(velocity.xyz),abs(force));
	return force/uFPS * vec3(float(windLimit.x),float(windLimit.y),float(windLimit.z));
}

// apply turbulence
vec3 turbulence(in vec3 posMoveUV, in vec4 noiseValsNorm)
{
	vec3 turb = texture(sTD2DInputs[TURBULENCE], vUV.st).gba;
	turb += noiseValsNorm.xyz * uTurbJitterM;
	return turb.xyz * (uTurbulence.xyz * uTurbulence.w/uFPS);
}

// flocking stuff

// rule1 avoid other boids
vec3 rule1(vec3 my_position, vec3 my_velocity, vec3 their_position, vec3 their_velocity)
{
    vec3 d = my_position - their_position;
    if (dot(d, d) < closest_allowed_dist)
        return d;
    return vec3(0.0);
}
// rule2
vec3 rule2(vec3 my_position, vec3 my_velocity, vec3 their_position, vec3 their_velocity)
{
     vec3 d = their_position - my_position;
     vec3 dv = their_velocity - my_velocity;
     return dv / (dot(d, d) +10.);
}

// apply flocking
vec3 flocking(in vec3 my_position, in vec3 my_velocity)
{
    int i, j;
	float rule1_weight = rules.x; //0.18;
	float rule2_weight = rules.y; //0.05;
	float rule3_weight = rules.z; //0.17;
	float rule4_weight = rules.w; //0.02;
    //vec3 new_pos;
    vec3 new_vel;
    vec3 accelleration = vec3(0.0);
    vec3 flock_center = vec3(0.0);
    vec3 nearest_flock = vec3(0.0);
    float nearest_flock_members = 0;


    vec2 my_coords = vUV.st * uMapSize.zw;
    float my_attr = my_coords.x * my_coords.y;
    my_attr = mod(my_attr, NUM_ATTR);

    for (i = 0; i < uMapSize.z; i++)
    {
        for (j = 0; j < uMapSize.w; j++)
        {
        	vec2 them = vec2( (float(i) * uMapSize.x) + (uMapSize.x/2), float(j) * uMapSize.y + (uMapSize.y/2));
            vec3 their_position = texture(sTD2DInputs[POS_LIFE], them).rgb;
            vec3 their_velocity = texture(sTD2DInputs[VELOCITY], them).rgb;
            flock_center += their_position;
            vec2 their_coords = them * uMapSize.zw;

			float dist = length(their_coords - my_coords);
            float their_attr = their_coords.x * their_coords.y;
            their_attr = mod(their_attr, NUM_ATTR);
            

			#if SEEK_ATTRACTORS == 0
				if(dist < uMapSize.z*uMapSize.w*0.1)
				{
					nearest_flock_members += 1.0;
					nearest_flock += their_position;
				}

			#else
				if(their_attr == my_attr)
				{
					nearest_flock_members += 1.0;
					nearest_flock += their_position;
				}
			#endif

            if (them != vUV.st)
            {
                accelleration += rule1(my_position,
                                       my_velocity,
                                       their_position,
                                       their_velocity) * rule1_weight;
                accelleration += rule2(my_position,
                                       my_velocity,
                                       their_position,
                                       their_velocity) * rule2_weight;
            }
        }
    }
    // travel toward goal
    vec3 goal_center = vec3(0.0);
    goal_center = attractors[int(my_attr)].xyz;

	// goal_center = flock_center;
    if(goal_center != vec3(0.0)){
    	accelleration += normalize(goal_center - my_position) * rule3_weight;
    }
    
    // travel toward center of flock
    nearest_flock /= vec3(nearest_flock_members);
    accelleration += normalize(nearest_flock - my_position) * rule4_weight;
    
    return accelleration;
}

vec3 speedlimit(in vec4 variance, in vec3 velocity)
{
    float my_limit = speed_limit + (variance.g * speed_var);
    if (length(velocity) > my_limit)
        velocity = normalize(velocity) * my_limit;
    return velocity;
}

void main()
{
	vec4 posLife = texture(sTD2DInputs[POS_LIFE], vUV.st);
	vec4 velocity = texture(sTD2DInputs[VELOCITY], vUV.st);
	vec4 rotationInit = texture(sTD2DInputs[ROTATIONINIT], vUV.st);
	vec4 rotation = texture(sTD2DInputs[ROTATION], vUV.st);
	vec4 variance = texture(sTD2DInputs[VARIANCE], vUV.st);
	vec4 life = texture(sTD2DInputs[LIFE], vUV.st);
	float clampVal = uTD2DInfos[SOURCE].res.x;
	vec4 alife = texture(sTD2DInputs[ALIFE], vUV.st);
	vec4 noiseVals = texture(sTD2DInputs[POS_NOISE], vUV.st);
	vec4 noiseValsNorm = noiseVals - 0.5;

	noiseValsNorm *= 2.0;
	vec3 pos = vec3(0.0);
	vec3 force = vec3(0.0);
	
	if (life.g < 0.0 && life.b > 0.0)
	{
		// life.rgb = vec3(0.0);
		birthParticle(noiseVals, variance, posLife, life, velocity, rotation, uRotationInit);
	}


	// decide if we need to birth something
	 //if (alife.b < 0.5){
		// birthParticle(noiseVals, variance, posLife, life, velocity, rotation, uRotationInit);	
	//}
	// simulate
	else 
	{
		vec3 posMoveUV;
		posMoveUV = posLife.xyz / vec3(uLimitPos.x-uLimitNeg.x,uLimitPos.y-uLimitNeg.y,uLimitPos.z-uLimitNeg.z);
		posMoveUV += 1.0;
		posMoveUV *= 0.5;

		posLife.xyz += velocity.xyz;

		// apply external force
		velocity.xyz += externalForce(variance);

		// apply wind
		velocity.xyz += windForce(variance, velocity);
		
		// apply turbulence
		velocity.xyz += turbulence(posMoveUV, noiseValsNorm);

		// apply flocking
		velocity.rgb += flocking(posLife.xyz, velocity.xyz) * vec3(0.02);

		// apply speedlimit
		velocity.rgb = speedlimit(variance, velocity.rgb);

		// apply drag
		velocity *= uDragM;

		// apply rotation
		rotation.rg += (rotationInit.xy*uRotationM.xy) + (uRotationM.xy * velocity.xy);

		// is the point offscreen?
		if (posLife.x > uLimitPos.x || posLife.y > uLimitPos.y || posLife.z > uLimitPos.z || posLife.x < uLimitNeg.x || posLife.y < uLimitNeg.y || posLife.z < uLimitNeg.z)
		{
			if (uHit == 0) 
			{
				// posLife.w = 0.0;
				life.rgb = vec3(0.0);
				birthParticle(noiseVals, variance,  posLife, life, velocity, rotation, uRotationInit);
			}
			else
			{
				velocity *= -1.0;
			}
		}
		life.g -= 1.0/uFPS;
	}
	oPosAndLife = vec4(posLife.xyz,1.0);
	oVelocity = velocity;
	oRotation = rotation;
	oLife = life;
	test = vec4(0.0,0.0,pos.z,0.0);
}
	
