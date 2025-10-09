import React from 'react';

import woodIcon from '../../../assets/img/icon/icon_wood.png';
import wineIcon from '../../../assets/img/icon/icon_wine.png';
import marbleIcon from '../../../assets/img/icon/icon_marble.png';
import glassIcon from '../../../assets/img/icon/icon_glass.png';
import sulfurIcon from '../../../assets/img/icon/icon_sulfur.png';

type Resource = 'wood' | 'wine' | 'marble' | 'glass' | 'sulfur';

type MoveResourcesProps = {
  resources?: Resource[];
};

const icons: Record<Resource, string> = {
  wood: woodIcon,
  wine: wineIcon,
  marble: marbleIcon,
  glass: glassIcon,
  sulfur: sulfurIcon,
};

const MoveResources: React.FC<MoveResourcesProps> = ({
  resources = ['wood', 'wine', 'marble', 'glass', 'sulfur'],
}) => {
  return (
    <div className="px-5 space-y-3">
      {resources.map((res) => (
        <div key={res} className="flex items-center space-x-3 h-10">
          <div className="flex-1 flex items-center space-x-2">
            <img src={icons[res]} alt={res} className="w-6 h-6" />
            {/* <ResourceSlider
              value={50}
              max={100}
              className="flex-1"
              thumbClassName="bg-gray-500 w-4 h-4 rounded"
              trackClassName="bg-gray-300 h-2 rounded"
            /> */}
          </div>
          <div className="flex-1 flex items-center space-x-2">
            <button className="btn-general px-3 py-1 border rounded" title="Minimo">
              -
            </button>
            <button className="btn-general px-3 py-1 border rounded" title="Maximo">
              +
            </button>
            <input
              type="text"
              className="border rounded w-16 text-center"
              value={50}
              readOnly
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MoveResources;