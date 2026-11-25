// Standalone WebGL renderer for the procedural low-poly key in the final CTA block.
// Replaces the 1.27 MB Three.js bundle while preserving the exact 6-primitive geometry,
// flat shading, camera framing, rotation and physical lighting model.

const VERT_SRC = `
attribute vec3 aPos;
attribute vec3 aNorm;
uniform mat4 uMvp;
uniform mat3 uNormMat;
uniform mat4 uModel;
varying vec3 vNorm;
varying vec3 vWorldPos;
void main() {
  vec4 world = uModel * vec4(aPos, 1.0);
  vWorldPos = world.xyz;
  vNorm = normalize(uNormMat * aNorm);
  gl_Position = uMvp * vec4(aPos, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;
varying vec3 vNorm;
varying vec3 vWorldPos;
uniform vec3 uCamPos;

const float PI = 3.14159265;
const vec3 BASE_COLOR = vec3(0.25818, 0.17465, 0.58408); // #8b74c9 in linear space
const float ROUGHNESS = 0.5;
const float METALNESS = 0.25;
const vec3 HEMI_SKY = vec3(1.25, 1.25, 1.25);             // #ffffff * 1.25
const vec3 HEMI_GROUND = vec3(0.02894, 0.01999, 0.04944); // #2a2238 (linear) * 1.25

vec3 evalDirLight(vec3 N, vec3 V, vec3 L, vec3 lightColor, vec3 diffuseColor, vec3 F0) {
  float dotNL = max(dot(N, L), 0.0);
  if (dotNL <= 0.0) return vec3(0.0);
  float dotNV = max(dot(N, V), 1e-4);
  vec3 H = normalize(L + V);
  float dotNH = max(dot(N, H), 0.0);
  float dotVH = max(dot(V, H), 0.0);

  // GGX microfacet specular (Three.js MeshStandardMaterial physical BRDF)
  float a = ROUGHNESS * ROUGHNESS;
  float a2 = a * a;
  float denom = dotNH * dotNH * (a2 - 1.0) + 1.0;
  float D = a2 / (PI * denom * denom);
  float gv = dotNL * sqrt(a2 + (1.0 - a2) * dotNV * dotNV);
  float gl = dotNV * sqrt(a2 + (1.0 - a2) * dotNL * dotNL);
  float Vis = 0.5 / max(gv + gl, 1e-5);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - dotVH, 5.0);

  vec3 spec = F * (Vis * D);
  vec3 diff = diffuseColor / PI;
  return (diff + spec) * (dotNL * lightColor);
}

vec3 linearToSRGB(vec3 c) {
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}

void main() {
  vec3 N = normalize(vNorm);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(uCamPos - vWorldPos);
  vec3 diffuseColor = BASE_COLOR * (1.0 - METALNESS);
  vec3 F0 = mix(vec3(0.04), BASE_COLOR, METALNESS);

  // HemisphereLight(0xffffff, 0x2a2238, 1.25)
  float hemiW = 0.5 * N.y + 0.5;
  vec3 color = mix(HEMI_GROUND, HEMI_SKY, hemiW) * (diffuseColor / PI);

  // DirectionalLight sun: 0xffffff, intensity 2.2, pos (-4, 6, 8)
  color += evalDirLight(N, V, normalize(vec3(-4.0, 6.0, 8.0)), vec3(2.2), diffuseColor, F0);
  // DirectionalLight rim: 0xc9b8ff (linear 0.5841, 0.4793, 1.0), intensity 1.1, pos (5, -2, -6)
  color += evalDirLight(N, V, normalize(vec3(5.0, -2.0, -6.0)), vec3(0.64249, 0.52725, 1.1), diffuseColor, F0);

  gl_FragColor = vec4(clamp(linearToSRGB(color), 0.0, 1.0), 1.0);
}
`;

function pushTri(out, a, b, c) {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
  const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  let nx = uy * vz - uz * vy;
  let ny = uz * vx - ux * vz;
  let nz = ux * vy - uy * vx;
  const len = Math.hypot(nx, ny, nz) || 1;
  nx /= len; ny /= len; nz /= len;
  out.push(
    a[0], a[1], a[2], nx, ny, nz,
    b[0], b[1], b[2], nx, ny, nz,
    c[0], c[1], c[2], nx, ny, nz,
  );
}

function pushQuad(out, a, b, c, d) {
  pushTri(out, a, b, c);
  pushTri(out, a, c, d);
}

function addTorus(out, radius, tube, radialSeg, tubularSeg, ox) {
  const pt = (i, j) => {
    const u = (i / tubularSeg) * Math.PI * 2;
    const v = (j / radialSeg) * Math.PI * 2;
    const rc = radius + tube * Math.cos(v);
    return [rc * Math.cos(u) + ox, rc * Math.sin(u), tube * Math.sin(v)];
  };
  for (let i = 0; i < tubularSeg; i += 1) {
    for (let j = 0; j < radialSeg; j += 1) {
      pushQuad(out, pt(i, j), pt(i + 1, j), pt(i + 1, j + 1), pt(i, j + 1));
    }
  }
}

