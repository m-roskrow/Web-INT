import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { useEffect } from "react";
import { Select, MenuItem } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import InputLabel from "@material-ui/core/InputLabel";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
//component which handles saving Nets, with error handling for name choices to stop multiple nets of the same name being used
export default function LoadButton(props) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [nameEr, setNameEr] = React.useState("Please select a net");

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  const handleClose = () => {
    informClose();
  };

  const informClose = () => {
    props.informClose(false);
  };

  const loadNet = () => {
    if (!(name === "")) {
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

  const genMenuOptions = () => {
    var names = getNames();
    var list = [];
    for (let i = 0; i < names.length; i++) {
      list.push(
        <MenuItem key={i} value={names[i]}>
          {names[i]}
        </MenuItem>
      );
    }
    return list;
  };

  const handleChange = (event) => {
    setName(event.target.value);
    setNameEr("");
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
        <DialogTitle id="save-button">{"Load Interaction Net"}</DialogTitle>
        <DialogContent>
          <InputLabel id="agent1-select-label">
            Please Select A Saved Net to load (WARNING: current Net will be
            cleared)
          </InputLabel>
          <Typography variant="caption" color="secondary">
            {nameEr}
          </Typography>
          <Select onChange={handleChange} value={name}>
            {genMenuOptions()}
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={loadNet} color="primary">
            Load
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
