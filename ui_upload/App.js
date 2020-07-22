import React from "react";

import NavBar from "./components/NavBar";
import AppBar from "./components/AppBar";
import NetContainer from "./components/maincontainer/NetContainer";

//the main app component of the front-end: which loads the netcontainer, where most front-end handling is done; and UI elements such as the NavBar and AppBar
function App() {
  //state components which handle sending information to the netcontainer for the UI elements
  const [arity, setArity] = React.useState(-1);
  const [name, setName] = React.useState("");
  const [save, setSave] = React.useState(false);
  const [agent1, setAgent1] = React.useState([]);
  const [agent2, setAgent2] = React.useState([]);
  const [rNet, setRNet] = React.useState([]);
  const [netName, setNetName] = React.useState("");
  const [loadNetName, setLoadNetName] = React.useState("");
  const [saveAll, setSaveAll] = React.useState("");
  const [reduce, setReduce] = React.useState(false);
  const [newNet, setNewNet] = React.useState(false);

  function sendAgent(a, n, s) {
    setArity(a);
    setName(n);
    setSave(s);
  }

  function sendRule(a1, a2, rnet) {
    setAgent1(a1);
    setAgent2(a2);
    setRNet(rnet);
  }
  function newNetSet(value) {
    setNewNet(value);
  }

  function saveNet(name) {
    setNetName(name);
  }
  function loadNet(name) {
    setLoadNetName(name);
  }
  function fsaveAll(type) {
    setSaveAll(type);
  }
  function reduceNet(red) {
    setReduce(red);
  }

  var net = (
    <NetContainer
      aArity={arity}
      aName={name}
      aSave={save}
      rAgent1={agent1}
      rAgent2={agent2}
      rRNet={rNet}
      netName={netName}
      loadNet={loadNetName}
      saveAll={saveAll}
      reduce={reduce}
      newNet={newNet}
    ></NetContainer>
  );

  return (
    <>
      <div>
        <NavBar></NavBar>
        {net}
        <AppBar
          agent={sendAgent}
          rule={sendRule}
          saveNet={saveNet}
          loadNet={loadNet}
          saveAll={fsaveAll}
          reduceNet={reduceNet}
          newNet={newNetSet}
        ></AppBar>
      </div>
    </>
  );
}

export default App;
