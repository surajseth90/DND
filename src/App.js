import React, { Suspense } from "react";
import ResponsiveWrapper from "./Components/ResponsiveWrapper";
import ScalableWrapper from "./Components/ScalableWrapper";
const DraggableComponent = React.lazy(() => import("./Components/Draggable"));
const DroppableComponent = React.lazy(() => import("./Components/Droppable"));

function App() {
  const dataDraggable = {
    id: 1,
    name: "draggable",
    show: true,
    draggables: [
      {
        draggableWidget: {
          containment: ".c9-stage-container",
          cancel: false,
          helper: "clone",
        },
        commonDNDID: "dnd_1",
        disabled: false,
      },
      {
        draggableWidget: {
          containment: ".c9-stage-container",
          cancel: false,
          helper: "clone",
        },
        disabled: false,
      },
      {
        draggableWidget: {
          containment: ".c9-stage-container",
          cancel: false,
          helper: "clone",
        },
        disabled: false,
      },
      {
        draggableWidget: {
          containment: ".c9-stage-container",
          cancel: false,
          helper: "clone",
        },
        disabled: true,
      },
    ],
  };

  const dataDroppable = {
    id: 1,
    name: "droppable",
    show: true,
    droppables: [
      {
        droppableWidget: {
          tolerance: "pointer",
        },
        commonDNDID: "dnd_1",
        enabledForAllDraggable: false,
        disabled: false,
      },
      {
        droppableWidget: {
          tolerance: "pointer",
        },
        commonDNDID: "dnd_2",
        enabledForAllDraggable: false,
        disabled: false,
      },
      {
        droppableWidget: {
          tolerance: "pointer",
        },
        disabled: false,
      },
      {
        droppableWidget: {
          tolerance: "pointer",
        },
        disabled: true,
      },
    ],
  };
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
