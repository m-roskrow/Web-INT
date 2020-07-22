import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { useEffect } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function RuleAddButton(props) {
  const [open, setOpen] = React.useState(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  const handleClose = () => {
    props.informClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="help-dialog"
        aria-describedby="help-dialog-description"
      >
        <DialogTitle id="help-dialog">{"Help"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="help-dialog-description">
            Interaction Net: An Interaction Net is made up of 3 sub-lists:
            Agents, Rules and Connections. Rules govern reductions between
            Connected Agents.
          </DialogContentText>
          <DialogContentText id="help-dialog-description2">
            Agents: An Agent is represented by a purple rectangle, they can be
            connected to one another by clicking their Ports (coloured circles).
            Agents are made up of a name and an arity (their number of
            non-principle Ports).
          </DialogContentText>
          <DialogContentText id="help-dialog-description3">
            Rules: A Rule describes the interaction between two Agents connected
            by their principle Ports (shown as their bottom Ports), it is made
            up of
          </DialogContentText>
          <DialogContentText id="help-dialog-description4">
            Connections: A Connection describes a link between two Agents, and
            is represented by a coloured line to the Port that the Agent is
            Connected through.
          </DialogContentText>
          <DialogContentText id="help-dialog-description5">
            Reductions: Reductions can be triggered by pressing the "play"
            button in the bottom right. This will search for a valid reduction
            in the Net and perform it if there is one present.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
