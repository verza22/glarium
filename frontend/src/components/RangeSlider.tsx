
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';

interface RangeProps {
    value: number,
    setValue: (n: number) => void,
    max: number,
    min: number,
    step: number
}

const Range = ({value, setValue, max, min, step}: RangeProps) => {
    return <RangeSlider
    className="single-thumb"
    value={[min, value]}
    max={max}
    min={min}
    step={step}
    thumbsDisabled={[true, false]}
    rangeSlideDisabled={true}
    onInput={(response) => setValue(response[1])}
/>;
}

export default Range;