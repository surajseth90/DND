import DraggableComponent from "./Components/Draggable";
import ResponsiveWrapper from "./Components/ResponsiveWrapper";
import ScalableWrapper from "./Components/ScalableWrapper";

function App() {
  return (
    <>
      <ResponsiveWrapper>
        <ScalableWrapper>
          <div className="app">
            <DraggableComponent
              draggableFunctions={{
                containment: ".scalable-wrapper-inner",
                cancel: false,
                helper: "clone",
                start: function () {
                  console.log("start");
                },
                drag: function () {
                  console.log("drag");
                },
                stop: function () {
                  console.log("stop");
                },
                revert: function (dropzone) {
                  if (!dropzone) return !dropzone;
                },
              }}
            />
          </div>
        </ScalableWrapper>
      </ResponsiveWrapper>
    </>
  );
}

export default App;
