import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SaveIcon from "@material-ui/icons/Save";
import Tooltip from "@material-ui/core/Tooltip";
import SaveButton from "./buttons/SaveButton";
import LoadButton from "./buttons/LoadButton";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
});

// the sidebar component handles saving and loading of rules, agents and nets
export default function SideBar(props) {
  const classes = useStyles();
  const [saveOpen, setSaveOpen] = React.useState(false);
  const [loadOpen, setLoadOpen] = React.useState(false);
  const [state, setState] = React.useState({
    left: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const toggleSaveOpen = () => {
    setSaveOpen(true);
  };
  const handleSave = (name) => {
    props.saveNet(name);
  };
  const handleSaveClose = () => {
    setSaveOpen(false);
  };
  const toggleLoadOpen = () => {
    setLoadOpen(true);
  };
  const handleLoad = (name) => {
    props.loadNet(name);
  };
  const handleLoadClose = () => {
    setLoadOpen(false);
  };
  const saveAllAgents = () => {
    props.saveAll("agents");
  };
  const saveAllRules = () => {
    props.saveAll("rules");
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button key={"Save"} onClick={toggleSaveOpen}>
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <ListItemText primary={"Save"} />
        </ListItem>
        <ListItem button key={"Load"} onClick={toggleLoadOpen}>
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <ListItemText primary={"Load"} />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key={"Save Current Agents"} onClick={saveAllAgents}>
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <ListItemText primary={"Save Current Agents"} />
        </ListItem>
        <ListItem button key={"Save Current Rules"} onClick={saveAllRules}>
          <ListItemIcon>
            <SaveIcon />
          </ListItemIcon>
          <ListItemText primary={"Save Current Rules"} />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div>
      <SaveButton
        open={saveOpen}
        handleInput={handleSave}
        informClose={handleSaveClose}
      ></SaveButton>
      <LoadButton
        open={loadOpen}
        handleInput={handleLoad}
        informClose={handleLoadClose}
      ></LoadButton>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Tooltip title="Open Side-menu">
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(anchor, true)}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
