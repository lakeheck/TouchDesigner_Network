vec2 pL = vec2( vUV.x - 1.0 * uTD2DInfos[0].res.x, vUV.y);
vec2 pR = vec2( vUV.x + 1.0 * uTD2DInfos[0].res.x, vUV.y);
vec2 pT = vec2( vUV.x, vUV.y + 1.0 * uTD2DInfos[0].res.y);
vec2 pB = vec2( vUV.x, vUV.y - 1.0 * uTD2DInfos[0].res.y);



// vec3 pL = vec3( vUV.x - 1.0 * uTD2DInfos[0].res.x, vUV.y, vUV.z);
// vec3 pR = vec3( vUV.x + 1.0 * uTD2DInfos[0].res.x, vUV.y) vUV.z);
// vec3 pT = vec3( vUV.x, vUV.y + 1.0 * uTD2DInfos[0].res.y, vUV.z);
// vec3 pB = vec3( vUV.x, vUV.y - 1.0 * uTD2DInfos[0].res.y, vUV.z);
// vec3 pFront = vec3(vUV.x,  vUV.y, vUV.z - 1.0 * uTD2DInfos[0].res.y); //potential error in treatment here 
// vec3 pBack = vec3(vUV.x,  vUV.y, vUV.z + 1.0 * uTD2DInfos[0].res.y); //potential error in treatment here 