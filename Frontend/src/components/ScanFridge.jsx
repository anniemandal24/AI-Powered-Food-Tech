import "./ScanFridge.css";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ScanFridge() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);

  const navigate = useNavigate();

  // 📷 Open Camera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setCameraOn(true);
    } catch (err) {
      alert("Camera permission denied");
    }
  };

  // 📸 Capture Photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/png");
    setImage(dataUrl);

    stopCamera();
  };

  // ❌ Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCameraOn(false);
  };

  // 📁 Upload from device
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // 🚀 Send to backend
  const sendToBackend = async () => {
    if (!image) {
      alert("Please capture or upload an image first");
      return;
    }

    try {
      const blob = await fetch(image).then((res) => res.blob());

      const formData = new FormData();
      formData.append("file", blob, "fridge.png");

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      alert("Upload successful 🚀");

      // 🔁 Redirect to home page
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <div className="scan-container">
      <div className="hero-bg"></div>
      <div className="hero-grid"></div>

      <div className="scan-card">
        {/* Header */}
        <div className="scan-header">
          <span className="icon">📷</span>
          <div>
            <h2>Scan Your Fridge</h2>
            <p>Use your camera to scan the inside of your fridge.</p>
          </div>
        </div>

        {/* Image Section */}
        <div className="image-box">
          {!cameraOn && !image && (
            <img
              src="https://tse4.mm.bing.net/th/id/OIP.-BjfvPSpaNZE8j_vvq2vAwHaEO"
              alt="Fridge"
            />
          )}

          {cameraOn && (
            <video ref={videoRef} autoPlay className="camera-video" />
          )}

          {image && (
            <img src={image} alt="preview" className="preview-img" />
          )}

          <canvas ref={canvasRef} style={{ display: "none" }} />

          <div className="overlay-text">
            Position your fridge items in view
          </div>

          <div className="frame top-left"></div>
          <div className="frame top-right"></div>
          <div className="frame bottom-left"></div>
          <div className="frame bottom-right"></div>
        </div>

        {/* Buttons */}
        <div className="btn-group">
          {!cameraOn ? (
            <button className="btn primary" onClick={openCamera}>
              📸 Take Photo
            </button>
          ) : (
            <button className="btn primary" onClick={capturePhoto}>
              ✅ Capture
            </button>
          )}

          <button className="btn secondary" onClick={handleUploadClick}>
            ⬆ Upload Photo
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFile}
            hidden
          />

          {/* 🚀 Send */}
          <button className="btn primary" onClick={sendToBackend}>
            🚀 Scan Now
          </button>
        </div>

        <p className="tip">
          💡 Tip: Make sure the fridge light is on for best results
        </p>
      </div>
    </div>
  );
}