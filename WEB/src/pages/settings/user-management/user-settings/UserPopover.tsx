import React from 'react';
import { IconButton, Popover, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface UserPopoverProps {
  user: any;
  open:boolean;
}

const UserPopover: React.FC<any> = ({ open }) => {
  const handleEdit = () => {
   
  };

  const handleDelete = () => {
   
  };

  const handleActivate = () => {
   
  };

  return (
    <div>
      <IconButton
        size="small"
        onClick={(e) => e.stopPropagation()}
      >
        <MoreVertIcon />
      </IconButton>
      <Popover
        open={open}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
        <MenuItem onClick={handleActivate}>Activate</MenuItem>
      </Popover>
    </div>
  );
};

export default UserPopover;
