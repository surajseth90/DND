import React, { createRef } from "react";
import PropTypes from "prop-types";
import { isIOS } from "react-device-detect";
import "./style.scss";

class AccessibleDnDList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentItem: 0,
    };
    this.blurTimeout = "";
    this.ref = createRef();
  }

  onMouseDown = (event) => {
    event.persist();
    event.preventDefault();
    return false;
  };

  findNextNonHiddenItem = (currentIndex, downArrow) => {
    let newIndex = currentIndex;
    let changed = false;
    if (downArrow) {
      for (let i = currentIndex + 1; i < this.props.list.length; i++) {
        if (!this.props.list[i].hidden) {
          newIndex = i;
          changed = true;
          break;
        }
      }
      if (!changed) {
        for (let i = 0; i < currentIndex; i++) {
          if (!this.props.list[i].hidden) {
            newIndex = i;
            break;
          }
        }
      }
    } else {
      for (let i = currentIndex - 1; i >= 0; i--) {
        if (!this.props.list[i].hidden) {
          newIndex = i;
          changed = true;
          break;
        }
      }
      if (!changed) {
        for (let i = this.props.list.length - 1; i > currentIndex; i--) {
          if (!this.props.list[i].hidden) {
            newIndex = i;
            break;
          }
        }
      }
    }
    return newIndex;
  };

  UNSAFE_componentWillReceiveProps(newProps) {
    if (this.props.opened !== newProps.opened && newProps.opened) {
      if (!this.props.dropdownlist) {
        let index = 0;
        for (let i = 0; i < this.props.list.length; i++) {
          if (!this.props.list[i].hidden) {
            index = i;
            break;
          }
        }
        this.setState({ currentItem: index });
      } else {
        if (
          this.props.selectedItem == undefined ||
          this.props.selectedItem == null
        ) {
          this.setState({ currentItem: 0 });
        }
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.currentItem !== prevState.currentItem && this.props.opened) {
      this.focusActiveItem();
    } else if (this.props.opened !== prevProps.opened && this.props.opened) {
      this.focusActiveItem();
    }
  }

  focusActiveItem = (activeItemMarker = "a[data-selected-item]") => {
    setTimeout(() => {
      const selectedItem = this.ref.current.querySelector(activeItemMarker);
      if (selectedItem) {
        selectedItem.focus();
      }
    }, 50);
  };

  onClick = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    const { onClick, list } = this.props;
    let index = 0;
    if (this.props.dropdownlist) {
      index = list.findIndex((l) => l.id == id.id);
    }

    this.props.closeList(false);
    this.setState({ currentItem: index });
    onClick(id);
  };

  onFocus = () => {
    clearTimeout(this.blurTimeout);
  };

  onBlur = (e) => {
    this.blurTimeout = setTimeout(() => {
      if (this.props.opened) {
        this.props.closeList(false);
      }
    }, 100);
  };

  onKeyDown = (e, index, item) => {
    switch (e.which) {
      case 9:
      case 27:
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this.props.closeList(false);
        break;
      case 32:
        e.preventDefault();
        this.onClick(e, { ...item, index });
        break;
      case 35:
        e.preventDefault();
        this.lastItem(index);
        break;
      case 36:
        e.preventDefault();
        this.firstItem(index);
        break;
      case 37:
      case 38:
        e.preventDefault();
        this.previousItem(index);
        break;
      case 39:
      case 40:
        e.preventDefault();
        this.nextItem(index);
        break;
      default:
        break;
    }
  };

  onChangeItem = (currentItem) => {
    this.setState({ currentItem });
  };

  selectItem(itemIndex) {
    const { currentItem } = this.state;

    if (currentItem !== itemIndex) {
      this.onChangeItem(itemIndex);
    }
  }

  previousItem(index) {
    const _index = this.findNextNonHiddenItem(index, false);
    this.selectItem(_index);
  }

  nextItem(index) {
    const _index = this.findNextNonHiddenItem(index, true);
    this.selectItem(_index);
  }

  firstItem() {
    this.selectItem(0);
  }

  lastItem() {
    this.selectItem(this.props.list.length - 1);
  }

  render() {
    const { currentItem } = this.state;
    const { list, opened, selectedItem, classes, dropdownlist } = this.props;
    const topStyle = { display: opened ? "block" : "none" };
    let ulRole = opened && list.length > 1 ? "menu" : "none";
    let aRole = list.length > 1 ? "menuitem" : "button";
    if (dropdownlist) {
      ulRole = "listbox";
      aRole = "option";
    }
    return (
      <div className={`accessible-list ${classes}`} style={topStyle}>
        <ul
          role={ulRole}
          ref={this.ref}
          className="list"
          // aria-labelledby={dropdownlist || null}
        >
          {list.map((item, index) => {
            const { id, text, label,ariaLabel } = item;
            const selected = selectedItem == id;
            const _label = label || ariaLabel;
            const selectedClass = selected ? "selected" : "";
            const check = index === currentItem && !item.hidden;
            const tabindex = check ? null : -1;
            return (
              <li
                role="none"
                key={index}
                className={`listitem ${item.id} ${selectedClass}`}
              >
                <a
                  href="#"
                  role={aRole}
                  title={_label}
                  tabIndex={tabindex}
                  onBlur={this.onBlur}
                  onFocus={this.onFocus}
                  aria-hidden={item.hidden}
                  onMouseDown={this.onMouseDown}
                  data-selected-item={check || null}
                  onKeyDown={(e) => this.onKeyDown(e, index, item)}
                  onClick={(e) => this.onClick(e, { ...item, index })}
                >
                  <div>
                    {dropdownlist ? (
                      <span aria-hidden className={selectedClass}></span>
                    ) : null}
                    <div
                      aria-hidden
                      dangerouslySetInnerHTML={{ __html: item.text }}
                    ></div>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

AccessibleDnDList.defaultProps = {
  list: [],
};

AccessibleDnDList.propTypes = {
  list: PropTypes.array.isRequired,
  opened: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  closeList: PropTypes.func.isRequired,
};

export default AccessibleDnDList;
