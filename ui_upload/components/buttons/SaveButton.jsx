import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { useEffect } from "react";
import { TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
//component which handles saving Nets, with error handling for name choices to stop multiple nets of the same name being used
export default function SaveButton(props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [nameError, setNameError] = React.useState("");

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  const handleClose = () => {
    informClose();
  };

  const informClose = () => {
    props.informClose(false);
  };

  const saveNet = () => {
    if (nameError === "") {
      props.handleInput(name);
      handleClose();
    }
  };

  const getNames = () => {
    var nets = JSON.parse(localStorage.getItem("nets"));
    if (nets === null) return [];
    var i;
    var names = [];
    for (i = 0; i < nets.length; i++) {
      names.push(nets[i][0]);
    }
    return names;
  };

  const checkError = (name) => {
    var names = getNames;
    for (let i = 0; i < names.length; i++) {
      if (name === names[i]) {
        setNameError("Name already in use");
      }
    }
  };

  const handleChange = (event) => {
    setName(event.target.value);
    checkError(event.target.value);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="save-button"
        aria-describedby="save-button-description"
      >
        <DialogTitle id="save-button">{"Save Interaction Net"}</DialogTitle>
        <DialogContent>
          <InputLabel id="agent1-select-label">
            Please choose a name for the current net
          </InputLabel>
          <Typography variant="caption" color="secondary">
            {nameError}
          </Typography>
          <TextField onChange={handleChange}></TextField>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={saveNet} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
