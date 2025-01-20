import "./App.css";
import networkStore from "./state/store";

function App() {
  const { dataChannels, peerConnections } = networkStore();

  const check = () => {
    if ("DeviceOrientationEvent" in window) {
      alert("hurray");
    }
  };
  return (
    <>
      <button onClick={check}>start</button>
    </>
  );
}

export default App;
