/**
Copyright 2016 Autodesk,Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/
import { connectToDevTools } from 'react-devtools-core';

connectToDevTools({
  host: 'localhost',
  port: 3000
});

import React, { Component } from 'react';
import ReactFiberReconciler from 'react-dom/lib/ReactFiberReconciler';
import {
  unstable_renderSubtreeIntoContainer,
  unmountComponentAtNode
} from 'react-dom';

import * as HIGWeb from './hig-web';

/**
 * HIG Fiber Renderer
 */

const types = {
  BUTTON: 'hig-button',
  MENU: 'hig-menu',
  BASE_SLOT: 'hig-slot'
};

const HIGRenderer = ReactFiberReconciler({
  useSyncScheduling: true,

  createInstance(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    switch (type) {
      case types.BASE_SLOT: {
        return new HIGWeb.Slot(props);
      }
      case types.MENU: {
        return new HIGWeb.Menu(props);
      }
      case types.BUTTON: {
        return new HIGWeb.Button(props);
      }
      default:
        throw new Error(`Unknown type ${type}`);
    }
  },

  getPublicInstance(instance) {
    debugger;
    if (instance.getDOMNode) {
      return instance.getDOMNode();
    } else {
      console.error('no DOM node available');
    }
  },

  appendInitialChild(parentInstance, child) {
    debugger;
    parentInstance.appendChild(child);
  },

  finalizeInitialChildren(newElement, type, props, rootContainerInstance) {
    debugger;
    return false;
  },

  appendChild(parentInstance, child) {
    if (parentInstance instanceof HTMLElement) {
      child.mount(parentInstance, null);
    } else {
      parentInstance.appendChild(child);
    }
  },

  insertBefore(parentInstance, child, beforeChild) {
    debugger;
    // do insert
  },

  removeChild(parentInstance, child) {
    debugger;
    // do remove
  },

  shouldSetTextContent(props) {
    if (typeof props.children === 'string') {
      return true;
    } else {
      return false;
    }
  },

  resetTextContent(element) {
    debugger;
    // no-op
  },

  createTextInstance(
    text,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  ) {
    debugger;
  },

  commitTextUpdate(textElement, oldText, newText) {
    debugger;
    // do commit
  },

  // create context to provide to children
  getRootHostContext(rootContainerInstance) {
    return rootContainerInstance;
  },

  getChildHostContext(parentHostContext, type) {
    return parentHostContext;
  },

  // turn off event handlers (in react-dom)
  prepareForCommit() {
    debugger;
    // no-op
  },

  commitMount(instance, type, newProps, internalInstanceHandle) {
    debugger;
  },

  prepareUpdate(
    instance,
    type,
    oldProps,
    newProps,
    rootContainerInstance,
    hostContext
  ) {
    debugger;
    return false;
  },

  commitUpdate(
    instance,
    updatePayload,
    type,
    oldProps,
    newProps,
    internalInstanceHandle
  ) {
    debugger;
    instance._applyProps(instance, newProps, oldProps);
  },

  // turn on event handlers (in react-dom)
  resetAfterCommit() {},

  scheduleAnimationCallback(fn) {
    debugger;
    setTimeout(fn);
  },

  scheduleDeferredCallback(fn) {
    setTimeout(fn, 0, { timeRemaining: () => Infinity });
  }
});

/**
 * React Components
 */
export default class HIG extends Component {
  componentDidMount() {
    // Pass the new HIGWeb instance to a custom fiber renderer container
    this._mountNode = HIGRenderer.createContainer(this._higRef);

    // Update the container with the react children
    // This is equal to ReactDOM.render I think
    HIGRenderer.updateContainer(this.props.children, this._mountNode, this);
  }

  componentDidUpdate(prevProps, prevState) {
    HIGRenderer.updateContainer(this.props.children, this._mountNode, this);
  }

  componentWillUnmount() {
    HIGRenderer.updateContainer(null, this._mountNode, this);
  }

  render() {
    return <hig-web ref={ref => this._higRef = ref} />;
  }
}

export const Button = types.BUTTON;
export const Menu = types.MENU;

export class Slot extends Component {
  componentDidMount() {
    this.renderSlot(this.props);
  }

  renderSlot(props) {
    const parentComponent = this;
    const element = props.children;
    const container = this._higRef;

    unstable_renderSubtreeIntoContainer(parentComponent, element, container);
  }

  componentWillUnmount() {
    unmountComponentAtNode(this._higRef);
  }

  componentWillReceiveProps(nextProps) {
    this.renderSlot(nextProps);
  }

  render() {
    return <hig-slot ref={ref => this._higRef = ref} />;
  }
}
