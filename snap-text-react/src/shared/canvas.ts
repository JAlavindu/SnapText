

export default function cropImage(
  img: HTMLImageElement, 
  crop: { x: number; y: number; width: number; height: number }
) {
  const canvas = document.createElement("canvas");
  // Set canvas size to the crop size
  canvas.width = crop.width;
  canvas.height = crop.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  ctx.drawImage(
    img, 
    crop.x, crop.y, crop.width, crop.height, // Source
    0, 0, crop.width, crop.height            // Destination
  );

  return canvas.toDataURL("image/png");
}
