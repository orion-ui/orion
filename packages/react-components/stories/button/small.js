/* eslint-disable react/prop-types */
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
import { select, text } from '@kadira/storybook-addon-knobs';

import Button from '../../src/2016-12-01/button';
import { WithSource } from '../../.storybook/addons/source-addon';
import { sizeOptions } from '../shared';

export default function small() {
  const buttonText = text('Text', 'Hello, button!');
  const props = {
    size: select('Size', sizeOptions, 'small')
  };

  const react = `
import React from 'react';
import { Button } from '../../../react/lib/2016-12-01';

class App extends React.Component {
render() {
  return (
    <Button size="${props.size}">
      ${buttonText}
    </Button>
  )
}
ReactDOM.render(React.createElement(App), document.body);`;

  const angular = `
// ------------------------------
// controller.js

import 'angular';
import '@orion-ui/angular/lib/2016-12-01';

angular.module('app', ['orion']) // include orion module
  .controller('AppController', function () {
    var app = this;

    app.label = '${buttonText}';
    app.size = '${props.size}';
  });

// ------------------------------
// index.html

<!doctype html>
<html>
<body ng-app="app">
  <div ng-controller="AppController as app">
    <orion-button size="app.size">
      {{ app.label }}
    </orion-button>
  </div>
</body>
</html>`;

  return (
    <WithSource react={react} angular={angular}>
      <Button {...props}>
        {buttonText}
      </Button>
    </WithSource>
  );
}
