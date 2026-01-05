import { useRef } from "react";
import cropImage from "../../shared/canvas";


type props = {
    imageUrl: string;
    onCrop: (img: string) => void;
}

export default function Cropper({ imageUrl, onCrop }: props) {
  const imgRef = useRef<HTMLImageElement>(null);

  function handleCrop(){
    if(!imgRef.current) return;
    const cropped = cropImage(imgRef.current);
    onCrop(cropped);
  }

  return (
    <div>
      <img ref={imgRef} src={imageUrl} />
      <button onClick={handleCrop}>Crop (Demo)</button>
    </div>
  )
}
