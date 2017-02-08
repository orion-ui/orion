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
import { cd, exec, cat, ls, test } from 'shelljs';
import { expect } from 'chai';

import version from '../version';

describe('compile HelloWorld.oml', () => {
  ls('examples/*.oml').forEach(file => {
    it(`compiles ${file} to ${file}.js`, () => {

      const output = `${file}.js`;

      if (!test('-e', output)) {
        console.warn(`Skipping ${file} since no expected js file found`);
        return;
      }

      const { stdout } = exec(`node ${version} compile ${file}`);
      expect(stdout.toString()).to.equal( cat(output).toString() );
    });
  });
});