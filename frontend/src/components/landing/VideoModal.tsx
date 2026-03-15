"use client";
import { PiX } from "react-icons/pi";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer",
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        position: "relative",
        width: "80%", maxWidth: 900,
        aspectRatio: "16/9",
        background: "#000",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Close button */}
        <button onClick={onClose} style={{
          position: "absolute", top: -40, right: 0,
          background: "none", border: "none",
          color: "#fff", fontSize: "2rem", cursor: "pointer",
          fontWeight: 300, lineHeight: 1,
        }}><PiX /></button>
        <video
          src="/videos/intro.mp4"
          controls autoPlay
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
