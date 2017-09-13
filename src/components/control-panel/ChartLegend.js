import React from 'react';
import PropTypes from 'prop-types';
import propEq from 'ramda/src/propEq';
import prop from 'ramda/src/prop';
import './ChartLegend.scss';

ChartLegend.propTypes = {
  toggleLegendField: PropTypes.func.isRequired,
  toggleStructureActive: PropTypes.func.isRequired,
  activeScene: PropTypes.object,
  legend: PropTypes.object.isRequired
};

function ChartLegend (props) {
  return (
    <div>
      <h4>Chart Legend</h4>
      <div>

        <div>
          <button
            onClick={() => props.toggleLegendField('totalLoad')}
            className={"button totalLoad is-small" + (props.legend.totalLoad ? '' : ' is-inverted')}>
            Total Load
          </button>
        </div>

        <div>
          <button
            onClick={() => props.toggleLegendField('totalGeneration')}
            className={"button totalGen is-small" + (props.legend.totalGeneration ? '' : ' is-inverted')}>
            Total Generation
          </button>
        </div>

        {
          props.activeScene.structureTiles.filter(prop('buffer')).length > 0 &&
          <div>
            <button
              onClick={() => props.toggleLegendField('buffer')}
              className={"button buffer is-small" + (props.legend.buffer ? '' : ' is-inverted')}>
              Battery Buffer
            </button>
          </div>
        }

        {
          props.activeScene.structureTiles.filter(prop('storage')).length > 0 &&
          <div>
            <button
              onClick={() => props.toggleLegendField('storage')}
              className={"button storage is-small" + (props.legend.storage ? '' : ' is-inverted')}>
              Battery Storage
            </button>
          </div>
        }

        {props.activeScene.structureTiles
          .map((s, i) => (
            <div key={i} style={{display: propEq('category', 'generator', s) ? 'auto' : 'none'}}>
              <button
                onClick={() => props.toggleStructureActive(i)}
                className={"button is-small " + s.tag + (s.active ? '' : ' is-inverted')}>
                {s.name}
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default ChartLegend;
