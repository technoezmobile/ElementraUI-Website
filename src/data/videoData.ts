import { VideoItem } from "../types/marketplace"

export const verifiedVideoData: VideoItem[] = [
  {
    id: "video-mesh-gradient-loop",
    name: "Fluid Mesh Gradient 60fps Loop",
    slug: "mesh-gradient-loop",
    description: "Continuous procedural color fluid gradient loop with smooth undulating wave harmonics and neon chromatic diffusion.",
    category: "Background Loops",
    motionEngine: "Canvas 60fps",
    aspectRatio: "16:9",
    durationSeconds: 12,
    fps: 60,
    author: { name: "Motion Canvas Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    posterColor: "from-cyan-600 via-indigo-600 to-fuchsia-600",
    tags: ["Fluid", "Gradient", "Mesh", "Loop", "Background", "60fps"],
    provenance: { origin: "Procedural Canvas Motion Registry" },
    animationCode: `// Fluid Mesh Gradient Canvas Loop
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
let t = 0;
function draw() {
  t += 0.015;
  const g = ctx.createRadialGradient(
    canvas.width / 2 + Math.sin(t) * 120,
    canvas.height / 2 + Math.cos(t * 0.8) * 80,
    20,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.7
  );
  g.addColorStop(0, "#06b6d4");
  g.addColorStop(0.5, "#4f46e5");
  g.addColorStop(1, "#05070f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  requestAnimationFrame(draw);
}`,
    remotionSnippet: `import { AbsoluteFill, useCurrentFrame } from "remotion";

export const MeshGradient = () => {
  const frame = useCurrentFrame();
  const x = Math.sin(frame / 30) * 100;
  return (
    <AbsoluteFill style={{
      background: \`radial-gradient(circle at \${50 + x}%, #06b6d4, #4f46e5, #05070f)\`
    }} />
  );
};`
  },
  {
    id: "video-orbital-particle-ring",
    name: "3D Orbital Particle Accretion Ring",
    slug: "orbital-particle-ring",
    description: "Three.js WebGL procedural gravitational particle simulation with 2,000 glowing stars orbiting a central event horizon.",
    category: "Hero Motion",
    motionEngine: "Three.js WebGL",
    aspectRatio: "16:9",
    durationSeconds: 15,
    fps: 60,
    author: { name: "Three.js Motion Lab", url: "https://threejs.org" },
    license: "MIT",
    posterColor: "from-purple-900 via-slate-950 to-cyan-950",
    tags: ["Three.js", "WebGL", "Particles", "Galaxy", "Space", "Loop"],
    provenance: { origin: "Three.js Community Particles" },
    animationCode: `// Orbital Three.js Particle Ring
import * as THREE from 'three';
const scene = new THREE.Scene();
const count = 2000;
const pos = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i += 3) {
  const r = 4 + Math.random() * 6;
  const th = Math.random() * Math.PI * 2;
  pos[i] = Math.cos(th) * r;
  pos[i + 1] = (Math.random() - 0.5) * 0.8;
  pos[i + 2] = Math.sin(th) * r;
}
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
const mat = new THREE.PointsMaterial({ size: 0.05, color: 0x22d3ee });
const points = new THREE.Points(geo, mat);
scene.add(points);`
  },
  {
    id: "video-kinetic-title-reveal",
    name: "Kinetic Mask Typography Reveal",
    slug: "kinetic-title-reveal",
    description: "Sleek typographic header transition featuring dual clip-path masks, character spring physics, and subtle chromatic aberration.",
    category: "Transitions",
    motionEngine: "CSS Animation",
    aspectRatio: "16:9",
    durationSeconds: 4,
    fps: 60,
    author: { name: "Typography Motion Studio", url: "https://github.com/elementraui" },
    license: "MIT",
    posterColor: "from-slate-900 via-slate-950 to-black",
    tags: ["Typography", "Reveal", "Mask", "Text", "Intro", "Kinetic"],
    provenance: { origin: "Studio Kinetic Motion" },
    animationCode: `@keyframes revealClip {
  0% { clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%); transform: translateY(60px); }
  100% { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); transform: translateY(0); }
}
.kinetic-text {
  animation: revealClip 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}`
  },
  {
    id: "video-saas-device-mockup",
    name: "3D Perspective Device Showcase Slide",
    slug: "device-mockup-slide",
    description: "Photorealistic browser viewport perspective tilt with floating tooltips, cursor clicks, and spring-damped landing physics.",
    category: "Device Mockups",
    motionEngine: "CSS Animation",
    aspectRatio: "16:9",
    durationSeconds: 8,
    fps: 60,
    author: { name: "Device Studio UI", url: "https://github.com/elementraui" },
    license: "MIT",
    posterColor: "from-blue-950 via-slate-900 to-indigo-950",
    tags: ["Mockup", "3D", "Tilt", "SaaS", "Browser", "Showcase"],
    provenance: { origin: "Device UI Kit" }
  },
  {
    id: "video-audio-waveform-visualizer",
    name: "Real-time Frequency Spectrum Waveform",
    slug: "audio-waveform-visualizer",
    description: "Multi-band audio visualizer rendering 32 dynamic frequency bars with smooth spring interpolation and peak decay memory.",
    category: "Data & Charts",
    motionEngine: "Canvas 60fps",
    aspectRatio: "16:9",
    durationSeconds: 10,
    fps: 60,
    author: { name: "AudioFX Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    posterColor: "from-emerald-950 via-slate-950 to-teal-950",
    tags: ["Audio", "Waveform", "Spectrum", "Canvas", "Music", "Visualizer"],
    provenance: { origin: "AudioFX Canvas" }
  },
  {
    id: "video-infinite-hyperspace-tunnel",
    name: "Infinite Cyberpunk Hyperspace Tunnel",
    slug: "infinite-hyperspace-tunnel",
    description: "Hypnotic high-speed geometric tunnel warp effect with neon grid lines, distance fog, and infinite camera forward velocity.",
    category: "Background Loops",
    motionEngine: "Three.js WebGL",
    aspectRatio: "16:9",
    durationSeconds: 16,
    fps: 60,
    author: { name: "GLSL Warp Lab", url: "https://github.com/elementraui" },
    license: "MIT",
    posterColor: "from-rose-950 via-slate-950 to-purple-950",
    tags: ["Tunnel", "Warp", "Cyberpunk", "Hyperspace", "Loop", "WebGL"],
    provenance: { origin: "GLSL Shaders Archive" }
  }
]
