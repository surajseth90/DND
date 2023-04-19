import React, { Component } from "react";
import { responsiveDrag, responsiveDrop } from "../../helpers/jquery";
import "./style.scss";
import PropTypes from "prop-types";
// import { withTranslation } from 'react-i18next';
class ScalableWrapper extends Component {
  constructor(props) {
    super(props);
    this.ref = "";

    this.resize = this.resize.bind(this);
    this.visibilityChange = this.visibilityChange.bind(this);
  }

  componentDidMount() {
    this.resize();
    window.addEventListener("resize", this.resize, true);
    document.addEventListener("visibilitychange", this.visibilityChange, true);

    document.addEventListener("keydown", this.keyDownHandler, true);
    document.addEventListener("mousedown", this.mouseDownHandler, true);
    document.addEventListener("focus", this.keyDownHandler, true);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resize, true);
    document.removeEventListener(
      "visibilitychange",
      this.visibilityChange,
      true
    );
  }

  mouseDownHandler = () => {
    const body = document.querySelector("body");
    body.classList.add("no-outline");
    this.props.updateA11yActiveStatus(false);
  };

  keyDownHandler = (e) => {
    if (e.key && e.key == "Tab") {
      const body = document.querySelector("body");
      body.classList.remove("no-outline");
    }

    switch (e.which) {
      case 37:
      case 38:
      case 9:
      case 39:
      case 40:
        this.props.updateA11yActiveStatus(true);
        break;
      default:
        break;
    }

    if (this.props.liveText) this.props.updateLiveText("");
  };

  resize() {
    const boxWidth = 1600;
    const boxHeight = 900;
    let windowWidth = document.documentElement.clientWidth;
    let windowHeight = document.documentElement.clientHeight;

    let scaleX = windowWidth / boxWidth;
    let scaleY = windowHeight / boxHeight;
    let scale = Math.min(scaleX, scaleY);
    // this.props.scaleChange(scale);
    this.mainContainer.style.width = `${boxWidth * scale}px`;
    this.mainContainer.style.height = `${boxHeight * scale}px`;
    this.innerContainer.style.transform = `scale(${scale})`;

    clearTimeout(this.ref);
    this.ref = setTimeout(() => {
      responsiveDrag(scale);
      responsiveDrop(scale);
    }, 300);
  }

  visibilityChange() {
    if (document.visibilityState && document.visibilityState === "visible") {
      this.resize();
    }
  }

  render() {
    return (
      <div
        className={`scalable-wrapper-container`}
        ref={(div) => {
          this.mainContainer = div;
        }}
      >
        <div
          className={`scalable-wrapper-inner`}
          ref={(div) => {
            this.innerContainer = div;
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default ScalableWrapper;

ScalableWrapper.defaultProps = {
  updateA11yActiveStatus: () => {},
};

ScalableWrapper.propTypes = {
  ScalableWrapper: PropTypes.func,
  // scaleChange: PropTypes.func,
  updateLiveText: PropTypes.func,
  updateA11yActiveStatus: PropTypes.func,
  liveText: PropTypes.string,
  children: PropTypes.node,
};
