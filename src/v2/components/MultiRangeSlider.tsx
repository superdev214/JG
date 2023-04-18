import './MultiRangeSlider.css';

import classnames from 'classnames';
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface MultiRangeSliderProps {
  min: number;
  max: number;
  lowValue: number;
  highValue: number;
  onChange: Function;
}

const MultiRangeSlider: FC<MultiRangeSliderProps> = ({
  highValue,
  lowValue,
  max,
  min,
  onChange,
}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const [minTmp, setMinTmp] = useState(min);
  const [maxTmp, setMaxTmp] = useState(max);
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value); // Precede with '+' to convert the value from type string to type number

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ max: maxVal, min: minVal });
  }, [minVal, maxVal, onChange]);

  useEffect(() => {
    setMinVal(lowValue);
    setMaxVal(highValue);
    setMinTmp(lowValue);
    setMaxTmp(highValue);
  }, [lowValue, highValue]);

  return (
    <div className="slider-container">
      <input
        ref={minValRef}
        className={classnames('thumb thumb--zindex-3', {
          'thumb--zindex-5': minVal > max - 100,
        })}
        max={max}
        min={min}
        type="range"
        value={minTmp}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const value = Math.min(+e.target.value, maxVal - 1);
          setMinTmp(value);
        }}
        onMouseUp={(e: any) => {
          setMinVal(minTmp);
          e.target.value = minTmp.toString();
        }}
        onTouchEnd={(e: any) => {
          setMinVal(minTmp);
          e.target.value = minTmp.toString();
        }}
      />
      <input
        ref={maxValRef}
        className="thumb thumb--zindex-4"
        max={max}
        min={min}
        type="range"
        value={maxTmp}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const value = Math.max(+e.target.value, minVal + 1);
          setMaxTmp(value);
        }}
        onMouseUp={(e: any) => {
          setMaxVal(maxTmp);
          e.target.value = maxTmp.toString();
        }}
        onTouchEnd={(e: any) => {
          setMaxVal(maxTmp);
          e.target.value = maxTmp.toString();
        }}
      />

      <div className="slider">
        <div className="slider__track"></div>
        <div ref={range} className="slider__range"></div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
