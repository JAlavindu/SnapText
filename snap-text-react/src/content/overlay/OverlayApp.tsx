
import Cropper from "./Cropper";
import { runOCR } from "../../shared/ocr";
import { useState } from "react";

type Props = {
  imageUrl: string;
  onClose: () => void;
};

export default function OverlayApp({ imageUrl, onClose }: Props) {
  const [cropped, setCropped] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function extract() {
    if (!cropped) return;
    setLoading(true);
    const result = await runOCR(cropped);
    setText(result);
    setLoading(false);
  }

  return (
    <div className="overlay">
      <button className="close" onClick={onClose}>✕</button>

      {!cropped && (
        <Cropper imageUrl={imageUrl} onCrop={setCropped} />
      )}

      {cropped && (
        <>
          <button onClick={extract}>Extract Text</button>
          {loading ? <p>Processing...</p> : <pre>{text}</pre>}
        </>
      )}
    </div>
  );
}
