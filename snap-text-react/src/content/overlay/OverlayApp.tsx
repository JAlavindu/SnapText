
import { runOCR } from "../../shared/ocr";
import Cropper from "./Cropper";
import { useState, useEffect } from "react";

type Props = {
  imageUrl: string;
  onClose: () => void;
};

export default function OverlayApp({ imageUrl, onClose }: Props) {
  const [cropped, setCropped] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy");

  async function extract(image: string) {
    setLoading(true);
    try {
      const result = await runOCR(image);
      setText(result);
    } catch (e) {
      console.error(e);
      setText("Error extracting text.");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!cropped) return;
    const timer = window.setTimeout(() => {
      extract(cropped);
    }, 0);
    return () => clearTimeout(timer);
  }, [cropped]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  }

  return (
    <div className="overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 999999, padding: '20px', color: 'white', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 10, flexShrink: 0}}>
        <h3 style={{margin: 0}}>SnapText</h3>
        <button className="close" onClick={onClose} style={{background: 'none', border:'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem'}}>✕</button>
      </div>

      {!cropped ? (
        <Cropper imageUrl={imageUrl} onCrop={setCropped} />
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', height: '100%'}}>
           <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
             <img src={cropped} alt="Cropped" style={{ maxHeight: '80px', border: '1px solid #ccc' }} />
             <button onClick={() => { setCropped(null); setText(""); }}>
               Recrop
             </button>
           </div>

           {loading ? (
             <div>Processing Text...</div>
           ) : (
             <>
               <textarea 
                  value={text} 
                  readOnly 
                  style={{width: '100%', flex: 1, minHeight: '150px', background: '#333', color: '#fff', border: '1px solid #555', padding: '10px'}}
               />
               <button onClick={handleCopy} style={{padding: '10px', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer'}}>
                 {copyStatus}
               </button>
             </>
           )}
        </div>
      )}
    </div>
  );
}
