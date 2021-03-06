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
/**
 * Abstraction demo
 */

import { flattenPrimitive } from './utils/gen-functional-component';
import { primitiveToHtml } from './utils/gen-html';
import { Primitive } from './primitives';
import { toolbarTemplate } from './demo-components/toolbar';

const panel: Primitive = {
  type: 'container',
  props: {
    display: 'flex',
    layout: 'column'
  },

  children: [
    {
      type: 'text',
      textContent: 'Hello Toolbar'
    },
    {
      type: 'component',
      component: {
        type: 'toolbar',
        props: {
          items: [
            { label: 'Item 1', icon: 'item1.png', width: 20, height: 20 },
            { label: 'Item 2', icon: 'item2.png', width: 20, height: 20 },
            { label: 'Item 3', icon: 'item3.png', width: 20, height: 20 }
          ]
        }
      }
    }
  ]
}

console.log();
console.log('A template which uses a component type');
console.log();

console.log(JSON.stringify(panel, null, 4));

console.log();
console.log('When flattened with toolbarTemplate')
console.log();

console.log(JSON.stringify(toolbarTemplate, null, 4));

console.log();
console.log('Makes the following primitive')
console.log();

const flat = flattenPrimitive(panel, {}, {toolbar: toolbarTemplate});

console.log(JSON.stringify(flat, null, 4));

console.log();
console.log();
console.log(JSON.stringify(primitiveToHtml(flat), null, 4));