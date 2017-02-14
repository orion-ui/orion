/* global moment:false */
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

import moment from 'moment';

require('../../vendor/es5-custom-element-shim');

require('./datepicker/datepicker-calendar');

const Element = require('./element');
const DatepickerState = require('./datepicker/datepicker-state');
const Registry = require('../utils/private-registry');
const applyProps = require('../utils/apply-props');
const eventKey = require('../utils/event-key');

class Datepicker extends Element {
  constructor() {
    super();
    this.state = DatepickerState.getInitialState();
    applyProps(this, {
      color: 'black',
      background: 'white',
      display: 'inline-block',
      position: 'relative',
    });

    ['_handleKeydown', '_focus', '_blur'].forEach((handler) => {
      this[handler] = this[handler].bind(this);
    });
  }

  connectedCallback() {
    this._ensureInput();
    this._ensureCalendar();
    this._addListeners();
    this._queueRender();
  }

  disconnectedCallback() {
    this._removeListeners();
  }

  set focus(val) {
    this.state.focus = val;

    if (val) {
      this.state.focusDate = moment();
      this.calendar.focusDate = this.state.focusDate;
    }

    this._queueRender();
  }

  set focusDate(val) {
    this.state.focusDate = val;
    this._queueRender();
  }

  set date(val) {
    this.state.date = val;
    this._queueRender();
  }

  _handleKeydown(event) {
    if (eventKey(event) === 'Tab') {
      this._dispatchStateChange('leaveFocused');
    }
  }

  _focus() {
    this._dispatchStateChange('enterFocused');
  }

  _blur() {
    this._dispatchStateChange('leaveFocused');
  }

  _dispatchStateChange(eventType, arg) {
    const nextState = DatepickerState[eventType](this.state, arg);
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        type: eventType,
        state: nextState,
      },
    }));
  }

  _addListeners() {
    this.dateInput.addEventListener('keydown', this._handleKeydown);
    this.dateInput.addEventListener('focus', this._focus);
    this.dateInput.addEventListener('blur', this._blur);
  }

  _removeListeners() {
    this.dateInput.removeEventListener('keydown', this._handleKeydown);
    this.dateInput.removeEventListener('focus', this._focus);
    this.dateInput.removeEventListener('blur', this._blur);
  }

  _ensureInput() {
    this.dateInput = this.querySelector('input');

    if (this.dateInput === null) {
      this.dateInput = document.createElement('input');
      this.appendChild(this.dateInput);
      applyProps(this.dateInput, {
        type: 'text',
        placeholder: 'Select Date',
      });
    }
  }

  _ensureCalendar() {
    this.calendar = this.querySelector('orion-datepicker-calendar');

    if (this.calendar === null) {
      this.calendar = document.createElement('orion-datepicker-calendar');
      this.appendChild(this.calendar);
    }
  }

  // Event Listeners

  _render() {
    this._ensureInput();
    this._ensureCalendar();

    if (this.state.date && this.state.displayFormat) {
      const formattedDate = this.state.date.format(this.state.displayFormat);
      applyProps(this.dateInput, {
        value: formattedDate,
      });
    }

    applyProps(this.calendar, {
      display: this.state.focus ? 'block' : 'none',
      focusDate: this.state.focusDate,
      monthFormat: this.state.monthFormat,
    });

    super._render();
  }
}

Registry.define('orion-datepicker', Datepicker);

module.exports = Datepicker;
