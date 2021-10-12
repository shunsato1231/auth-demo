import React, { ComponentProps, FC } from 'react';

export const combineComponents = (...components: FC[]): FC => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent) => {
      const combinedComponents = ({
        children,
      }: ComponentProps<FC>): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
      return combinedComponents;
    },
    ({ children }) => <>{children}</>
  );
};
