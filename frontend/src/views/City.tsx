import DragToScroll from "../components/DragToScroll"
import Building from "../features/city/Building"
import CityImg from "./../assets/img/city/city.jpg"

const City = () => {
    return <div>
        <div className="cityContainer" v-dragscroll="true" v-autoscroll="'top center'">
            <DragToScroll className="scroll-container">
                <div className="city" style={{
                    backgroundImage: `url(${CityImg})`,
                }}>
                    <Building></Building>
                </div>
            </DragToScroll>
        </div>
    </div>
}

export default City;