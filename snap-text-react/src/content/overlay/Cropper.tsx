type props = {
    imageUrl: string;
    onCrop: (img: string) => void;
}

import React from 'react'

export default function Cropper({ imageUrl, onCrop }: props) {
  return (
    <div>Cropper</div>
  )
}
