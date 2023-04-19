import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const findKey = require('lodash.findkey');

class ResponsiveWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orientation: 'landscape',
      breakpoint: '',
    };
  }

  componentDidMount() {
    window.onresize = () => { this.adjustForContainerSize(); };
    this.adjustForContainerSize();
  }

  getBreakpoint() {
    const containerSize = this.getContainerSize();
    const windowSize = this.getWindowSize();
    const breakpoint = findKey(this.props.breakpoints, (ar) => {
      if (this.state.modalMode === true && this.state.isExpanded) {
        const firstPass = windowSize >= ar[0];
        return (firstPass && (ar[1] === '~' || windowSize <= ar[1]));
      }
      const firstPass = containerSize >= ar[0];
      return (firstPass && (ar[1] === '~' || containerSize <= ar[1]));
    });

    return breakpoint || '';
  }

  getWindowSize() { // eslint-disable-line class-methods-use-this
    // eslint-disable-next-line no-undef
    return window.innerWidth;
  }

  getContainerSize() {
    return this.wrapperDiv.clientWidth;
  }

  getAppHeight() {
    return this.app_container.scrollHeight;
  }

  getOrientation() { // eslint-disable-line class-methods-use-this
    // eslint-disable-next-line no-undef
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  getWindowHeight() { // eslint-disable-line class-methods-use-this
    // eslint-disable-next-line no-undef
    return window.innerHeight;
  }

  adjustForContainerSize() {
    const orientation = this.getOrientation();
    const breakpoint = this.getBreakpoint();
    const containerSize = this.getContainerSize();
    const windowSize = this.getWindowSize();
    const windowHeight = this.getWindowHeight();
    const { isExpanded } = this.state;

    this.props.onResize({
      orientation,
      breakpoint,
      containerSize,
      windowSize,
      windowHeight,
      isExpanded,
    });

    this.setState({
      orientation,
      breakpoint,
    });

    return containerSize;
  }

  render() {
    const { orientation, breakpoint } = this.state;
    const { children } = this.props;

    return (

      <div
        className={`responsive-wrapper ${orientation} ${breakpoint}`}
        ref={(el) => { this.wrapperDiv = el; }}
      >
        {children}
      </div>

    );
  }
}

ResponsiveWrapper.propTypes = {
  breakpoints: PropTypes.object,
  onResize: PropTypes.func,
  children: PropTypes.object,
};

ResponsiveWrapper.defaultProps = {
  onResize: () => { },
  breakpoints: {},
  children: {},
};

export default ResponsiveWrapper;
