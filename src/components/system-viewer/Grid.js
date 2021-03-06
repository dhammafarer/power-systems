/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import { zipGridPtsPolygonPts } from '../../helpers/svg-helpers.js';
import './Grid.scss';

Grid.propTypes = {
  grid: PropTypes.object.isRequired
};

function Grid ({grid}) {
  return (
    <div className='Grid'>
      <svg>
        {zipGridPtsPolygonPts(grid).map(([gp, pp]) =>
          <polygon className="GridTile"
            key={gp}
            points={pp}/>
        )}
      </svg>
    </div>
  );
}

export default Grid;
