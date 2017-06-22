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

import * as PropTypes from 'prop-types';
import HIGElement from '../../HIGElement';
import HIGNodeList from '../../HIGNodeList';
import HIGChildValidator from '../../HIGChildValidator';
import createComponent from '../../../adapters/createComponent';
import AccountComponent, { Account } from './Account';
import ProjectComponent, { Project } from './Project';

export class ProjectAccountSwitcher extends HIGElement {
  constructor(HIGConstructor, initialProps) {
    super(HIGConstructor, initialProps);

    this.accounts = new HIGNodeList({
      type: Account,
      HIGConstructor: this.hig.partials.Account,
      onAdd: (instance, beforeInstance) => {
        this.hig.addAccount(instance, beforeInstance);
      }
    });

    this.projects = new HIGNodeList({
      type: Project,
      HIGConstructor: this.hig.partials.Project,
      onAdd: (instance, beforeInstance) => {
        this.hig.addProject(instance, beforeInstance);
      }
    });

    ['openFlyout', 'closeFlyout'].forEach(fn => {
      this[fn] = this[fn].bind(this);
    });
  }

  componentDidMount() {
    this.accounts.componentDidMount();
    this.projects.componentDidMount();

    if (this.initialProps.isOpen === true) {
      this.hig.open();
    }

    if (this.initialProps.hideProjectAccountFlyout) {
      this.hig.removeCaretFromTarget();
    }

    this.hig.onClick(this.openFlyout);
    this.hig.onClickOutside(this.closeFlyout);
  }

  openFlyout() {
    this.hig.open();
  }

  closeFlyout() {
    this.hig.close();
  }

  commitUpdate(updatePayload, oldProps, newProp) {
    const mapping = {
      activeImage: 'setActiveImage',
      activeLabel: 'setActiveLabel',
      activeType: 'setActiveType'
    };

    const openIndex = updatePayload.indexOf('isOpen');
    if (openIndex >= 0) {
      const [openKey, openSetting] = updatePayload.splice(openIndex, 2);
      if (openKey) {
        if (openSetting === true) {
          this.hig.open();
        } else {
          this.hig.close();
        }
      }
    }
    this.commitUpdateWithMapping(updatePayload, mapping);
  }

  createElement(ElementConstructor, props) {
    switch (ElementConstructor) {
      case Project:
        return this.projects.createElement(ElementConstructor, props);
      case Account:
        return this.accounts.createElement(ElementConstructor, props);
      default:
        throw new Error(`Unknown type ${ElementConstructor.name}`);
    }
  }

  insertBefore(instance, beforeChild = {}) {
    if (instance instanceof Account) {
      this.accounts.insertBefore(instance);
    } else if (instance instanceof Project) {
      this.projects.insertBefore(instance);
    } else {
      throw new Error('unknown type');
    }
  }
}

const ProjectAccountSwitcherComponent = createComponent(ProjectAccountSwitcher);

ProjectAccountSwitcherComponent.propTypes = {
  isOpen: PropTypes.bool,
  hideProjectAccountFlyout: PropTypes.bool,
  removeCaretFromTarget: PropTypes.func,
  activeLabel: PropTypes.string,
  activeImage: PropTypes.string,
  activeType: PropTypes.string,
  onClickOutside: PropTypes.func,
  onClick: PropTypes.func,
  children: HIGChildValidator([AccountComponent, ProjectComponent])
};

ProjectAccountSwitcherComponent.__docgenInfo = {
  props: {
    activeLabel: {
      description: 'sets {String} the label displayed in the top nav'
    },
    activeImage: {
      description: 'sets {String} the image displayed in the top nav'
    },
    activeType: {
      description: 'sets the {String} type of the item displayed in the top nav'
    },
    addAccount: {
      description: '{func} pass in an instance of a ProjectAccountSwitcher Account'
    },
    addProject: {
      description: '{func} pass in an instance of a ProjectAccountSwitcher Project'
    },
    open: {
      description: '{func} opens the project/account switcher'
    },
    close: {
      description: '{func} closes the project/account switcher'
    },
    removeCaretFromTarget: {
      description: '{func} removes caret from Target in the project/account switcher'
    },
    onClickOutside: {
      description: '{func} calls the provided callback when the switcher is open and the user clicks outside the switcher'
    },
    onClick: {
      description: '{func} calls the provided callback when user clicks on the switcher in the top nav'
    },
    children: {
      description: 'support adding Project and Account'
    }
  }
};

ProjectAccountSwitcherComponent.Account = AccountComponent;
ProjectAccountSwitcherComponent.Project = ProjectComponent;

export default ProjectAccountSwitcherComponent;