// slippage/terrain flux computation step : terrain map + max slippage map -----> terrain/slippage flux map


// uniform sampler2D sTD2DInputs[0];//terrain map; ater and height map R: height map, G: water map, B: , A:
// uniform sampler2D sTD2DInputs[1]; max slippage map

uniform float u_SimRes;
uniform float u_PipeLen;
uniform float u_timestep;
uniform float u_PipeArea;


uniform float unif_thermalRate;


layout (location = 0) out vec4 writeFlux;

in vec2 fs_Pos;

void main() {

  vec2 curuv = vUV.st;
  float div = 1.0 / u_SimRes;
  float thermalRate = unif_thermalRate;
  float hardness = 1.0;



  vec4 terraintop = texture(sTD2DInputs[0],curuv+vec2(0.f,div));
  vec4 terrainright = texture(sTD2DInputs[0],curuv+vec2(div,0.f));
  vec4 terrainbottom = texture(sTD2DInputs[0],curuv+vec2(0.f,-div));
  vec4 terrainleft = texture(sTD2DInputs[0],curuv+vec2(-div,0.f));
  vec4 terraincur = texture(sTD2DInputs[0],curuv);

  float slippagetop = texture(sTD2DInputs[1],curuv+vec2(0.f,div)).x;
  float slippageright = texture(sTD2DInputs[1],curuv+vec2(div,0.f)).x;
  float slippagebottom = texture(sTD2DInputs[1],curuv+vec2(0.f,-div)).x;
  float slippageleft = texture(sTD2DInputs[1],curuv+vec2(-div,0.f)).x;
  float slippagecur = texture(sTD2DInputs[1],curuv).x;

  vec4 diff;
  diff.x = terraincur.x - terraintop.x - (slippagecur + slippagetop) * 0.5;
  diff.y = terraincur.x - terrainright.x - (slippagecur + slippageright) * 0.5;
  diff.z = terraincur.x - terrainbottom.x - (slippagecur + slippagebottom) * 0.5;
  diff.w = terraincur.x - terrainleft.x - (slippagecur + slippageleft) * 0.5;

  diff = max(vec4(0.0), diff);

  vec4 newFlow = diff * 1.2;

  float outfactor = (newFlow.x + newFlow.y + newFlow.z + newFlow.w)*u_timestep;

  if(outfactor>1e-5){
    outfactor = terraincur.x / outfactor;
    if(outfactor > 1.0) outfactor = 1.0;
    newFlow = newFlow * outfactor;
  }


  vec4 outputflux = newFlow;
  writeFlux = outputflux;

}
