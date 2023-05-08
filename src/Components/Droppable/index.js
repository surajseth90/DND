import React, { useEffect } from "react";
import PropTypes from "prop-types";
import "./style.scss";

const DroppableComponent = (props) => {
  const {
    droppableWidget,
    classes,
    dataAttribute,
    dropzoneId,
    children,
    enabledForAllDraggable,
    commonDNDID,
    disabled,
    style,
    onDropEvent,
  } = props;

  useEffect(() => {
    createDroppables(droppableWidget);
  }, []);

  useEffect(() => {
    if (!disabled) {
      $(`#dropzone-${dropzoneId}`).droppable("enable");
    } else {
      $(`#dropzone-${dropzoneId}`).droppable("disable");
    }
  }, [disabled]);

  const createDroppables = (droppableWidget) => {
    $(`#dropzone-${dropzoneId}`).droppable({
      ...droppableWidget,
      drop: function () {
        if (onDropEvent) onDropEvent();
      },
      accept: `${!enabledForAllDraggable ? `.${commonDNDID}` : "*"}`,
    });
  };

  return (
    <div
      key={`key-dropzone-${dropzoneId}`}
      className={`dropzone dropzone-${dropzoneId} ${
        commonDNDID ? commonDNDID : ""
      } ${classes ? classes : ""} ${disabled ? "dropzone-disabled" : ""}`}
      id={`dropzone-${dropzoneId}`}
      data-drop-attribute={dataAttribute}
      style={style}
    >
      {children ? children : null}
    </div>
  );
};

DroppableComponent.defaultProps = {
  disabled: false,
  style: {},
  onDropEvent: () => {},
  enabledForAllDraggable: true,
};

DroppableComponent.propTypes = {
  classes: PropTypes.string,
  dropzoneId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  dataAttribute: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
  droppableWidget: PropTypes.object,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  onDropEvent: PropTypes.func,
  enabledForAllDraggable: PropTypes.bool,
};

export default DroppableComponent;
