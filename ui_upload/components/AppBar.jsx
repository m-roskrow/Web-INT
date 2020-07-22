import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import SideBar from "./SideBar";
import AddList from "./AddList";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import FastForwardIcon from "@material-ui/icons/FastForward";

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: "auto",
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: "right",
    zIndex: 1,
    top: -30,
    margin: "0 auto",
  },
}));

export default function BottomAppBar(props) {
  const classes = useStyles();
  const [reduce, setReduce] = React.useState(false);

  const handleAgentDetails = (arity, name, save) => {
    props.agent(arity, name, save);
  };

  const handleRuleDetails = (agent1, agent2, rNet) => {
    props.rule(agent1, agent2, rNet);
  };
  const handleNewNet = (value) => {
    props.newNet(value);
  };

  const handleSaveNet = (name) => {
    props.saveNet(name);
  };
  const handleLoadNet = (name) => {
    props.loadNet(name);
  };
  const handleSaveAll = (type) => {
    props.saveAll(type);
  };
  const reduceNet = () => {
    var red = reduce;
    setReduce(!red);
    props.reduceNet(!red);
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Toolbar>
          <SideBar
            saveNet={handleSaveNet}
            loadNet={handleLoadNet}
            saveAll={handleSaveAll}
          ></SideBar>
          <AddList
            agentDetails={handleAgentDetails}
            ruleDetails={handleRuleDetails}
            newNet={handleNewNet}
          ></AddList>
          <div className={classes.grow} />
          <Tooltip title="Reduce current net by one step">
            <Fab
              color="secondary"
              aria-label="playarrow"
              className={classes.fabButton}
              onClick={reduceNet}
            >
              <PlayArrowIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Fully reduce current net">
            <Fab
              color="secondary"
              aria-label="fastforward"
              className={classes.fabButton}
            >
              <FastForwardIcon />
            </Fab>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}