// Cylinder rotated by +PI/2 around Z: local (x, y, z) -> (-y + ox, x, z).
function addCylinderX(out, rTop, rBot, height, seg, ox) {
  const half = height / 2;
  const rot = (x, y, z) => [-y + ox, x, z];
  const topCenter = rot(0, half, 0);
  const botCenter = rot(0, -half, 0);
  for (let i = 0; i < seg; i += 1) {
    const a0 = (i / seg) * Math.PI * 2;
    const a1 = ((i + 1) / seg) * Math.PI * 2;
    const s0 = Math.sin(a0), c0 = Math.cos(a0);
    const s1 = Math.sin(a1), c1 = Math.cos(a1);
    const t0 = rot(rTop * s0, half, rTop * c0);
    const t1 = rot(rTop * s1, half, rTop * c1);
    const b0 = rot(rBot * s0, -half, rBot * c0);
    const b1 = rot(rBot * s1, -half, rBot * c1);
    pushQuad(out, b0, b1, t1, t0);
    pushTri(out, topCenter, t1, t0);
    pushTri(out, botCenter, b0, b1);
  }
}

function addBox(out, w, h, d, ox, oy, oz) {
  const x0 = ox - w / 2, x1 = ox + w / 2;
  const y0 = oy - h / 2, y1 = oy + h / 2;
  const z0 = oz - d / 2, z1 = oz + d / 2;
  pushQuad(out, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]); // +Z
  pushQuad(out, [x1, y0, z0], [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]); // -Z
  pushQuad(out, [x1, y0, z1], [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]); // +X
  pushQuad(out, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]); // -X
  pushQuad(out, [x0, y1, z1], [x1, y1, z1], [x1, y1, z0], [x0, y1, z0]); // +Y
  pushQuad(out, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]); // -Y
}

function buildKeyMesh() {
  const verts = [];
  addTorus(verts, 1.15, 0.38, 5, 9, -2.6);
  addCylinderX(verts, 0.36, 0.36, 0.34, 6, -1.18);
  addCylinderX(verts, 0.22, 0.22, 4.1, 6, 1.0);
  addBox(verts, 0.42, 0.9, 0.34, 2.45, -0.5, 0);
  addBox(verts, 0.42, 0.62, 0.34, 1.75, -0.36, 0);
  addCylinderX(verts, 0.22, 0.12, 0.3, 6, 3.2);
  return new Float32Array(verts);
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`WebGL shader error: ${info}`);
  }
  return shader;
}

function perspective(fovDeg, aspect, near, far) {
  const f = 1 / Math.tan((fovDeg * Math.PI) / 360);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function multiply4(a, b) {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col += 1) {
    const b0 = b[col * 4], b1 = b[col * 4 + 1], b2 = b[col * 4 + 2], b3 = b[col * 4 + 3];
    for (let row = 0; row < 4; row += 1) {
      out[col * 4 + row] = a[row] * b0 + a[row + 4] * b1 + a[row + 8] * b2 + a[row + 12] * b3;
    }
  }
  return out;
}

// Column-major model matrix: T(0, 0.15, 0) * Ry(rotY) * Rz(0.42)
function keyModelMatrices(rotY) {
  const cy = Math.cos(rotY), sy = Math.sin(rotY);
  const cz = Math.cos(0.42), sz = Math.sin(0.42);
  const m00 = cy * cz, m01 = -cy * sz, m02 = sy;
  const m10 = sz,      m11 = cz,       m12 = 0;
  const m20 = -sy * cz, m21 = sy * sz, m22 = cy;
  const model = new Float32Array([
    m00, m10, m20, 0,
    m01, m11, m21, 0,
    m02, m12, m22, 0,
    0, 0.15, 0, 1,
  ]);
  const norm = new Float32Array([
    m00, m10, m20,
    m01, m11, m21,
    m02, m12, m22,
  ]);
  return { model, norm };
}

export function mountKey(keyStage) {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2", { antialias: true, alpha: true, powerPreference: "low-power" })
    || canvas.getContext("webgl", { antialias: true, alpha: true, powerPreference: "low-power" });
  if (!gl) throw new Error("WebGL context unavailable");

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(`WebGL link error: ${gl.getProgramInfoLog(program)}`);
  }
  gl.useProgram(program);

  const data = buildKeyMesh();
  const vertexCount = data.length / 6;
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(program, "aPos");
  const aNorm = gl.getAttribLocation(program, "aNorm");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(aNorm);
  gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 24, 12);

  const uMvp = gl.getUniformLocation(program, "uMvp");
  const uModel = gl.getUniformLocation(program, "uModel");
  const uNormMat = gl.getUniformLocation(program, "uNormMat");
  const uCamPos = gl.getUniformLocation(program, "uCamPos");
  gl.uniform3f(uCamPos, 0, 0.4, 13);

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.clearColor(0, 0, 0, 0);

  // View matrix for camera at (0, 0.4, 13) looking along -Z.
  const view = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, -0.4, -13, 1,
  ]);
  let vp = multiply4(perspective(32, 1, 0.1, 100), view);
  let rotY = -0.55;

  const draw = () => {
    const { model, norm } = keyModelMatrices(rotY);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniformMatrix4fv(uModel, false, model);
    gl.uniformMatrix3fv(uNormMat, false, norm);
    gl.uniformMatrix4fv(uMvp, false, multiply4(vp, model));
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
  };

  keyStage.appendChild(canvas);
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = keyStage.clientWidth || 300;
    const h = keyStage.clientHeight || 300;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    vp = multiply4(perspective(32, w / h, 0.1, 100), view);
    draw();
  };
  new ResizeObserver(resize).observe(keyStage);
  resize();

  let raf = 0;
  const frame = () => {
    rotY += 0.0065;
    draw();
    raf = requestAnimationFrame(frame);
  };
  return {
    start() { cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); },
    stop() { cancelAnimationFrame(raf); },
  };
}
