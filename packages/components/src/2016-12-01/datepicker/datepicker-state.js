/* eslint-disable no-unused-vars */
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

/* global moment:false */

import moment from 'moment';

const DatepickerState = {
  MAXIMUM_DISABLED_SKIP: 31,

  getInitialState(state = {}) {
    const initialState = {
      disabled: false,
      focus: false,
      date: null,
      clearable: false,
      focusDate: null,
      currentDate: moment(),
      displayFormat: 'MM-DD-YYYY',
      monthFormat: 'MMMM YYYY',
      i18n: {
        previousMonth: 'Previous Month',
        nextMonth: 'Next Month',
        clearDate: 'Clear Date',
      },
      isEnabled: function isEnabled(date) {
        return date.isSameOrAfter(this.currentDate, 'date');
      },
      ...state,
    };

    initialState.isEnabled.bind(initialState);

    return initialState;
  },

  enterDisabled(state) {
    return { ...state, disabled: true };
  },

  leaveDisabled(state) {
    return { ...state, disabled: false };
  },

  enterFocused(state) {
    if (state.date) {
      return { ...state, focus: true, focusDate: moment(state.date) };
    }

    return { ...state, focus: true, focusDate: moment(state.currentDate) };
  },

  leaveFocused(state) {
    return { ...state, focus: false, focusDate: null };
  },

  _findEnabledDate(state, date, iterations = 0) {
    if (iterations >= this.MAXIMUM_DISABLED_SKIP) {
      return null;
    }

    if (state.isEnabled(date)) {
      return date;
    }

    const nextDate = moment(date).add(1, 'day');
    return this._findEnabledDate(state, nextDate, iterations + 1);
  },

  selectDate(state, date) {
    if (state.isEnabled === undefined) {
      return { ...state, date: moment(date), focusDate: moment(date) };
    }

    const nextEnabledDate = this._findEnabledDate(state, date);
    if (nextEnabledDate) {
      return { ...state, date: moment(nextEnabledDate), focusDate: moment(nextEnabledDate) };
    }

    return state;
  },

  dateCleared(state) {
    return { ...state, date: '' };
  },

  setCurrentDate(state, currentDate) {
    return { ...state, currentDate: moment(currentDate) };
  },

  focusNextDay(state) {
    return this.setFocusDate(state, moment(state.focusDate).add(1, 'day'));
  },

  focusPreviousDay(state) {
    return this.setFocusDate(state, moment(state.focusDate).subtract(1, 'day'));
  },

  focusNextWeek(state) {
    return this.setFocusDate(state, moment(state.focusDate).add(1, 'week'));
  },

  focusPreviousWeek(state) {
    return this.setFocusDate(state, moment(state.focusDate).subtract(1, 'week'));
  },

  setFocusDate(state, date) {
    if (state.isEnabled === undefined) {
      return { ...state, focusDate: moment(date) };
    }

    const nextEnabledDate = this._findEnabledDate(state, date);
    if (nextEnabledDate) {
      return { ...state, focusDate: moment(nextEnabledDate) };
    }

    return state;
  },

  focusNextMonth(state) {
    return this.setFocusDate(state, moment(state.focusDate).add(1, 'month'));
  },

  focusPreviousMonth(state) {
    return this.setFocusDate(state, moment(state.focusDate).subtract(1, 'month'));
  },

  selectFocusDate(state) {
    return { ...state, date: moment(state.focusDate) };
  },
};

module.exports = DatepickerState;
