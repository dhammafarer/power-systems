import React from 'react';
import PropTypes from 'prop-types';
import tile from '../../lib/tile.js';
import * as tt from '../../data/terrain-textures.js';
import values from 'ramda/src/values';
import './TileEditor.scss';

class TileEditor extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      type: 'structureTiles',
      texture: {},
      data: {}
    };

    this.saveTerrainTile = this.saveTerrainTile.bind(this);
    this.saveStructureTile = this.saveStructureTile.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.setActiveType = this.setActiveType.bind(this);
  }

  saveStructureTile () {
    const {texture, data} = this.state;
    const position = this.props.activeTile;
    this.props.saveTile({
      type: 'structureTiles',
      tile: tile({texture, position, data})
    });
  }

  saveTerrainTile (texture) {
    const position = this.props.activeTile;
    this.props.saveTile({
      type: 'terrainTiles',
      tile: tile({texture, position})
    });
  }

  closeModal () {
    this.props.resetActiveTile();
  }

  setActiveType (type) {
    this.setState({type});
  }

  render () {
    return (
      <div className="TileEditor">
        <div className="TileEditor__Background"
          onClick={this.props.resetActiveTile}
        >
        </div>
        <div className="TileEditor__Content">
          <div>
            <button onClick={() => this.setActiveType('terrainTiles')}>Terrain</button>
            <button onClick={() => this.setActiveType('structureTiles')}>Structures</button>
          </div>

          { this.state.type == 'terrainTiles' &&
            <div>
              <h3>Terrain</h3>
              <div>
                {values(tt).map((t,i) =>
                  <span key={i}
                    onClick={() => this.saveTerrainTile(t)}
                  >
                    <img src={require('../../assets/' + t.filename)}/>
                  </span>
                )}
              </div>
            </div>
          }

          { this.state.type == 'structureTiles' &&
            <div>
              <h3>Structures</h3>
            </div>
          }

          <div>
            <button onClick={this.closeModal}>Cancel</button>
          </div>

        </div>
      </div>
    );
  }
}

TileEditor.propTypes = {
  saveTile: PropTypes.func.isRequired,
  resetActiveTile: PropTypes.func.isRequired,
  terrainTile: PropTypes.object,
  structureTile: PropTypes.object,
  activeTile: PropTypes.object.isRequired
};

export default TileEditor;
