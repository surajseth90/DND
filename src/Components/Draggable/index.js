import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { isIOS } from "react-device-detect";
import AccessibleDnDList from "../AccessibleList";
import "./style.scss";

const DraggableComponent = (props) => {
  const {
    label,
    classes,
    dataUniqueAttribute,
    disabled,
    onDraggableClick,
    accessibleList,
    accessibleListDropClickHandler,
    onFocus,
    onBlur,
    draggableFunctions,
    isAriaHidden,
    children,
  } = props;

  const [isAccessibleListOpen, setIsAccessibleListOpen] = useState(false);

  useEffect(() => {
    createDraggables(draggableFunctions);
  }, []);

  const createDraggables = (draggableFunctions) => {
    // setTimeout(() => {
    $(".draggable-element").draggable({ ...draggableFunctions });
    // .draggable("enable");
    // }, 100);
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
            data-drag-attribute={dataUniqueAttribute}
            className="draggable-accessible-element"
            disabled={disabled}
            aria-hidden={isAriaHidden}
            tabIndex={isAriaHidden ? -1 : 0}
          />
          <div
            onClick={(e) => {
              IOSOnClick(e);
            }}
            //in IOS devices, screen reader follows bottom to top approach in a parent div,
            // so focus will not move to button and it will remain stay in this div only,
            //  so we are using onClick function here for IOS specific
            aria-hidden
            data-drag-attribute={dataUniqueAttribute}
            className="draggable-element"
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
};

DraggableComponent.propTypes = {
  draggableFunctions: PropTypes.func,
  disabled: PropTypes.bool,
  classes: PropTypes.string,
  dataUniqueAttribute: PropTypes.string,
  onDraggableClick: PropTypes.func,
  accessibleListDropClickHandler: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  label: PropTypes.string,
  accessibleList: PropTypes.array,
  children: PropTypes.node,
  isAriaHidden: PropTypes.bool,
};

export default DraggableComponent;
