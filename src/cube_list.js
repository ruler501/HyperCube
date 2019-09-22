import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import CardModalForm from './components/CardModalForm';
import CubeListNavbar from './components/CubeListNavbar';
import CurveView from './components/CurveView';
import DisplayContext from './components/DisplayContext';
import DynamicFlash from './components/DynamicFlash';
import GroupModal from './components/GroupModal';
import ListView from './components/ListView';
import SortContext from './components/SortContext';
import TableView from './components/TableView';
import TagContext from './components/TagContext';
import VisualSpoiler from './components/VisualSpoiler';

class CubeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: this.props.defaultCards,
      cubeView: 'table',
      openCollapse: null,
    };

    this.changeCubeView = this.changeCubeView.bind(this);
    this.setOpenCollapse = this.setOpenCollapse.bind(this);

    /* global */
    updateCubeListeners.push(cards => this.setState({ cards }));

    /* global */
    editListeners.push(() => this.setState({ openCollapse: 'edit' }));
  }

  componentDidMount() {
    /* global */
    autocard_init('autocard');
  }

  componentDidUpdate() {
    /* global */
    autocard_init('autocard');
  }

  changeCubeView(cubeView) {
    this.setState({ cubeView });
  }

  setOpenCollapse(collapseFunction) {
    this.setState(({ openCollapse }) => ({
      openCollapse: collapseFunction(openCollapse),
    }));
  }

  render() {
    const { cubeID, canEdit } = this.props;
    const { cards, cubeView, openCollapse } = this.state;
    const defaultTagSet = new Set([].concat.apply([], cards.map(card => card.tags)));
    const defaultTags = [...defaultTagSet].map(tag => ({
      id: tag,
      text: tag,
    }))
    return (
      <SortContext.Provider>
        <DisplayContext.Provider>
          <TagContext.Provider defaultTags={defaultTags}>
            <CardModalForm canEdit={canEdit}>
              <GroupModal cubeID={cubeID} canEdit={canEdit} setOpenCollapse={this.setOpenCollapse}>
                <CubeListNavbar
                  canEdit={canEdit}
                  cubeID={cubeID}
                  cubeView={cubeView}
                  changeCubeView={this.changeCubeView}
                  openCollapse={openCollapse}
                  setOpenCollapse={this.setOpenCollapse}
                  hasCustomImages={cards.some(card => card.imgUrl)}
                />
                <DynamicFlash />
                {{
                  'table': <TableView cards={cards} />,
                  'spoiler': <VisualSpoiler cards={cards} />,
                  'curve': <CurveView cards={cards} />,
                  'list': <ListView cubeID={cubeID} cards={cards} />,
                }[cubeView]}
              </GroupModal>
            </CardModalForm>
          </TagContext.Provider>
        </DisplayContext.Provider>
      </SortContext.Provider>
    );
  }
}

const cube = JSON.parse(document.getElementById('cuberaw').value);
cube.forEach((card, index) => {
  card.index = index;
  cubeDict[index] = card;
});
const cubeID = document.getElementById('cubeID').value;
const canEdit = document.getElementById('canEdit').value === 'true';
const wrapper = document.getElementById('react-root');
const element = <CubeList defaultCards={cube} canEdit={canEdit} cubeID={cubeID} />;
wrapper ? ReactDOM.render(element, wrapper) : false;
