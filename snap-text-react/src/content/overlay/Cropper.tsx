import { useRef, useState, type MouseEvent } from "react";
import cropImage from "../../shared/canvas";

type Props = {
  imageUrl: string;
  onCrop: (img: string) => void;
};

type Rect = { x: number; y: number; width: number; height: number };

export default function Cropper({ imageUrl, onCrop }: Props) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [selection, setSelection] = useState<Rect | null>(null);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getClientCoordinates = (e: MouseEvent) => {
    // Relative to the viewport/container
    return { x: e.clientX, y: e.clientY };
  };

  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const { x, y } = getClientCoordinates(e);
    setStartPos({ x, y });
    setSelection({ x, y, width: 0, height: 0 });
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !startPos) return;
    e.preventDefault();
    
    const { x: currentX, y: currentY } = getClientCoordinates(e);
    
    const x = Math.min(currentX, startPos.x);
    const y = Math.min(currentY, startPos.y);
    const width = Math.abs(currentX - startPos.x);
    const height = Math.abs(currentY - startPos.y);

    setSelection({ x, y, width, height });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Auto-crop on release if selection is big enough?
    // Or just leave the selection visible and let user click a button?
    // The user requirement "User selects area -> Extract image"
    // Let's do auto-crop on release for speed, or maybe better: show "Confirm" button near selection.
    
    if (selection && selection.width > 10 && selection.height > 10) {
       performCrop(selection);
    } else {
       setSelection(null); // Clear tiny selections
    }
  };

  const performCrop = (rect: Rect) => {
    if (!imgRef.current) return;
    
    const img = imgRef.current;
    
    // Note: getBoundingClientRect() provides the rendered size.
    // imageUrl from captureVisibleTab is usually full resolution (e.g. 2x on retina).
    // We need to map screen coordinates (rect) to image natural coordinates.
    
    // Since our image is displayed fullscreen (object-fit: contain maybe?), 
    // we need to be careful.
    // simpler approach: The image is rendered at 100% width/height of window? 
    // Let's assume the img style below.
    
    const rectRel = img.getBoundingClientRect();
    
    // Ratio between Natural (actual pixels) and Rendered (css pixels)
    const scaleX = img.naturalWidth / rectRel.width;
    const scaleY = img.naturalHeight / rectRel.height;
    
    // The selection {x,y} is relative to viewport (clientX).
    // The image might be centered or offset.
    // RelX = rect.x - imgRect.left
    
    const cropX = (rect.x - rectRel.left) * scaleX;
    const cropY = (rect.y - rectRel.top) * scaleY;
    const cropW = rect.width * scaleX;
    const cropH = rect.height * scaleY;

    if (cropW <= 0 || cropH <= 0) return;

    const dataUrl = cropImage(img, {
        x: cropX,
        y: cropY,
        width: cropW,
        height: cropH
    });
    
    onCrop(dataUrl);
  };

  return (
    <div 
      className="cropper-container" 
      style={{
        position: 'absolute', inset: 0, 
        backgroundColor: 'rgba(0,0,0,0.5)',
        cursor: 'crosshair',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
        {/* We display the screenshot. We should make it fit the screen perfectly if possible, 
            or just contain. 'contain' is safer. */}
      <img 
        ref={imgRef} 
        src={imageUrl} 
        style={{
             maxWidth: '100%', 
             maxHeight: '100%', 
             display: 'block', 
             userSelect: 'none',
             pointerEvents: 'none' // Let clicks pass through to container? No, we need sizing. 
             // actually we want clicks on container, but we need img rect. 
        }} 
        draggable={false}
      />
      
      {selection && (
        <div
          style={{
            position: 'fixed', // Fixed to screen
            left: selection.x,
            top: selection.y,
            width: selection.width,
            height: selection.height,
            border: '2px solid #00ff00',
            backgroundColor: 'rgba(0, 255, 0, 0.1)',
            pointerEvents: 'none', // Allow mouse up to bubble to container
          }}
        />
      )}
    </div>
  );
}
