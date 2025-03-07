import { useEffect, useRef } from 'react';

const WebCam = () => {
  const camElement = useRef<HTMLVideoElement | null>(null);

  const streamWebCam = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (camElement.current) {
      camElement.current.srcObject = stream;
      await camElement.current.play();
    }
  };

  useEffect(() => {
    streamWebCam();
  }, []);

  return (
    <video
      ref={camElement}
      className='h-screen draggable object-cover rounded-full aspect-video border-2 relative border-white'
    ></video>
  );
};

export default WebCam;
