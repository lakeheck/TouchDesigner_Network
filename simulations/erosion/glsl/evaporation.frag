//Water evaporation step : terrain map -----> terrain map


uniform float evapod;

layout (location = 0) out vec4 writeTerrain;


in vec2 fs_Pos;


float timestep = 0.0001;


void main() {
      float Ke = 0.4;
      vec2 curuv = vUV.st;
      vec4 cur = texture(sTD2DInputs[0],curuv);
      float eva = 1.f-evapod;
      writeTerrain = vec4(cur.x,cur.y*eva,cur.z,cur.w);
}