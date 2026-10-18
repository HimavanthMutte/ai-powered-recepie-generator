
import "./App.css";

import Header from "./components/Header";

import HorizontalStepper from "./components/HorizontalStepper";

function App() {
  return (
    <>
    <HorizontalStepper currentStep={1} />
    <HorizontalStepper currentStep={2} />
    <Header/>
    </>
  );
}

export default App
