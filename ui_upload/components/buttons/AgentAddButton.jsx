import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import Slide from "@material-ui/core/Slide";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { useEffect } from "react";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AgentAddButton(props) {
  const [open, setOpen] = React.useState(false);
  const [agent, setAgent] = React.useState("");

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

  const addAgent = () => {
    var arity = getArity(agent);
    props.handleInput(arity, agent, false);
    handleClose();
  };

  const getArity = (name) => {
    var ags = JSON.parse(localStorage.getItem("agents"));
    var i;
    var arity = 0;
    for (i = 0; i < ags.length; i++) {
      if (ags[i][1] === name) {
        arity = ags[i][0];
      }
    }
    return arity;
  };

  const genAgentList = () => {
    var ags = JSON.parse(localStorage.getItem("agents"));
    if (ags === null) return [];
    var i;
    var list = [];
    for (i = 0; i < ags.length; i++) {
      list.push(
        <MenuItem value={ags[i][1]} key={i}>
          {ags[i][1] + "(" + ags[i][0] + ")"}
        </MenuItem>
      );
    }
    return list;
  };

  const handleChange = (event) => {
    setAgent(event.target.value);
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="rule-wizard"
        aria-describedby="rule-wizard-description"
      >
        <DialogTitle id="rule-wizard">
          {"Add Agent from Saved Agents"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="rule-wizard-description">
            Select a previously saved agent to add to the current net
          </DialogContentText>
          <InputLabel id="agent1-select-label">
            Please Select A Saved Agent
          </InputLabel>
          <Select
            labelId="agent1-select-label"
            id="agent1-select"
            value={agent}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          >
            {genAgentList()}
          </Select>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addAgent} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
