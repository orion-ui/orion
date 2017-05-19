import { mount } from 'enzyme';
import * as HIG from 'hig.web';
import React from 'react';

import GlobalNav from './GlobalNav';
import Group from './Group';
import Item from './Item';

const Context = props => {
  const { children, ...rest } = props;

  return (
    <GlobalNav>
      <GlobalNav.SideNav>
        <GlobalNav.SideNav.SectionList>
          <GlobalNav.SideNav.SectionList.Item>
            <Group>{props.children}</Group>
          </GlobalNav.SideNav.SectionList.Item>
        </GlobalNav.SideNav.SectionList>
      </GlobalNav.SideNav>
    </GlobalNav>
  );
};

function higContext() {
  const higContainer = document.createElement('div');

  // use spread here to clone defaults since HIG.Button mutates this object
  const higNav = new HIG.GlobalNav();

  higNav.mount(higContainer);

  const higSideNav = new higNav.partials.SideNav();
  higNav.addSideNav(higSideNav);

  const higSection = new higSideNav.partials.Section({});

  higSideNav.addSection(higSection);

  const higGroup = new higSection.partials.Group();

  higSection.addGroup(higGroup);

  return { higNav, higSideNav, higSection, higGroup, higContainer };
}

describe('<Group>', () => {
  describe('children: <Item>', () => {
    it('can render a list of <Item> elements', () => {
      const { higGroup, higContainer } = higContext();

      const item1Defaults = {
        icon: 'project-management',
        title: 'Item 1',
        link: '#'
      };
      const item1 = new higGroup.partials.Item(item1Defaults);
      higGroup.addItem(item1);

      const item2Defaults = {
        icon: 'project-management',
        title: 'Item 2',
        link: '#'
      };
      const item2 = new higGroup.partials.Item(item2Defaults);
      higGroup.addItem(item2);

      const reactContainer = document.createElement('div');

      const wrapper = mount(
        <Context>
          <Item {...item1Defaults} />
          <Item {...item2Defaults} />
        </Context>,
        {
          attachTo: reactContainer
        }
      );

      expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

      expect(reactContainer.firstChild.outerHTML).toEqual(
        higContainer.firstChild.outerHTML
      );
    });

    it('can insert <Item> elements before and after another <Item>', () => {
      const { higGroup, higContainer } = higContext();

      const item1Defaults = {
        icon: 'project-management',
        title: 'Item 1',
        link: '#'
      };
      const item1 = new higGroup.partials.Item(item1Defaults);

      // Do not add yet

      const item2Defaults = {
        icon: 'project-management',
        title: 'Item 2',
        link: '#'
      };
      const item2 = new higGroup.partials.Item(item2Defaults);
      higGroup.addItem(item2);

      // Add before item 2
      higGroup.addItem(item1, item2);

      class CustomComponent extends React.Component {
        constructor(props) {
          super(props);
          this.state = { showingItemBefore: false, showingItemAfter: false };
        }

        render() {
          return (
            <Context>
              {this.state.showingItemBefore && <Item {...item1Defaults} />}
              <Item {...item2Defaults} />
              {this.state.showingItemAfter && <Item />}
            </Context>
          );
        }
      }

      const reactContainer = document.createElement('div');
      const wrapper = mount(<CustomComponent />, {
        attachTo: reactContainer
      });

      expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

      wrapper.setState({ showingItemBefore: true });

      expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

      expect(reactContainer.firstChild.outerHTML).toEqual(
        higContainer.firstChild.outerHTML
      );

      wrapper.setState({ showingItemBefore: false });

      expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

      wrapper.setState({ showingItemAfter: true });

      expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

      wrapper.setState({ showingItemAfter: false });

      expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();
    });

    it('can not render HTML elements as children', () => {
      global.console.error = jest.fn();

      mount(
        <Context>
          <div>Hello world!</div>
        </Context>
      );

      expect(console.error).toBeCalledWith(
        expect.stringMatching(
          /'div' is not a valid child of Group. Children should be of type 'Item'/
        )
      );
    });

    it('can not render HTML text as children', () => {
      global.console.error = jest.fn();

      mount(
        <Context>
          Hello world!
        </Context>
      );

      expect(console.error).toBeCalledWith(
        expect.stringMatching(
          /'Hello world!' is not a valid child of Group. Children should be of type 'Item'/
        )
      );
    });
  });
});
