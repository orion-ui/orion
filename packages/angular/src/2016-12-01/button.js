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
const { ColorValidator, SizeValidator } = require('./validators');
require('@orion-ui/components/lib/2016-12-01/button');

const colorValidator = new ColorValidator();
const sizeValidator = new SizeValidator();
const configurable = ['background', 'color', 'disabled', 'hover', 'size'];

const validations = {
  color: colorValidator,
  background: colorValidator,
  size: sizeValidator
};

// Use ng-click
const ButtonComponent = {
  bindings: {
    background: '<',
    color: '<',
    disabled: '<',
    hover: '<',
    size: '<'
  },

  controller: [
    '$element',
    '$log',
    function controller($element, $log) {
      // eslint-disable object-shorthand
      const elementReady = window.customElements.whenDefined('orion-button');

      this.$onChanges = changesObj =>
        elementReady.then(() => {
          const el = $element[0];
          const props = Object.keys(changesObj);
          props.forEach(prop => {
            try {
              if (!configurable.includes(prop)) {
                return;
              }

              if (changesObj[prop].currentValue === undefined) {
                return;
              }

              const newVal = changesObj[prop].currentValue;

              if (validations[prop]) {
                const validator = validations[prop];
                validator.valid(newVal);
              }

              el[prop] = newVal;
            } catch (e) {
              $log.error(e);
            }
          });
        });
    }
  ]
};

module.exports = ButtonComponent;
