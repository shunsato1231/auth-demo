import { Box } from '@mui/material';
import React from 'react';

export interface SliderProps {
  activeStep: number;
}

export const Slider: React.FC<SliderProps> = React.memo(
  ({ children, activeStep }): JSX.Element => {
    const length = React.Children.count(children);
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}>
        <Box
          sx={{
            display: 'flex',
            width: length * 100 + '%',
            height: '100%',
            transition: 'transform 0.7s ease 0.2s',
            transform: `translateX(${(-100 / length) * (activeStep - 1)}%)`,
          }}>
          {React.Children.map(children, (item, index) => (
            <Box
              key={`slider-contents-${index}`}
              sx={{
                width: 100 / length + '%',
                height: '100%',
              }}>
              {item}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
);

Slider.displayName = 'Slider';
