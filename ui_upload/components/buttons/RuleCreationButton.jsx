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
import Typography from "@material-ui/core/Typography";
import { useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
    minHeight: 100,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function RuleCreationButton(props) {
  const [open, setOpen] = React.useState(false);
  const [agent1, setAgent1] = React.useState("");
  const [agent2, setAgent2] = React.useState("");
  const [agents, setAgents] = React.useState(
    JSON.parse(localStorage.getItem("agents"))
  );
  const [cons, setCons] = React.useState([]);
  const [agent1Ports, setAgent1Ports] = React.useState([]);
  const [agent2Ports, setAgent2Ports] = React.useState([]);
  const [rNet1, setRNet1] = React.useState([]);
  const [freeports, setFreeports] = React.useState([]);
  const classes = useStyles();

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  const handleClose = () => {
    setOpen(false);
    setRNet1([]);
    setAgent1("");
    setAgent2("");
    setAgents([]);
    setAgent1Ports([]);
    setAgent2Ports([]);
    setFreeports([]);
    informClose();
  };

  const informClose = () => {
    props.informClose(false);
  };

  const addRule = () => {
    props.handleInput(agent1, agent2, [findAgs(rNet1), cons, freeports]);
    handleClose();
  };

  const genAgentList = () => {
    if (open) {
      var ags = agents;
      if (ags === null) return [];
      else {
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
      }
    } else {
      return [];
    }
  };

  const findAg = (ags, name) => {
    var ag;
    for (let i = 0; i < ags.length; i++) {
      if (ags[i][1] === name) {
        ag = ags[i];
      }
    }
    return ag;
  };

  const genFreePortList = () => {
    var ags = agents;
    if (ags === null) return [];
    var list = [];
    var ag1 = agent1;
    var ag2 = agent2;

    if (ag1 === undefined || ag2 === undefined) {
      return [];
    }
    for (let i = 1; i <= ag1[0]; i++) {
      var free = genFreeportMenu(i);
      list.push(
        <FormControl className={classes.formControl} key={"ag1" + i}>
          <InputLabel key={"input1" + i} id={"port" + i}>
            Agent 1 Port {i}
          </InputLabel>
          <Select
            onChange={handleChange4}
            key={"ag1port" + i}
            value={agent1Ports[i][1]}
            labelId={"port" + i}
          >
            {free}
          </Select>
        </FormControl>
      );
    }
    for (let i = 1; i <= ag2[0]; i++) {
      var free2 = genFreeportMenu(i);
      list.push(
        <FormControl className={classes.formControl} key={"ag2" + i}>
          <InputLabel key={"input2" + i} id={"port2" + i}>
            Agent 2 Port {i}
          </InputLabel>
          <Select
            onChange={handleChange5}
            key={"ag2port" + i}
            value={agent2Ports[i][1]}
            labelId={"port2" + i}
          >
            {free2}
          </Select>
        </FormControl>
      );
    }
    return list;
  };

  const findAgs = (input) => {
    var ags = [];
    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < agents.length; j++) {
        if (input[i] === agents[j][1]) ags.push(agents[j]);
      }
    }
    return ags;
  };

  const genFreeportMenu = (input) => {
    var freeport = [];
    var ags = findAgs(rNet1);
    if (ags === []) return;
    for (let i = 0; i < ags.length; i++) {
      for (let j = 0; j < ags[i][2].length; j++) {
        freeport.push(
          <MenuItem value={[ags[i], ags[i][2][j], input]} key={i + ":" + j}>
            Agent Name: {ags[i][1]} Port: {ags[i][2][j]}
          </MenuItem>
        );
      }
    }
    return freeport;
  };

  const handleChange1 = (event) => {
    var ag1 = findAg(agents, event.target.value);
    setAgent1(ag1);
    var ag1ports = [];
    for (let i = 0; i <= ag1[0]; i++) {
      ag1ports.push("");
    }
    setAgent1Ports(ag1ports);
  };

  const handleChange2 = (event) => {
    var ag2 = findAg(agents, event.target.value);
    setAgent2(ag2);
    var ag2ports = [];
    for (let i = 0; i <= ag2[0]; i++) {
      ag2ports.push("");
    }
    setAgent2Ports(ag2ports);
  };

  const handleChange3 = (event) => {
    var newR = event.target.value;
    setRNet1(newR);
  };

  const handleChange4 = (event) => {
    var input = event.target.value;
    var free = freeports;
    free.push([agent1, input[2], input[0], input[1]]);
    setFreeports(free);
    var ports = agent1Ports;
    ports[input[2]] = input;
    setAgent1Ports(ports);
  };

  const handleChange5 = (event) => {
    var input = event.target.value;
    var free = freeports;
    free.push([agent2, input[2], input[0], input[1]]);
    setFreeports(free);
    var ports = agent2Ports;
    ports[input[2]] = input;
    setAgent2Ports(ports);
  };

  const handleConnection = (event) => {
    console.log("not yet implemented");
  };

  const refresh = () => {
    setAgents(JSON.parse(localStorage.getItem("agents")));
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
        fullScreen
      >
        <DialogTitle id="rule-wizard">{"Rule Creation Wizard"}</DialogTitle>
        <DialogContent>
          <Button onClick={refresh}>Refresh Agent List</Button>
          <DialogContentText id="rule-wizard-description">
            To create a Rule the following 3 properties need to be specified:
            Agent 1, Agent 2 and RNet. An RNet is specified by the agents that
            make it up, any connections between these agents and a map of ports
            from the original agents to the new agents.
          </DialogContentText>

          <FormControl className={classes.formControl}>
            <InputLabel id="agent1-select-label">Agent 1</InputLabel>
            <Select
              labelId="agent1-select-label"
              id="agent1-select"
              value={agent1[1] ? agent1[1] : ""}
              onChange={handleChange1}
            >
              {genAgentList()}
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="agent2-select-label">Agent 2</InputLabel>
            <Select
              labelId="agent2-select-label"
              id="agent2-select"
              value={agent2[1] ? agent2[1] : ""}
              onChange={handleChange2}
            >
              {genAgentList()}
            </Select>
          </FormControl>
          <Typography>RNet Creation</Typography>
          <DialogContentText id="rule-wizard-description">
            Please select the agents that will be present in the post-reduction
            resultant net:
          </DialogContentText>
          <FormControl className={classes.formControl}>
            <InputLabel id="multiple-agent-select">
              Select Agents from Saved Agents
            </InputLabel>
            <Select
              labelId="multiple-agent-select-label"
              id="multiple-agent-select"
              multiple={true}
              value={rNet1}
              onChange={handleChange3}
            >
              {genAgentList()}
            </Select>
          </FormControl>
          <DialogContentText id="rule-wizard-description">
            Please specify any connections which should be made within the
            resultant net:
          </DialogContentText>
          <Button onClick={handleConnection}>Add Connection</Button>
          <DialogContentText id="rule-wizard-description">
            Please choose which port from the new selected agent list each of
            the original two agents port's will now map to:
          </DialogContentText>
          {genFreePortList()}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={addRule} color="primary">
            Save and Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
