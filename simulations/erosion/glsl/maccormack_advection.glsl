//maccormack-frag.glsl
//Lagrangian advection step : velocity map + sediment map -----> sediment map


// uniform sampler2D vel;
// uniform sampler2D sedi;
// uniform sampler2D sediadvecta;
// uniform sampler2D sediadvectb;

uniform float u_SimRes;
uniform float u_timestep;
uniform float unif_advectionSpeedScale;


layout (location = 0) out vec4 writeSediment;




in vec2 fs_Pos;


void main() {
 
    vec2 curuv = vUV.st;
    float div = 1.f/u_SimRes;
    float alpha = 1.0;
    float velscale = 1.0/1.0;

    vec4 curvel = (texture(sTD2DInputs[0],curuv));
    vec4 cursedi = texture(sTD2DInputs[1],curuv);

    vec2 targetPos = curuv * u_SimRes - u_timestep * curvel.xy;

    vec4 st;
    st.xy = floor(targetPos - 0.5) + 0.5;
    st.zw = st.xy + 1.0;

    float nodeVal[4];
    nodeVal[0] = texture(sTD2DInputs[1], st.xy/u_SimRes).x;
    nodeVal[1] = texture(sTD2DInputs[1], st.zy/u_SimRes).x;
    nodeVal[2] = texture(sTD2DInputs[1], st.xw/u_SimRes).x;
    nodeVal[3] = texture(sTD2DInputs[1], st.zw/u_SimRes).x;

    float clampMin = min(min(min(nodeVal[0],nodeVal[1]),nodeVal[2]),nodeVal[3]);
    float clampMax = max(max(max(nodeVal[0],nodeVal[1]),nodeVal[2]),nodeVal[3]);

    float sediment = texture(sTD2DInputs[1],curuv).x;


    float res = texture(sTD2DInputs[2],curuv).x + 0.5 * (sediment - texture(sTD2DInputs[3],curuv).x);

    sediment = max(min(res,clampMax), clampMin);


    writeSediment = vec4(sediment, 0.0, 0.0, 1.0);


}