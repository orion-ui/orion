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
import * as HIG from 'hig.web';

import HIGElement from '../elements/HIGElement';
import * as PropTypes from 'prop-types';
import createComponent from './createComponent';

class TextField extends HIGElement {
  constructor(initialProps) {
    super(HIG.TextField, initialProps);

    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    this.commitUpdate(this.props);

    this.hig
      ._findDOMEl('.hig__text-field__input')
      .addEventListener('keypress', this.handleInput);
  }

  handleInput(event) {
    // Call callback if provided
    if (this.props.onInput) {
      this.props.onInput(...arguments);
    }

    // Prevent user interaction from changing text field value
    if (this.props.value) {
      console.log('handleInput set value:', this.props.value);

      this.hig.setValue(this.props.value);
    }
  }

  commitUpdate(updatePayload, oldProps, newProps) {
    for (let i = 0; i < updatePayload.length; i += 2) {
      const propKey = updatePayload[i];
      const propValue = updatePayload[i + 1];

      switch (propKey) {
        case 'disabled': {
          propValue ? this.hig.disable() : this.hig.enable();
          break;
        }
        case 'icon': {
          this.hig.setIcon(propValue);
          break;
        }
        case 'instructions': {
          this.hig.setInstructions(propValue);
          break;
        }
        case 'label': {
          this.hig.setLabel(propValue);
          break;
        }
        case 'name': {
          this.hig.setName(propValue);
          break;
        }
        case 'onBlur': {
          const dispose = this._disposeFunctions.get('onBlurDispose');

          if (dispose) {
            dispose();
          }

          this._disposeFunctions.set(
            'onBlurDispose',
            this.hig.onBlur(propValue)
          );
          break;
        }
        case 'onChange': {
          const dispose = this._disposeFunctions.get('onChangeDispose');

          if (dispose) {
            dispose();
          }

          this._disposeFunctions.set(
            'onChangeDispose',
            this.hig.onChange(propValue)
          );
          break;
        }
        case 'onFocus': {
          const dispose = this._disposeFunctions.get('onFocusDispose');

          if (dispose) {
            dispose();
          }

          this._disposeFunctions.set(
            'onFocusDispose',
            this.hig.onFocus(propValue)
          );
          break;
        }
        case 'onInput': {
          const dispose = this._disposeFunctions.get('onInputDispose');

          if (dispose) {
            dispose();
          }

          this._disposeFunctions.set(
            'onInputDispose',
            this.hig.onInput(propValue)
          );
          break;
        }
        case 'placeholder': {
          this.hig.setPlaceholder(propValue);
          break;
        }
        case 'required': {
          propValue
            ? this.hig.required(propValue)
            : this.hig.noLongerRequired();
          break;
        }
        case 'value': {
          console.log('commit update value: ', propValue);
          this.hig.setValue(propValue);
          break;
        }
        default: {
          console.warn(
            `${this.constructor.name} doesn't handle the prop ${propKey}`
          );
        }
      }
    }
  }
}

const TextFieldComponent = createComponent(TextField);

TextField.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  instructions: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onInput: PropTypes.func,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  value: PropTypes.string
};

TextField.__docgenInfo = {
  props: {
    disabled: {
      description: 'prevents interaction with the text field'
    },
    icon: {
      description: 'icon for the text field'
    },
    instructions: {
      description: 'instructional text for the text field'
    },
    label: {
      description: 'label for the text field'
    },
    name: {
      description: 'name of the field as submitted with a form'
    },
    onBlur: {
      description: 'callback called when user moves focus away from the text field'
    },
    onChange: {
      description: 'callback called when user changes the value of the text field and moves focus away'
    },
    onFocus: {
      description: 'callback called when user moves focus onto the text field'
    },
    onInput: {
      description: 'callback called when user changes the value of the text field'
    },
    placeholder: {
      description: 'text prompting the user to enter text'
    },
    required: {
      description: 'text indicating that the user must enter a value for this text field'
    }
  }
};

export default TextFieldComponent;