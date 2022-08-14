//Water volume change and velocity field update
//height map + flux map -----> velocity map + height map

//read_Flux flux map R: top, G: right, B: bottom, A: left
//read_Terrain water and hight map R: height map, G: water map
//read_Vel velocity map 

uniform float u_SimRes;
uniform float u_PipeLen;
uniform float u_timestep;
uniform float u_PipeArea;
uniform float u_VelMult;
uniform float u_Time;
uniform float u_VelAdvMag;

layout (location = 0) out vec4 writeTerrain;
layout (location = 1) out vec4 writeVel;

#define useMullerPath false

in vec2 fs_Pos;
#define PI 3.1415926
#define SQRT2 1.414

float random (in vec2 st) {
  return fract(sin(dot(st.xy,
  vec2(12.9898,78.233)))*
  43758.5453123);
}

void main(){

  vec2 curuv = vUV.st;
  float div = 1.f/u_SimRes;
  float pipelen = u_PipeLen;
  float sediImpact = 1.0;
  float g = 0.80;


  vec4 curflux = texture(sTD2DInputs[1], curuv);
  vec4 cur = texture(sTD2DInputs[0], curuv);
  vec4 curvel = texture(sTD2DInputs[2], curuv);


  vec4 topflux = texture(sTD2DInputs[1], curuv+vec2(0.f, div));
  vec4 rightflux = texture(sTD2DInputs[1], curuv+vec2(div, 0.f));
  vec4 bottomflux = texture(sTD2DInputs[1], curuv+vec2(0.f, -div));
  vec4 leftflux = texture(sTD2DInputs[1], curuv+vec2(-div, 0.f));



  //out flow flux
  float ftopout = curflux.x;
  float frightout = curflux.y;
  float fbottomout = curflux.z;
  float fleftout = curflux.w;

  vec4 outputflux = curflux;
  vec4 inputflux = vec4(topflux.z, rightflux.w, bottomflux.x, leftflux.y);

  float fout = ftopout+frightout+fbottomout+fleftout;
  float fin = topflux.z+rightflux.w+bottomflux.x+leftflux.y;


  float deltavol = u_timestep*(fin-fout)/(u_PipeLen*u_PipeLen);


  float d1 = cur.y;
  float d2 = max(d1 + deltavol, 0.0);
  float da = (d1 + d2)/2.0f;
  vec2 veloci = vec2(leftflux.y-outputflux.w+outputflux.y-rightflux.w, bottomflux.x-outputflux.z+outputflux.x-topflux.z)/2.0;
  if (cur.y == 0.0 && deltavol == 0.0) veloci = vec2(0.0, 0.0);


  if (da <= 0.0001) {
    veloci = vec2(0.0);
  } else {
    veloci = veloci/(da * u_PipeLen);
  }


  //veclocity advection
    vec4 useVel = curvel/u_SimRes;
    useVel *= 0.5;


    vec2 oldloc = vec2(curuv.x-useVel.x*u_timestep,curuv.y-useVel.y*u_timestep);
    vec2 oldvel = texture(sTD2DInputs[2], oldloc).xy;

    veloci += oldvel * u_VelAdvMag;//(1.0 - exp(- cur.y * 20.0));

  // !!! very important !!! : disregard really small body of water as it will disrupt the sediment advection step (since advection is only dependent on velocity, small water body will
  // be the numerical limitation for the lower threshold of simulation can handle, any value below it will be treated qually regardless of their own differences, and this is really bad
  // , it can make the sediment go entirely randomly and chaoticly when water happen to be very shallow, and I have been quite troubled by this issue for a while)
  //
  if (cur.y < 0.01){
    //veloci *= pow(cur.y/0.01,3.0);
    veloci = vec2(0.0);
  }
  else {
    //veloci *= (1.0 - exp(65.0 * (-cur.y + 0.01)));
  }



//    // muller height field integration
//
//    vec4 curTerrain = texture(sTD2DInputs[0], curuv);
//    vec4 RTerrain = texture(sTD2DInputs[0], curuv + vec2(div, 0.0));
//    vec4 TTerrain = texture(sTD2DInputs[0], curuv + vec2(0.0, div));
//    vec4 BTerrain = texture(sTD2DInputs[0], curuv - vec2(0.0, div));
//    vec4 LTerrain = texture(sTD2DInputs[0], curuv - vec2(div, 0.0));
//
//
//    vec4 leftvel = texture(sTD2DInputs[2], curuv - vec2(div, 0.0));
//    vec4 bottomvel = texture(sTD2DInputs[2], curuv - vec2(0.0, div));
//
//    float deltaH = 0.0;
//
//    float waterHeightRight = 0.0, waterHeightLeft = 0.0;
//    float waterHeightTop = 0.0, waterHeightBottom = 0.0;
//
//    if(curvel.z <= 0.0){
//      deltaH += (RTerrain.y * curvel.z / 1.0);
//    }else{
//      deltaH += curTerrain.y * curvel.z / 1.0;
//    }
//
//    if(curvel.w <= 0.0){
//      deltaH += (TTerrain.y * curvel.w / 1.0);
//    }else{
//      deltaH += curTerrain.y * curvel.w / 1.0;
//    }
//
//    if(leftvel.z <= 0.0){
//      deltaH -= curTerrain.y * leftvel.z/1.0;
//    }else{
//      deltaH -= LTerrain.y * leftvel.z / 1.0;
//    }
//
//    if(bottomvel.w <= 0.0){
//      deltaH -= curTerrain.y * bottomvel.w / 1.0;
//    }else{
//      deltaH -= BTerrain.y * bottomvel.w / 1.0;
//    }
//
//    deltaH = -deltaH * u_timestep * 1.0;
//
//
//   // float hadj = max(0.0, (RTerrain.y + TTerrain.y + BTerrain.y + LTerrain.y)/4.0 - (2.0 * 1.0 / (g * u_timestep)));
//
//    // muller velocity integration
//
//
//    float velr = curvel.z+ (curTerrain.x + curTerrain.y - RTerrain.x - RTerrain.y)*g*u_timestep/1.0;
//    float velt = curvel.w + (curTerrain.x + curTerrain.y - TTerrain.x - TTerrain.y)*g*u_timestep/1.0;
//
//    velr = min(0.50/u_timestep, velr);
//    velt = min(0.50/u_timestep, velt);
//
//
//    float threshold = 0.0001;
//    if(curTerrain.y <= threshold && TTerrain.y <=threshold){
//      velt = 0.0;
//    }if(curTerrain.y <= threshold && RTerrain.y <=threshold){
//      velr = 0.0;
//    }


  //writeVel = vec4(veloci * u_VelMult, velr, velt);
  writeVel = vec4(veloci * u_VelMult, curvel.z, curvel.w);
  //writeTerrain = vec4(cur.x, max(0.0, deltaH + curTerrain.y ), 0.0, 1.0);
  writeTerrain = vec4(cur.x, max(cur.y+deltavol, 0.0), 0.0, 1.0);


}