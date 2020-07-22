import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { useEffect } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AgentCreationButton(props) {
  const [open, setOpen] = React.useState(false);
  const [arity, setArity] = React.useState(0);
  const [name, setName] = React.useState("");
  const [errorArity, setErrorArity] = React.useState("");
  const [errorName, setErrorName] = React.useState("Please enter a name");
  const [nameLength, setNameLength] = React.useState("");

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  const handleClose = () => {
    setOpen(false);
    informClose();
  };

  const informClose = () => {
    props.informClose(false);
  };

  const handleArityChange = (e) => {
    var newar = e.target.value;
    if (newar >= 0 && newar <= 20) {
      setArity(newar);
      setErrorArity("");
      checkLength();
    } else {
      setArity(newar);
      setErrorArity("Please enter a value between 0 and 20");
    }
  };
  const handleNameChange = (e) => {
    var letterNumber = /^[0-9a-zA-Z]+$/;
    var inputText = e.target.value;
    if (inputText.match(letterNumber)) {
      setName(inputText);
      setErrorName("");
      checkLength();
    } else {
      setName(inputText);
      setErrorName("Please enter alphanumeric characters only");
    }
  };

  const addAgentNS = () => {
    if (errorArity === "" && errorName === "") {
      props.handleInput(arity, name, false);
      handleClose();
    }
  };
  const addAgentS = () => {
    if (errorArity === "" && errorName === "") {
      props.handleInput(arity, name, true);
      handleClose();
    }
  };

  const checkLength = () => {
    if ((arity === 0 && name.length > 5) || arity * 5 < name.length) {
      setNameLength("WARNING: name will not fit within agent");
    } else {
      setNameLength("");
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="agent-wizard"
        aria-describedby="agent-wizard-description"
      >
        <DialogTitle id="agent-wizard">{"Agent Creation Wizard"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="agent-wizard-description">
            Please choose the new agent's arity (number of non-principle ports)
            and name.
          </DialogContentText>
          <Typography variant="caption" color="secondary">
            {nameLength}
          </Typography>
          <TextField
            type="number"
            variant="outlined"
            autoFocus
            inputProps={{ min: 0, style: { textAlign: "center" } }} // the change is here
            margin="normal"
            id="agent-arity"
            label={"Agent Arity"}
            InputLabelProps={{
              shrink: true,
            }}
            color="primary"
            fullWidth
            value={arity}
            onChange={handleArityChange}
          />
          <Typography variant="caption" color="secondary">
            {errorArity}
          </Typography>
          <TextField
            autoFocus
            inputProps={{ style: { textAlign: "center" } }}
            margin="normal"
            variant="outlined"
            id="agent-name"
            label="Agent Name"
            type="name"
            color="primary"
            fullWidth
            value={name}
            onChange={handleNameChange}
          />
          <Typography variant="caption" color="secondary">
            {errorName}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addAgentNS} color="primary">
            Add
          </Button>
          <Button onClick={addAgentS} color="primary">
            Save and Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
