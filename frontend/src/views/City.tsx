import DragToScroll from "../components/DragToScroll";
import Building from "../features/city/Building";
import Layout from "../features/layout/Layout";
import CityImg from "./../assets/img/city/city.jpg";

const City = () => {
  return (
    <>
      <Layout />
      <div className="cursor-all-scroll h-full w-full absolute overflow-hidden">
        <DragToScroll className="scroll-container">
          <div
            className="w-[2460px] h-[1794px] bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${CityImg})`,
            }}
          >
            <Building />
          </div>
        </DragToScroll>
      </div>
    </>
  );
};

export default City;