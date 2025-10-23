import React from 'react';
import { useTranslation } from 'react-i18next';

import iconGlass from '../assets/img/icon/icon_glass.png';
import iconGold from '../assets/img/icon/icon_upkeep.png';
import iconMarble from '../assets/img/icon/icon_marble.png';
import iconPopulation from '../assets/img/icon/icon_citizen.png';
import iconSulfur from '../assets/img/icon/icon_sulfur.png';
import iconTimec from '../assets/img/icon/icon_time.png';
import iconWine from '../assets/img/icon/icon_wine.png';
import iconWood from '../assets/img/icon/icon_wood.png';

export type ResourceType = 
  | 'glass'
  | 'gold'
  | 'marble'
  | 'population'
  | 'sulfur'
  | 'timec'
  | 'wine'
  | 'wood';

type ResourceItemProps = {
  type: ResourceType;
  amount: number;
  visible?: boolean;
  disabled?: boolean;
};

const icons: Record<ResourceType, string> = {
  glass: iconGlass,
  gold: iconGold,
  marble: iconMarble,
  population: iconPopulation,
  sulfur: iconSulfur,
  timec: iconTimec,
  wine: iconWine,
  wood: iconWood,
};

const ResourceItem: React.FC<ResourceItemProps> = ({
  type,
  amount,
  visible = false,
  disabled = false,
}) => {
  const { t } = useTranslation();

  if (!(amount > 0 || visible || disabled)) return null;

  return (
    <div className="inline-block" title={t(`resources.${type}`)}>
      <img
        src={icons[type]}
        className={`m-auto ${disabled && amount === 0 ? 'opacity-50' : ''}`}
        alt={t(`resources.${type}`)}
      />
      <span className="ml-1">{amount}</span>
    </div>
  );
};

export default ResourceItem;