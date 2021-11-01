import React, { useState } from 'react';
import { Tooltip, TooltipProps } from '@mui/material';

interface ChildProps {
  copy: (content: string) => void;
}

interface CopyToClipBoardProps {
  TooltipProps?: Partial<TooltipProps>;
  successMessage: string;
  errorMessage: string;
  children: (props: ChildProps) => React.ReactElement;
}

export const CopyToClipBoard: React.FC<CopyToClipBoardProps> = React.memo(
  ({
    TooltipProps = {},
    successMessage,
    errorMessage,
    children,
  }): JSX.Element => {
    const [title, setTitle] = useState<string>('');
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    const onCopy = async (content: string) => {
      try {
        navigator.clipboard.writeText(content);
        setTitle(successMessage);
        setShowTooltip(true);
      } catch {
        setTitle(errorMessage);
        setShowTooltip(true);
      }
    };

    const handleOnTooltipClose = () => {
      setShowTooltip(false);
    };

    return (
      <Tooltip
        title={title}
        open={showTooltip}
        onClose={handleOnTooltipClose}
        {...TooltipProps}>
        {children({ copy: onCopy })}
      </Tooltip>
    );
  }
);

CopyToClipBoard.displayName = 'CopyToClipBoard';
