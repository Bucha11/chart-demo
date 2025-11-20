import React, { useRef } from 'react';

interface Props {
  onFileSelected: (file: File) => void;
}

export default function UploadArea({ onFileSelected }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleFile(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      alert('File is larger than 10MB');
      return;
    }
    onFileSelected(file);
  }

  return (
    <div>
      <div
        className="dropzone"
        onDrop={onDrop}
        onDragOver={onDragOver}
        style={{ border: '2px dashed #aaa', padding: 20, textAlign: 'center' }}
      >
        <p>Drag & drop a CSV or JSON file here, or</p>
        <button onClick={() => inputRef.current?.click()}>Choose file</button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,application/json,text/csv"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
    </div>
  );
}
