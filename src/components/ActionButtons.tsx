import React from 'react';
import { Box, Button } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';

interface ActionButtonsProps {
  onCopy?: () => void;
  onSave?: () => void;
  onDownload?: () => void;
  disabled?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCopy,
  onSave,
  onDownload,
  disabled = false
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      <Button
        variant="outlined"
        startIcon={<ContentCopyIcon />}
        onClick={onCopy}
        disabled={disabled}
      >
        Copy
      </Button>
      <Button
        variant="outlined"
        startIcon={<SaveIcon />}
        onClick={onSave}
        disabled={disabled}
      >
        Save
      </Button>
      <Button
        variant="outlined"
        startIcon={<DownloadIcon />}
        onClick={onDownload}
        disabled={disabled}
      >
        Download
      </Button>
    </Box>
  );
};

export default ActionButtons; 