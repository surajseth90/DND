export const responsiveDrag = (globalScale) => {
  $.ui.draggable.prototype._mouseDrag = function (event, noPropagation) {
    // reset any necessary cached properties (see #5009)
    if (this.hasFixedAncestor) {
      this.offset.parent = this._getParentOffset();
    }

    // Compute the helpers position
    this.position = this._generatePosition(event, true);
    this.positionAbs = this._convertPositionTo("absolute");

    // Call plugins and callbacks and use the resulting position if something is returned
    if (!noPropagation) {
      var ui = this._uiHash();
      if (this._trigger("drag", event, ui) === false) {
        this._mouseUp(new $.Event("mouseup", event));
        return false;
      }
      this.position = ui.position;
    }

    this.helper[0].style.left = this.position.left / globalScale + "px";
    this.helper[0].style.top = this.position.top / globalScale + "px";

    if ($.ui.ddmanager) {
      $.ui.ddmanager.drag(this, event);
    }

    return false;
  };

  $.ui.draggable.prototype._mouseStop = function (event) {
    // If we are using droppables, inform the manager about the drop
    var that = this,
      dropped = false;
    if ($.ui.ddmanager && !this.options.dropBehaviour) {
      dropped = $.ui.ddmanager.drop(this, event);
    }

    // if a drop comes from outside (a sortable)
    if (this.dropped) {
      dropped = this.dropped;
      this.dropped = false;
    }

    if (
      (this.options.revert === "invalid" && !dropped) ||
      (this.options.revert === "valid" && dropped) ||
      this.options.revert === true ||
      ($.isFunction(this.options.revert) &&
        this.options.revert.call(this.element, dropped))
    ) {
      this.originalPosition.top = this.originalPosition.top / globalScale;
      this.originalPosition.left = this.originalPosition.left / globalScale;
      $(this.helper).animate(
        this.originalPosition,
        parseInt(this.options.revertDuration, 10),
        function () {
          if (that._trigger("stop", event) !== false) {
            that._clear();
          }
        }
      );
    } else {
      if (this._trigger("stop", event) !== false) {
        this._clear();
      }
    }

    return false;
  };

  $.ui.draggable.prototype._generatePosition = function (event, constrainPosition) {
    var containment, co, top, left,
      o = this.options,
      scrollIsRootNode = this._isRootNode(this.scrollParent[0]),
      pageX = event.pageX,
      pageY = event.pageY;

    // Cache the scroll
    if (!scrollIsRootNode || !this.offset.scroll) {
      this.offset.scroll = {
        top: this.scrollParent.scrollTop(),
        left: this.scrollParent.scrollLeft(),
      };
    }

    /*
     * - Position constraining -
     * Constrain the position to a mix of grid, containment.
     */

    // If we are not dragging yet, we won't check for options
    if (constrainPosition) {
      if (this.containment) {
        if (this.relativeContainer) {
          co = this.relativeContainer.offset();
          containment = [
            this.containment[0] + co.left,
            this.containment[1] + co.top,
            this.containment[2] * globalScale + co.left,
            this.containment[3] * globalScale + co.top,
          ];
        } else {
          containment = this.containment;
          containment = [
            this.containment[0] * globalScale,
            this.containment[1] * globalScale,
            this.containment[2] * globalScale,
            this.containment[3] * globalScale,
          ];
        }

        if (event.pageX - this.offset.click.left < containment[0]) {
          pageX = containment[0] + this.offset.click.left;
        }
        if ((event.pageY - this.offset.click.top) < containment[1]) {
          pageY = containment[1] + this.offset.click.top;
        }
        if (event.pageX - this.offset.click.left > containment[2]) {
          pageX = containment[2] + this.offset.click.left;
        }
        if (event.pageY - this.offset.click.top > containment[3]) {
          pageY = containment[3] + this.offset.click.top;
        }
      }

      if (o.grid) {
        // Check for grid elements set to 0 to prevent divide by 0 error causing invalid
        // argument errors in IE (see ticket #6950)
        top = o.grid[1] ? this.originalPageY + Math.round((pageY -
          this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
        pageY = containment ? ((top - this.offset.click.top >= containment[1] ||
          top - this.offset.click.top > containment[3]) ?
          top :
          ((top - this.offset.click.top >= containment[1]) ?
            top - o.grid[1] : top + o.grid[1])) : top;

        left = o.grid[0] ? this.originalPageX +
          Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] :
          this.originalPageX;
        pageX = containment ? ((left - this.offset.click.left >= containment[0] ||
          left - this.offset.click.left > containment[2]) ?
          left :
          ((left - this.offset.click.left >= containment[0]) ?
            left - o.grid[0] : left + o.grid[0])) : left;
      }

      if (o.axis === "y") {
        pageX = this.originalPageX;
      }

      if (o.axis === "x") {
        pageY = this.originalPageY;
      }
    }

    return {
      top: (

        // The absolute mouse position
        pageY -

        // Click offset (relative to the element)
        this.offset.click.top -

        // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.relative.top -

        // The offsetParent's offset without borders (offset + border)
        this.offset.parent.top +
        (this.cssPosition === "fixed" ?
          -this.offset.scroll.top :
          (scrollIsRootNode ? 0 : this.offset.scroll.top))
      ),
      left: (

        // The absolute mouse position
        pageX -

        // Click offset (relative to the element)
        this.offset.click.left -

        // Only for relative positioned nodes: Relative offset from element to offset parent
        this.offset.relative.left -

        // The offsetParent's offset without borders (offset + border)
        this.offset.parent.left +
        (this.cssPosition === "fixed" ?
          -this.offset.scroll.left :
          (scrollIsRootNode ? 0 : this.offset.scroll.left))
      )
    };
  };
};

export const responsiveDrop = (globalScale) => {
  $.ui.ddmanager.prepareOffsets = function (t, event) {
    var i,
      j,
      m = $.ui.ddmanager.droppables[t.options.scope] || [],
      type = event ? event.type : null, // workaround for #2317
      list = (t.currentItem || t.element).find(":data(ui-droppable)").addBack();

    droppablesLoop: for (i = 0; i < m.length; i++) {
      // No disabled and non-accepted
      if (
        m[i].options.disabled ||
        (t && !m[i].accept.call(m[i].element[0], t.currentItem || t.element))
      ) {
        continue;
      }

      // Filter out elements in the current dragged item
      for (j = 0; j < list.length; j++) {
        if (list[j] === m[i].element[0]) {
          m[i].proportions().height = 0;
          continue droppablesLoop;
        }
      }

      m[i].visible = m[i].element.css("display") !== "none";
      if (!m[i].visible) {
        continue;
      }

      // Activate the droppable if used directly from draggables
      if (type === "mousedown") {
        m[i]._activate.call(m[i], event);
      }

      m[i].offset = m[i].element.offset();
      m[i].proportions({
        width: m[i].element[0].offsetWidth * globalScale,
        height: m[i].element[0].offsetHeight * globalScale,
      });
    }
  };
};

export const resizeSetScaleContainment = (item, globalScale) => {
  var containmentArea = $(".activityContainer");
  if ($(item).hasClass("ui-draggable")) {
    var containment = [
      containmentArea.offset().left,
      containmentArea.offset().top,
      containmentArea.offset().left +
      containmentArea.width() * globalScale -
      $(item).width() * globalScale,
      containmentArea.offset().top +
      containmentArea.height() * globalScale -
      $(item).height() * globalScale,
    ];
    $(item).draggable("option", "containment", containment);
  }
};

export default {};
