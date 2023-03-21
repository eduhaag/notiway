export function converteBase64ToDataImage(base64: string) {
  if (base64 && !base64.includes('data:image/png;base64,')) {
    return 'data:image/png;base64,' + base64
  }

  return base64
}
