import React from "react";

import seafaringImg from "@/assets/img/icon/area_seafaring.jpg";
import economyImg from "@/assets/img/icon/area_economy.jpg";
import knowledgeImg from "@/assets/img/icon/area_knowledge.jpg";
import militaryImg from "@/assets/img/icon/area_military.jpg";

interface CategoriasProps {
  changeCategory: (id: number) => void;
}

const Categorias: React.FC<CategoriasProps> = ({ changeCategory }) => {
  const categorias = [
    { id: 1, img: seafaringImg },
    { id: 2, img: economyImg },
    { id: 3, img: knowledgeImg },
    { id: 4, img: militaryImg },
  ];

  return (
    <div className="box text-[0.83rem]">
      {categorias.map((cat) => (
        <div key={cat.id} className="mb-2 categoria cursor-pointer">
          <div onClick={() => changeCategory(cat.id)}>
            <img src={cat.img} alt={`Category ${cat.id}`} className="w-full h-auto select-none" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categorias;