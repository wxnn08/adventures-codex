const MAX_BYTES  = 1.5 * 1024 * 1024 // 1.5 MB raw
const MAX_EDGE   = 2048
const JPEG_Q     = 0.85

/** Seam: can be replaced in tests to stub canvas. */
export let _createCanvas = (w, h) => {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  return c
}

/**
 * Takes a File, returns { dataUrl, mime, bytes } or throws { error: string }.
 * Downscales images with longest edge > MAX_EDGE.
 */
export async function downscaleImage(file) {
  if (file.size > MAX_BYTES) {
    throw { error: `Image is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum is 1.5 MB.` }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject({ error: 'Could not read file.' })
    reader.onload = (ev) => {
      const img = new Image()
      img.onerror = () => reject({ error: 'Could not decode image.' })
      img.onload = () => {
        let { width, height } = img
        const longest = Math.max(width, height)
        if (longest > MAX_EDGE) {
          const scale = MAX_EDGE / longest
          width  = Math.round(width  * scale)
          height = Math.round(height * scale)
        }
        const canvas  = _createCanvas(width, height)
        const ctx     = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const mime    = 'image/jpeg'
        const dataUrl = canvas.toDataURL(mime, JPEG_Q)
        const bytes   = Math.round(dataUrl.length * 0.75) // approx base64 → bytes
        resolve({ dataUrl, mime, bytes })
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}
