import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ClearIcon from "@material-ui/icons/Clear";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  content: string;

};

const PrivacyPolicy = ({ open, onClose, title, content }: Props) => {

  return (
    <Dialog
      className="dialog-box"
      open={open}
      onClose={onClose}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <div className="my-heading">
        <DialogTitle id="scroll-dialog-title">
                 {title}
        </DialogTitle>
        <Button onClick={onClose}>
          <ClearIcon />
        </Button>
      </div>
      <DialogContent className="DialogContent" >
        <DialogContentText
          className="DialogContentText"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </DialogContent>
    </Dialog>
  );
};
export default PrivacyPolicy;