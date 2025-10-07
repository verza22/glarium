import React, { useState } from 'react';
import Ground from "./../../assets/img/city/ground.png"

interface ObjectPosition {
  top: number;
  left: number;
}

const Building: React.FC = () => {
  const [objects] = useState<ObjectPosition[]>([
    { top: 370, left: 1100 },
    { top: 350, left: 740 },
    { top: 258, left: 908 },
    { top: 250, left: 1285 },
    { top: 490, left: 1210 },
    { top: 545, left: 845 },
    { top: 430, left: 1395 },
    { top: 200, left: 1660 },
    { top: 160, left: 1490 },
    { top: 575, left: 1350 },
    { top: 330, left: 1700 },
    { top: 535, left: 1660 },
    { top: 575, left: 1080 },
    { top: 230, left: 700 },
    { top: 685, left: 900 },
  ]);

  return (
    <div className="divBuilds" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {objects.map((object, i) => (
        <div
          key={i}
          className="object"
          style={{
            position: 'absolute',
            top: object.top,
            left: object.left,
            width: 140,
            height: 125,
          }}
        >
          <img
            src={Ground}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      ))}
    </div>
  );
};

export default Building;