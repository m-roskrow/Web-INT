import React from "react";

import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import AgentCreationButton from "./buttons/AgentCreationButton";
import RuleCreationButton from "./buttons/RuleCreationButton";
import AgentAddButton from "./buttons/AgentAddButton";
import RuleAddButton from "./buttons/RuleAddButton";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto",
  },
}));

// this component controls the creation, addition and saving of rules, nets and agents
export default function AddList(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [agentCOpen, setAgentCOpen] = React.useState(false);
  const [agentAOpen, setAgentAOpen] = React.useState(false);
  const [ruleOpen, setRuleOpen] = React.useState(false);
  const [ruleAOpen, setRuleAOpen] = React.useState(false);
  const [newNet, setNewNet] = React.useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleAgentCreationIn = (arity, name, save) => {
    props.agentDetails(arity, name, save);
  };
  const handleRuleCreationIn = (agent1, agent2, rnet) => {
    props.ruleDetails(agent1, agent2, rnet);
  };

  const handleAgentCreationClose = (close) => {
    setAgentCOpen(close);
    setAgentAOpen(close);
  };
  const handleRuleCreationClose = (close) => {
    setRuleOpen(close);
    setRuleAOpen(close);
  };

  function handleAgentCreation(event) {
    setAgentCOpen(true);
    setOpen(false);
  }
  function handleAgentAdd(event) {
    setAgentAOpen(true);
    setOpen(false);
  }
  function handleRuleCreation(event) {
    setRuleOpen(true);
    setOpen(false);
  }
  function handleRuleAdd(event) {
    setRuleAOpen(true);
    setOpen(false);
  }
  function handleNewNet(event) {
    props.newNet(!newNet);
    setNewNet(!newNet);
    setOpen(false);
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={classes.root}>
      <div>
        <AgentCreationButton
          open={agentCOpen}
          handleInput={handleAgentCreationIn}
          informClose={handleAgentCreationClose}
        ></AgentCreationButton>
        <AgentAddButton
          open={agentAOpen}
          handleInput={handleAgentCreationIn}
          informClose={handleAgentCreationClose}
        ></AgentAddButton>
        <RuleCreationButton
          open={ruleOpen}
          handleInput={handleRuleCreationIn}
          informClose={handleRuleCreationClose}
        ></RuleCreationButton>
        <RuleAddButton
          open={ruleAOpen}
          handleInput={handleRuleCreationIn}
          informClose={handleRuleCreationClose}
        ></RuleAddButton>
        <Tooltip title="Add Menu">
          <Fab
            color="secondary"
            aria-label="add"
            className={classes.fabButton}
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <Popper
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <MenuList autoFocusItem={open} id="menu-list-grow">
                  <MenuItem onClick={handleNewNet}>
                    New Interaction Net
                  </MenuItem>
                  <MenuItem onClick={handleAgentCreation}>
                    Agent Creation Wizard
                  </MenuItem>
                  <MenuItem onClick={handleAgentAdd}>
                    Add Agent to Net From Saved Agents
                  </MenuItem>
                  <MenuItem onClick={handleRuleCreation}>
                    Create New Rule
                  </MenuItem>
                  <MenuItem onClick={handleRuleAdd}>
                    Add Rule to Net From Saved Rules
                  </MenuItem>
                </MenuList>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </div>
  );
}
