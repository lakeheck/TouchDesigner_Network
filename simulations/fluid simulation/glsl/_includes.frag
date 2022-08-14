

vec4 boundary(vec2 pos, float offset, float scale, sampler2D tex, sampler2D obs){
    //input 0: velocity or pressure field 
    //input 1: obstable/boundary field
    vec2 pL = vec2( pos.x - offset * uTD2DInfos[0].res.x, pos.y);
    vec2 pR = vec2( pos.x + offset * uTD2DInfos[0].res.x, pos.y);
    vec2 pT = vec2( pos.x, pos.y + offset * uTD2DInfos[0].res.y);
    vec2 pB = vec2( pos.x, pos.y - offset * uTD2DInfos[0].res.y);

    float L = texture(tex, pL).x;
    float R = texture(tex, pR).x;
    float T = texture(tex, pT).y;
    float B = texture(tex, pB).y;


    float oL = texture(obs, pL).x;
    float oR = texture(obs, pR).x;
    float oT = texture(obs, pT).y;
    float oB = texture(obs, pB).y;

    vec2 C = texture(tex, pos).xy;

    if (pL.x <= 0.0 || oL >= 0.5) {L = scale * C.x;}
    if (pR.x >= 1.0 || oR >= 0.5) {R = scale * C.x;}
    if (pT.y <= 0.0 || oT >= 0.5) {T = scale * C.y;}
    if (pB.y >= 1.0 || oB >= 0.5) {B = scale * C.y;}

    return vec4(L, R, T, B);
    
}


vec2 pL = vec2( vUV.x - 1.0 * uTD2DInfos[0].res.x, vUV.y);
vec2 pR = vec2( vUV.x + 1.0 * uTD2DInfos[0].res.x, vUV.y);
vec2 pT = vec2( vUV.x, vUV.y + 1.0 * uTD2DInfos[0].res.y);
vec2 pB = vec2( vUV.x, vUV.y - 1.0 * uTD2DInfos[0].res.y);