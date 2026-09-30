// WebGL availability probe via a throwaway canvas. Returns false when the
// browser blocks context creation — Brave Shields (fingerprinting: Strict),
// Remote Desktop / VM sessions, blocklisted GPUs, hardware accel disabled.
export function detectWebgl() {
  try {
    const probe = document.createElement('canvas')
    return !!(probe.getContext('webgl2') || probe.getContext('webgl'))
  } catch {
    return false
  }
}
