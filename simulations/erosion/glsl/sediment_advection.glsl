//Lagrangian advection step : velocity map + sediment map -----> sediment map


// uniform sampler2D vel;
// uniform sampler2D sedi;
// uniform sampler2D sediBlend;
// uniform sampler2D terrain;

uniform float u_SimRes;
uniform float u_timestep;
uniform float unif_advectionSpeedScale;
uniform float unif_advectMultiplier;


layout (location = 0) out vec4 writeSediment;
layout (location = 1) out vec4 writeVel;
layout (location = 2) out vec4 writeSediBlend;



in vec2 fs_Pos;



float samplebilinear(vec2 uv, float sampleKernelSize){
    vec2 cur_loc = sampleKernelSize*uv;
    vec2 uva = floor(cur_loc);
    vec2 uvb = ceil(cur_loc);

    vec2 id00 = uva;
    vec2 id10 = vec2(uvb.x,uva.y);
    vec2 id01 = vec2(uva.x,uvb.y);
    vec2 id11 = uvb;

    vec2 d = cur_loc - uva;

    float res =  (texture(sTD2DInputs[1],id00/sampleKernelSize).x*(1.f-d.x)*(1.f-d.y)+
    texture(sTD2DInputs[1],id10/sampleKernelSize).x*d.x*(1.f-d.y)+
    texture(sTD2DInputs[1],id01/sampleKernelSize).x*(1.f-d.x)*d.y+
    texture(sTD2DInputs[1],id11/sampleKernelSize).x*d.x*d.y);

    return res;
}

 


void main() {
 
    vec2 curuv = vUV.st;
    float div = 1.f/u_SimRes;
    float alpha = 1.0;
    float velscale = 1.0/1.0;

    vec4 curvel = (texture(sTD2DInputs[0],curuv));
    vec4 cursedi = texture(sTD2DInputs[1],curuv);
    vec4 curterrain = texture(sTD2DInputs[3],curuv);



    vec4 useVel = curvel/u_SimRes;
    useVel *= unif_advectMultiplier * 0.5;



    vec2 oldloc = vec2(curuv.x-useVel.x*u_timestep,curuv.y-useVel.y*u_timestep);
    float oldsedi = texture(sTD2DInputs[1], oldloc).x;
    //oldsedi = samplebilinear(oldloc,u_SimRes   );

    float curSediVal = cursedi.x * curterrain.y * 0.1;

    float sediBlendVal = texture(sTD2DInputs[2], curuv).x;


    sediBlendVal = (sediBlendVal*1660.0 + curSediVal) / 1661.0;


    writeSediment =  TDOutputSwizzle( vec4(oldsedi, 0.0, 0.0, 1.0));
    writeVel = TDOutputSwizzle(curvel);
    writeSediBlend = TDOutputSwizzle( vec4(sediBlendVal, 0.0, 0.0, 1.0));
}