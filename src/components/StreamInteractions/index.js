import React from 'react';
import { FilterNameContainer } from '../../components/FilterName';
import { SortContainer } from '../../components/Sort';

function StreamInteractions() {
  return (
    <div className="stream-interactions">
      <div className="stream-interactions-item">
        <SortContainer />
      </div>
      <div className="stream-interactions-item">
        <FilterNameContainer />
      </div>
    </div>
  );
}

export {
  StreamInteractions,
};
