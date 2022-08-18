//thermal app/y step : terrain/slippage flux map -----> terrain map
//applying the slippage and flux map to terrain map to update it 

// uniform sampler2D sTD2DInputs[0];//water and hight map R: hight map, G: water map, B: , A:
// uniform sampler2D sTD2DInputs[1];

uniform float u_SimRes;
uniform float u_PipeLen;
uniform float u_timestep;
uniform float u_PipeArea;
uniform float unif_thermalErosionScale;

layout (location = 0) out vec4 writeTerrain;

in vec2 fs_Pos;



//
//      x
//  w   c   y
//      z
//


void main() {

  vec2 curuv = vUV.st;
  float div = 1.f/u_SimRes;
  float thermalErosionScale = unif_thermalErosionScale;

  vec4 topflux = texture(sTD2DInputs[0],curuv+vec2(0.f,div));
  vec4 rightflux = texture(sTD2DInputs[0],curuv+vec2(div,0.f));
  vec4 bottomflux = texture(sTD2DInputs[0],curuv+vec2(0.f,-div));
  vec4 leftflux = texture(sTD2DInputs[0],curuv+vec2(-div,0.f));

  vec4 inputflux = vec4(topflux.z,rightflux.w,bottomflux.x,leftflux.y);
  vec4 outputflux = texture(sTD2DInputs[0],curuv);

  float vol = inputflux.x + inputflux.y + inputflux.z + inputflux.w - outputflux.x - outputflux.y - outputflux.z - outputflux.w;

  float tdelta = min(50.0, u_timestep * thermalErosionScale) * vol;

  vec4 curTerrain = texture(sTD2DInputs[1], curuv);

  //writeTerrain = vec4(curTerrain.x ,curTerrain.y,curTerrain.z,curTerrain.w);
  writeTerrain = vec4(curTerrain.x  + tdelta,curTerrain.y,curTerrain.z,curTerrain.w);
}
