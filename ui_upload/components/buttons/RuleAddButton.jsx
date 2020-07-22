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

export default function RuleAddButton(props) {
  const [open, setOpen] = React.useState(false);
  const [rule, setRule] = React.useState("");

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
    props.handleInput(rule[0], rule[1], rule[2]);
    handleClose();
  };

  const genRuleList = () => {
    var ags = JSON.parse(localStorage.getItem("rules"));
    if (ags === null) return [];
    var i;
    var list = [];
    for (i = 0; i < ags.length; i++) {
      list.push(
        <MenuItem value={ags[i]} key={i}>
          {"Rule between " + ags[i][0][1] + " and " + ags[i][1][1]}
        </MenuItem>
      );
    }
    return list;
  };

  const handleChange = (event) => {
    setRule(event.target.value);
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
          {"Add Rule from Saved Rules"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="rule-wizard-description">
            Select a previously saved rule to add to the current net
          </DialogContentText>
          <InputLabel id="agent1-select-label">
            Please Select A Saved Rule
          </InputLabel>
          <Select
            labelId="agent1-select-label"
            id="agent1-select"
            value={rule}
            onChange={handleChange}
            fullWidth
            variant="outlined"
          >
            {genRuleList()}
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
