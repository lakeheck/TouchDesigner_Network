// #version 300 es
// precision highp float;


in vec4 vs_Pos;
out vec2 fs_Pos;

void main() {
  fs_Pos = vs_Pos.xy;
  vec4 pos = vs_Pos;

  gl_Position = pos;
}
