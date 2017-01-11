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

import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import { withKnobs, text, select } from '@kadira/storybook-addon-knobs';
import { Button } from '../../react/lib/2016-12-01';
import SourceViewer from '../components/source_viewer';

const Example = require('../components/example');

const colorOptions = {
  black: 'Black',
  white: 'White',
  blue: 'Blue',

};

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('with text', () => {
    const buttonText = text('Text', 'Hello, button!');
    const props = {
      background: select('Background Color', colorOptions, 'black'),
      color: select('Color', colorOptions, 'white'),
      onClick: action('clicked'),
    };

    const sources = [
      {
        label: 'React',
        source: `
          <Button
            background="${props.background}"
            color="${props.color}"
            onClick={action('clicked')}
          >
            {"${buttonText}"}
          </Button>
        `,
      },
    ];

    return (
      <div>
        <Example {...props}>
          <Button {...props}>
            {buttonText}
          </Button>
        </Example>
        <SourceViewer sources={sources} />
      </div>
    );
  },
)

.add('disabled', () => {
  const buttonText = text('Text', 'Disabled button!');
  const props = {
    background: select('Background Color', colorOptions, 'black'),
    color: select('Color', colorOptions, 'white'),
    disabled: true,
  };

  const sources = [
    {
      label: 'React',
      source: `
        <Button
          background="${props.background}"
          color="${props.color}"
          onClick={action('clicked')}
          disabled={${props.disabled}}
        >
          {"${buttonText}"}
        </Button>
      `,
    },
  ];

  return (
    <div>
      <Example {...props}>
        <Button {...props}>
          {buttonText}
        </Button>
      </Example>
      <SourceViewer sources={sources} />
    </div>
  );
})
//
.add('hover state', () => {
  const buttonText = text('Text', 'Hover state');
  const props = {
    background: select('Background Color', colorOptions, 'blue'),
    color: select('Color', colorOptions, 'white'),
  };

  const sources = [
    {
      label: 'React',
      source: `
        <Button
          background="${props.background}"
          color="${props.color}"
          onClick={action('clicked')}
        >
          {"${buttonText}"}
        </Button>
      `,
    },
  ];

  return (
    <div>
      <Example {...props}>
        <Button {...props}>
          {buttonText}
        </Button>
      </Example>
      <SourceViewer sources={sources} />
    </div>
  );
})

.add('small button', () => {
  const buttonText = text('Text', 'Hover state');
  const props = {
    background: select('Background Color', colorOptions, 'black'),
    color: select('Color', colorOptions, 'white'),
    size: 'small',

  };

  const sources = [
    {
      label: 'React',
      source: `
        <Button
          background="${props.background}"
          color="${props.color}"
          onClick={action('clicked')}
          size={${props.size}}
        >
          {"${buttonText}"}
        </Button>
      `,
    },
  ];

  return (
    <div>
      <Example {...props}>
        <Button {...props}>
          {buttonText}
        </Button>
      </Example>
      <SourceViewer sources={sources} />
    </div>
  );
})

.add('large button', () => {
  const buttonText = text('Text', 'Hover state');
  const props = {
    background: select('Background Color', colorOptions, 'black'),
    color: select('Color', colorOptions, 'white'),
    size: 'large',

  };

  const sources = [
    {
      label: 'React',
      source: `
        <Button
          background="${props.background}"
          color="${props.color}"
          onClick={action('clicked')}
          size={${props.size}}
        >
          {"${buttonText}"}
        </Button>
      `,
    },
  ];

  return (
    <div>
      <Example {...props}>
        <Button {...props}>
          {buttonText}
        </Button>
      </Example>
      <SourceViewer sources={sources} />
    </div>
  );
});
