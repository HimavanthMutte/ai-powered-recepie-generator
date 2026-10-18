import React from "react";  

import "./App.css";

import HorizontalStepper from "./components/HorizontalStepper";

function App() {
  return (
    <>
    <HorizontalStepper currentStep={1} />
    <HorizontalStepper currentStep={2} />
    </>
  );
}

export default App
