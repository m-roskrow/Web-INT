import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import HelpIcon from "@material-ui/icons/Help";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import HelpButton from "./buttons/HelpButton";

export default function NavBar() {
  const [open, setOpen] = React.useState(false);

  const handleHelp = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <HelpButton open={open} informClose={handleClose}></HelpButton>
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h4" color="inherit">
            Interaction Net Tool
          </Typography>
          <Tooltip title="Help">
            <IconButton edge="end" color="inherit" onClick={handleHelp}>
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </div>
  );
}
