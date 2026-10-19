import esbuild from "esbuild"
import fs from "node:fs"
import path from "node:path"

const entryContent = `
import React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as FramerMotion from 'framer-motion';
import * as LucideReact from 'lucide-react';
import * as THREE from 'three';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

if (typeof window !== 'undefined') {
  window.__21ST_MODULES__ = {
    'react': React,
    'react/jsx-runtime': { jsx: React.createElement, jsxs: React.createElement, Fragment: React.Fragment },
    'react-dom': ReactDOM,
    'react-dom/client': ReactDOM,
    'framer-motion': FramerMotion,
    'lucide-react': LucideReact,
    'three': THREE,
    'clsx': clsx,
    'tailwind-merge': { twMerge, default: twMerge }
  };

  window.React = React;
  window.ReactDOM = ReactDOM;
  window.THREE = THREE;
  window.FramerMotion = FramerMotion;
  window.LucideReact = LucideReact;
}
`;

const tempEntry = path.resolve("scripts/.temp-runtime-entry.js");
const outBundle = path.resolve("public/vendor/isolated-react-runtime.js");

fs.writeFileSync(tempEntry, entryContent, "utf8");

try {
  esbuild.buildSync({
    entryPoints: [tempEntry],
    bundle: true,
    outfile: outBundle,
    minify: true,
    format: "iife",
    define: {
      "process.env.NODE_ENV": '"production"'
    }
  });

  const stats = fs.statSync(outBundle);
  console.log(`Successfully built isolated-react-runtime.js (${Math.round(stats.size / 1024)} kB)`);
} finally {
  if (fs.existsSync(tempEntry)) {
    fs.unlinkSync(tempEntry);
  }
}
