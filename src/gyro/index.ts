import { useEffect, useState } from "react";

export const useGyro = () => {
  const [gyroscopeData, setGyroscopeData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
        alert("wow")
      setGyroscopeData({
        x: event.alpha || 0,
        y: event.beta || 0,
        z: event.gamma || 0,
      });
    };

    // Attach the event listener
    window.addEventListener("deviceorientation", handleDeviceOrientation);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("deviceorientation", handleDeviceOrientation);
    };
  }, []);

  return { gyroscopeData };
};
