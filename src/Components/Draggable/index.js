import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isIOS } from "react-device-detect";
import AccessibleDnDList from "../AccessibleList";
import "./style.scss";

const DraggableComponent = (props) => {
  const {
    label,
    classes,
    dataAttribute,
    disabled,
    onDraggableClick,
    accessibleList,
    accessibleListDropClickHandler,
    onFocus,
    onBlur,
    draggableWidget,
    isAriaHidden,
    children,
    dragID,
    commonDNDID,
    style,

    ///functions----------
    onStartEvent,
    onDragEvent,
    onStopEvent,
    onRevertEvent,
  } = props;

  const [isAccessibleListOpen, setIsAccessibleListOpen] = useState(false);

  useEffect(() => {
    createDraggables(draggableWidget);
  }, []);

  useEffect(() => {
    if (!disabled) {
      $(`#drag_${dragID}`).draggable("enable");
    } else {
      $(`#drag_${dragID}`).draggable("disable");
    }
  }, [disabled]);

  const createDraggables = (draggableWidget) => {
    $(`#drag_${dragID}`).draggable({
      ...draggableWidget,
      start: function () {
        if (commonDNDID != "" && commonDNDID !== undefined) {
          var droppables = jQuery(".dropzone");
          droppables.each(function (index, element) {
            if (!$(element).hasClass(commonDNDID)) {
              $(element).droppable("disable");
            }
          });
        }
        if (onStartEvent) onStartEvent();
      },
      drag: function (event, ui) {
        if (onDragEvent) onDragEvent(event, ui);
      },
      stop: function () {
        if (commonDNDID !== "" && commonDNDID !== undefined) {
          var droppables = jQuery(".dropzone");
          droppables.each(function (index, element) {
            if (!$(element).hasClass("dropzone-disabled")) {
              $(element).droppable("enable");
            }
          });
        }
        if (onStopEvent) onStopEvent();
      },
      revert: function (dropzone) {
        if (onRevertEvent) onRevertEvent(dropzone);
        if (!dropzone) return !dropzone;
      },
    });
  };

  const IOSOnClick = (e) => {
    if (isIOS) {
      setIsAccessibleListOpen(true);
      onDraggableClick(e);
    }
  };
  return (
    <>
      <div className={`draggable-container ${classes}`}>
        <div className="draggable-wrapper">
          <button
            title={label}
            onFocus={onFocus || null}
            onBlur={onBlur || null}
            onClick={() => {
              setIsAccessibleListOpen(true);
              onDraggableClick();
            }}
            data-drag-id={dragID}
            data-drag-attribute={dataAttribute}
            className="draggable-accessible-element"
            disabled={disabled}
            aria-hidden={isAriaHidden}
            tabIndex={isAriaHidden ? -1 : 0}
          />
          <div
            onClick={(e) => {
              IOSOnClick(e);
            }}
            id={`drag_${dragID}`}
            //in IOS devices, screen reader follows bottom to top approach in a parent div,
            // so focus will not move to button and it will remain stay in this div only,
            //  so we are using onClick function here for IOS specific
            aria-hidden
            data-drag-attribute={dataAttribute}
            className={`draggable-element ${
              commonDNDID !== undefined ? commonDNDID : ""
            }`}
            style={style}
          >
            {children ? children : null}
          </div>
        </div>
      </div>
      <AccessibleDnDList
        list={accessibleList}
        opened={isAccessibleListOpen}
        closeList={() => setIsAccessibleListOpen(false)}
        onClick={accessibleListDropClickHandler}
      />
    </>
  );
};

DraggableComponent.defaultProps = {
  disabled: false,
  onDraggableClick: () => {},
  accessibleListDropClickHandler: () => {},
  accessibleList: [],
  isAriaHidden: false,
  style: {},
};

DraggableComponent.propTypes = {
  draggableWidget: PropTypes.object,
  disabled: PropTypes.bool,
  classes: PropTypes.string,
  dataAttribute: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]),
  onDraggableClick: PropTypes.func,
  accessibleListDropClickHandler: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  label: PropTypes.string,
  accessibleList: PropTypes.array,
  children: PropTypes.node,
  isAriaHidden: PropTypes.bool,
  dragID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  //----events---------
  onStartEvent: PropTypes.func,
  onDragEvent: PropTypes.func,
  onStopEvent: PropTypes.func,
  onRevertEvent: PropTypes.func,
  style: PropTypes.object,
};

export default DraggableComponent;
