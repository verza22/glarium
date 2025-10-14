import React from 'react';

import Building1 from "./../assets/img/city/1.png"
import Building2 from "./../assets/img/city/2.png"
import Building3 from "./../assets/img/city/3.png"
import Building4 from "./../assets/img/city/4.png"
import Building5 from "./../assets/img/city/5.png"
import Building6 from "./../assets/img/city/6.png"
import Building7 from "./../assets/img/city/7.png"
import Building8 from "./../assets/img/city/8.png"
import Building9 from "./../assets/img/city/9.png"
import Building10 from "./../assets/img/city/10.png"
import Building11 from "./../assets/img/city/11.png"
import Building12 from "./../assets/img/city/12.png"
import Building13 from "./../assets/img/city/13.png"
import Building14 from "./../assets/img/city/14.png"
import Building15 from "./../assets/img/city/15.png"
import Building16 from "./../assets/img/city/16.png"
import Building17 from "./../assets/img/city/17.png"
import Building18 from "./../assets/img/city/18.png"
import Building19 from "./../assets/img/city/19.png"
import Building20 from "./../assets/img/city/20.png"

interface BuildingImageProps {
    buildingId: number
}

const BuildingImage: React.FC<BuildingImageProps> = ({ buildingId }) => {

    switch(buildingId){
        default:
        case 1: return <img src={Building1} style={{ width: '100%', height: '100%' }}/>
        case 2: return <img src={Building2} style={{ width: '100%', height: '100%' }}/>
        case 3: return <img src={Building3} style={{ width: '100%', height: '100%' }}/>
        case 4: return <img src={Building4} style={{ width: '100%', height: '100%' }}/>
        case 5: return <img src={Building5} style={{ width: '100%', height: '100%' }}/>
        case 6: return <img src={Building6} style={{ width: '100%', height: '100%' }}/>
        case 7: return <img src={Building7} style={{ width: '100%', height: '100%' }}/>
        case 8: return <img src={Building8} style={{ width: '100%', height: '100%' }}/>
        case 9: return <img src={Building9} style={{ width: '100%', height: '100%' }}/>
        case 10: return <img src={Building10} style={{ width: '100%', height: '100%' }}/>
        case 11: return <img src={Building11} style={{ width: '100%', height: '100%' }}/>
        case 12: return <img src={Building12} style={{ width: '100%', height: '100%' }}/>
        case 13: return <img src={Building13} style={{ width: '100%', height: '100%' }}/>
        case 14: return <img src={Building14} style={{ width: '100%', height: '100%' }}/>
        case 15: return <img src={Building15} style={{ width: '100%', height: '100%' }}/>
        case 16: return <img src={Building16} style={{ width: '100%', height: '100%' }}/>
        case 17: return <img src={Building17} style={{ width: '100%', height: '100%' }}/>
        case 18: return <img src={Building18} style={{ width: '100%', height: '100%' }}/>
        case 19: return <img src={Building19} style={{ width: '100%', height: '100%' }}/>
    } 
};

export default BuildingImage;