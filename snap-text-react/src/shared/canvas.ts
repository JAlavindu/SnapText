

export default function cropImage(img: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  const ctx = canvas.getContext("2d");
  ctx?.drawImage(img, 0, 0)


   return canvas.toDataURL("image/png");
}
