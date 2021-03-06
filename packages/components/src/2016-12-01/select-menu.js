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
require('./list');
require('./select-option');

const Registry = require('../utils/private-registry.js');
const applyProps = require('../utils/apply-props.js');
const Element = require('./element.js');

class SelectMenu extends Element {
  constructor() {
    super();

    this.MENU_MIN_WIDTH = '100px';
    this.OPTION_HEIGHT = 26;
    this.MAX_OPTIONS_VISIBLE = 6;

    applyProps(this, {
      position: 'absolute',
      display: 'block',
      'box-shadow': 1,
      'white-space': 'nowrap'
    });

    ['_cloneEvent', '_close'].forEach(handler => {
      this[handler] = this[handler].bind(this);
    });
  }

  set options(newOptions) {
    this.state.options = newOptions;
    this._queueRender();
  }

  set top(val) {
    this.state.top = val;
    this._queueRender();
  }

  set left(val) {
    this.state.left = val;
    this._queueRender();
  }

  set width(val) {
    this.state.width = val;
    this._queueRender();
  }

  set open(val) {
    this.state.open = val;
    this._queueRender();
  }

  set focusedKey(newValue) {
    this.state.focusedKey = newValue;
    this._queueRender();
  }

  set selectedKey(newValue) {
    this.state.selectedKey = newValue;
    this._queueRender();
  }

  connectedCallback() {
    this._ensureList();
  }

  _ensureList() {
    if (this.list !== undefined) {
      return;
    }

    this.list = document.createElement('orion-list');

    applyProps(this.list, {
      itemTagname: 'orion-select-option',
      container: 'column'
    });

    this.list.style.maxHeight = `${this.OPTION_HEIGHT * this.MAX_OPTIONS_VISIBLE}px`;
  }

  _removeList() {
    if (this.list !== undefined) {
      this.list.remove();
    }
  }

  _cloneEvent(event) {
    this.dispatchEvent(new CustomEvent(event.type, event));
  }

  _close() {
    this.dispatchEvent(new CustomEvent('closed'));
  }

  _ensureNoResultsMessage() {
    let noResultsMessage = this.querySelector(
      '[data-orion-id=no-results-message]'
    );
    if (noResultsMessage !== null) {
      return;
    }

    noResultsMessage = document.createElement('orion-element');
    noResultsMessage.textContent = 'No results found';
    noResultsMessage.setAttribute('data-orion-id', 'no-results-message');
    applyProps(noResultsMessage, {
      'padding-horizontal': 3,
      'padding-vertical': 2,
      background: 'white',
      display: 'block'
    });

    this.appendChild(noResultsMessage);
  }

  _removeNoResultsMessage() {
    const noResultsMessage = this.querySelector(
      '[data-orion-id=no-results-message]'
    );
    if (noResultsMessage === null) {
      return;
    }
    noResultsMessage.remove();
  }

  render() {
    this._ensureList();

    const currentListHeight = this.OPTION_HEIGHT * this.state.options.length;
    const maxListHeight = this.OPTION_HEIGHT * this.MAX_OPTIONS_VISIBLE;
    const scrollValue = currentListHeight > maxListHeight ? 'scroll' : 'hidden';

    applyProps(this.list, {
      'overflow-y': scrollValue
    });

    if (this.state.open) {
      const options = this.state.options.map(option => {
        option.hasFocus = option.key === this.state.focusedKey;
        option.isSelected = option.key === this.state.selectedKey;
        return option;
      });

      applyProps(this.list, {
        items: options
      });

      applyProps(this.list.style, {
        minWidth: this.MENU_MIN_WIDTH
      });

      if (!this.contains(this.list)) {
        this.appendChild(this.list);
      }

      // show/hide the no results thing
      if (options.length === 0) {
        this._ensureNoResultsMessage();
      } else {
        this._removeNoResultsMessage();
      }
    } else {
      this._removeList();
      this._removeNoResultsMessage();
    }

    super.render();
  }
}

Registry.define('orion-select-menu', SelectMenu);

module.exports = SelectMenu;
