import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import "../../../styles/setting-styles/Account.css";
import { DelNeg, Delete } from '../../../styles/setting-styles/AccountStyles';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
}));

function DeleteAccount(props:any) {
  const classes = useStyles();
  const { title, open, onClose,handleDelete } = props;

  const handleClose = () => {
    onClose(false);
  };

  const handleConfirm = () => {
    onClose(true);
  };

  return (
    <Dialog open={open} onClose={handleClose} className='dialog-box-account' >
      <DialogTitle className='dialog-title'>Delete Account</DialogTitle>
      <DialogContent className='dialog-style' >
      Are you sure want to delete the account, all your data will be lost.
      </DialogContent>
      <DialogActions className='dialog-action'>
        <Button className="delete-button" onClick={handleDelete} color="primary" style={{textTransform:"none"}}>
          Yes, Delete
        </Button>
        <Button className="delete-cancel" onClick={handleConfirm} color="primary" style={{textTransform:"none"}}>
          I'm staying
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteAccount.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleDelete:PropTypes.func.isRequired,
};

export default DeleteAccount;
