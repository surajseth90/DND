import React, { Suspense } from "react";
import ResponsiveWrapper from "./Components/ResponsiveWrapper";
import ScalableWrapper from "./Components/ScalableWrapper";
import { dataDraggable, dataDroppable } from "./data";
const DraggableComponent = React.lazy(() => import("./Components/Draggable"));
const DroppableComponent = React.lazy(() => import("./Components/Droppable"));

function App() {
  return (
    <>
      <ResponsiveWrapper>
        <ScalableWrapper>
          <div className="app">
            {dataDroppable.show ? (
              <Suspense fallback={<div>Loading</div>}>
                {dataDroppable.droppables.map((data, key) => {
                  return (
                    <div key={key}>
                      <DroppableComponent
                        dropzoneId={key}
                        onDropEvent={() => {
                          console.log("on drop log having id : ", key);
                        }}
                        droppableWidget={{
                          tolerance: "pointer",
                        }}
                        disabled={data?.disabled}
                        enabledForAllDraggable={data?.enabledForAllDraggable}
                        commonDNDID={data?.commonDNDID}
                      />
                    </div>
                  );
                })}
                {/* <DroppableComponent /> */}
              </Suspense>
            ) : null}

            {dataDraggable.show ? (
              <Suspense fallback={<div>Loading</div>}>
                {dataDraggable.draggables.map((data, key) => {
                  return (
                    <div key={key}>
                      <DraggableComponent
                        dragID={key}
                        onStartEvent={() => {
                          console.log("onStart", key);
                        }}
                        onDragEvent={() => {
                          console.log("drag", key);
                        }}
                        onStopEvent={() => {
                          console.log("stop", key);
                        }}
                        onRevertEvent={() => {
                          console.log("revert", key);
                        }}
                        draggableWidget={data?.draggableWidget}
                        disabled={data?.disabled}
                        commonDNDID={data?.commonDNDID}
                      />
                    </div>
                  );
                })}
                {/* <DroppableComponent /> */}
              </Suspense>
            ) : null}
          </div>
        </ScalableWrapper>
      </ResponsiveWrapper>
    </>
  );
}

export default App;
