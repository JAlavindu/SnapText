/* eslint-disable @typescript-eslint/no-unused-vars */

import { runOCR } from "../../shared/ocr";
import Cropper from "./Cropper";
import { useState, useEffect } from "react";

type Props = {
  imageUrl: string;
  onClose: () => void;
};

export default function OverlayApp({ imageUrl, onClose }: Props) {
  const [ocrData, setOcrData] = useState<string | null>(null);


  async function handleImage() {
    try {
        console.log("Starting OCR...");
        
        // Wait for the promise to resolve
        const text = await runOCR(imageUrl);
        
        // Now 'text' holds the actual string
        console.log("Extracted Text:", text); 
        setOcrData(text);
    } catch (error) {
        console.error("OCR failed:", error);
    }
}

return(
    <>
    <div>
      read data from ocrData state:
      <pre>{ocrData}</pre>
    </div>
    </>
)

}
