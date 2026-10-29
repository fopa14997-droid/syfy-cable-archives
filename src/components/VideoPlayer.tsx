import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  title: string;
  src: string;
  poster?: string;
  onRecord?: () => void;
}

export function VideoPlayer({ title, src, poster, onRecord }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
      setError(null);
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setError('HLS playback failed for this media source.');
        }
      });
      setError(null);
      return;
    }

    setError('This browser does not support HLS streaming.');
  }, [src]);

  return (
    <div className="video-panel">
      <div className="video-player-header">
        <h3>{title}</h3>
        {onRecord && (
          <button type="button" className="primary" onClick={onRecord}>
            Record program
          </button>
        )}
      </div>

      {error ? (
        <div className="message-box warning">{error}</div>
      ) : null}

      <video ref={videoRef} controls playsInline poster={poster} preload="metadata" className="video-element" />
    </div>
  );
}
