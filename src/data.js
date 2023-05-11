export const dataDraggable = {
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

export const dataDroppable = {
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
