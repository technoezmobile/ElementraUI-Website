import React, { useEffect, useRef } from "react"

const vertexShader = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragmentShader = `
  precision highp float;
  uniform vec2 u_resolution;
  uniform float u_time;

  // Simple pseudo-random hash
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // 2D noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 p = uv * 3.0 - vec2(1.5);
    p.x *= u_resolution.x / u_resolution.y;

    float t = u_time * 0.4;
    float n1 = noise(p * 2.0 + vec2(t * 0.2, t * 0.3));
    float n2 = noise(p * 4.0 - vec2(t * 0.1, n1 * 1.5));
    
    // Wave patterns
    float lines = sin(p.y * 12.0 + n2 * 4.0 + t);
    lines = smoothstep(0.2, 0.8, abs(lines));

    // Dynamic Color gradient
    vec3 col1 = vec3(0.08, 0.05, 0.22); // Deep dark blue-violet
    vec3 col2 = vec3(0.2, 0.85, 0.95);  // Electric cyan
    vec3 col3 = vec3(0.95, 0.25, 0.65); // Neon magenta

    vec3 finalColor = mix(col1, col2, lines * n1);
    finalColor = mix(finalColor, col3, n2 * 0.4);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export const AuroraShader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return

    // Compile Shader helper
    const compile = (src: string, type: number) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }

    const vs = compile(vertexShader, gl.VERTEX_SHADER)
    const fs = compile(fragmentShader, gl.FRAGMENT_SHADER)
    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    gl.useProgram(program)

    // Screen quad vertices
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    const posAttr = gl.getAttribLocation(program, "position")
    gl.enableVertexAttribArray(posAttr)
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0)

    const resUni = gl.getUniformLocation(program, "u_resolution")
    const timeUni = gl.getUniformLocation(program, "u_time")

    let animId: number
    const start = performance.now()

    const render = () => {
      const width = (canvas.width = canvas.clientWidth)
      const height = (canvas.height = canvas.clientHeight)
      gl.viewport(0, 0, width, height)

      gl.uniform2f(resUni, width, height)
      gl.uniform1f(timeUni, (performance.now() - start) * 0.001)

      gl.drawArrays(gl.TRIANGLES, 0, 6)
      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.deleteBuffer(buffer)
    }
  }, [])

  return (
    <div className="relative w-full h-[320px] rounded-xl overflow-hidden shadow-2xl border border-slate-800">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
        <div>
          <span className="text-xs uppercase font-mono tracking-widest text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
            WebGL Fragment Shader
          </span>
          <h3 className="text-lg font-bold text-white mt-1">Real-time Aurora Waves</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">60 FPS GLSL</span>
      </div>
    </div>
  )
}
