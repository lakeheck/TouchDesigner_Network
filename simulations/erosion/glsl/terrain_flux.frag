
//take in height map and flux (via feedback), calculate output flux of terrain 

// uniform sampler2D read_Terrain = sTD2DInputs[0] ;//water and height map R: hight map, G: water map, B: , A:
// uniform sampler2D read_Flux = sTD2DInputs[1]

uniform float u_SimRes;
uniform float u_PipeLen;
uniform float u_timestep;
uniform float u_PipeArea;

layout (location = 0) out vec4 writeFlux;



void main() {





  vec2 curuv = vUV.st;
  float div = 1.f/u_SimRes;
  float g = 0.80;
  float pipelen = u_PipeLen;

  float sediImpact = 1.0;

  vec4 top = texture(sTD2DInputs[0],curuv+vec2(0.f,div));
  vec4 right = texture(sTD2DInputs[0],curuv+vec2(div,0.f));
  vec4 bottom = texture(sTD2DInputs[0],curuv+vec2(0.f,-div));
  vec4 left = texture(sTD2DInputs[0],curuv+vec2(-div,0.f));



  float damping = 1.0;
  vec4 curTerrain = texture(sTD2DInputs[0],curuv);
  vec4 curFlux = texture(sTD2DInputs[1],curuv) * damping;

  float Htopout = (curTerrain.y+curTerrain.x )-(top.y+top.x );
  float Hrightout = (curTerrain.y+curTerrain.x)-(right.y+right.x);
  float Hbottomout = (curTerrain.y+curTerrain.x)-(bottom.x+bottom.y);
  float Hleftout = (curTerrain.y+curTerrain.x)-(left.y+left.x);

  float ftopout = max(0.,curFlux.x+(u_timestep*g*u_PipeArea*Htopout)/pipelen);
  float frightout = max(0.f,curFlux.y+(u_timestep*g*u_PipeArea*Hrightout)/pipelen);
  float fbottomout = max(0.f,curFlux.z+(u_timestep*g*u_PipeArea*Hbottomout)/pipelen);
  float fleftout = max(0.f,curFlux.w+(u_timestep*g*u_PipeArea*Hleftout)/pipelen);

  float waterOut = u_timestep*(ftopout+frightout+fbottomout+fleftout);
  //damping = 1.0;
  float k = min(1.f,((curTerrain.y )*u_PipeLen*u_PipeLen)/waterOut) ;

  //k = 1.0;
  //rescale outflow sTD2DInputs[1] so that outflow don't exceed current water volume
  ftopout *= k;
  frightout *= k;
  fbottomout *= k;
  fleftout *= k;

  //boundary conditions
  if(curuv.x<=div) fleftout = 0.f;
  if(curuv.x>=1.f - 2.0 * div) frightout = 0.f;
  if(curuv.y<=div) ftopout = 0.f;
  if(curuv.y>=1.f - 2.0 * div) fbottomout = 0.f;

  if(curuv.x<=div || (curuv.x>=1.f - 2.0 * div) ||(curuv.y<=div) ||(curuv.y>=1.f - 2.0 * div) ){
    ftopout = 0.0;
    frightout = 0.0;
    fbottomout = 0.0;
    fleftout = 0.0;
  }

  writeFlux = vec4(ftopout,frightout,fbottomout,fleftout);


}
