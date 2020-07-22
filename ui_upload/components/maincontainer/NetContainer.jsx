import React from "react";
import { Stage, Layer } from "react-konva";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import INetsHandler from "./INetsHandler";
import Agent from "./Agent";
import Connection from "./Connection";
import { v4 as uuidv4 } from "uuid";
import { Typography, Paper, Chip } from "@material-ui/core";

//the net container class contains the bulk of the code for managing interaction nets in the front-end. This includes functions for loading agents and rules from an array sent from the back-end
class NetContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      INet: [],
      INetHandler: new INetsHandler(),
      agents: [],
      cons: [],
      rules: [],
      conIDs: {},
      agentPos: {},
      conState: false,
      storedData: [],
      apiResponse: "",
      result: "",
    };
  }

  componentDidMount() {
    var net = this.state.INetHandler.netParser(
      "0.0.[].0)0.Erase.[].1)5.y.[1,2,3,4,5].2)3.x.[0,2,3].3):0.0.[].0~2.Mult.[].4~0.0.[].0)0.Erase.[].1)--2.Mult.[].4|1|0.Erase.[].1|0$2.Mult.[].4|2|0.0.[].0|0$*:5.y.[1,2,3,4,5].2(0.Erase.[].1(0(0!3.x.[0,2,3].3(0.0.[].0(1(0!"
    );
    this.setState(
      {
        INet: net,
        agentPos: this.initAgentPos(net[0]),
        cons: this.loadCons(net[2]),
        rules: this.loadRules(net[1]),
      },
      this.loadAgents
    );
  }

  //handles updates from buttons, such as saving, loading, adding new agents and rules
  componentDidUpdate = (prevProps) => {
    if (
      prevProps.aName !== this.props.aName ||
      prevProps.aArity !== this.props.aArity
    ) {
      this.handleAgentAdd(
        Number(this.props.aArity),
        this.props.aName,
        this.props.aSave
      );
    }
    if (
      prevProps.rAgent1 !== this.props.rAgent1 ||
      prevProps.rAgent2 !== this.props.rAgent2 ||
      prevProps.rRNet !== this.props.rRNet
    ) {
      this.handleRuleAdd(
        this.props.rAgent1,
        this.props.rAgent2,
        this.props.rRNet
      );
    }
    if (prevProps.netName !== this.props.netName) {
      this.handleNetSave(this.props.netName);
    }
    if (prevProps.loadNet !== this.props.loadNet) {
      this.handleNetLoad(this.props.loadNet);
    }
    if (prevProps.saveAll !== this.props.saveAll) {
      this.saveAll(this.props.saveAll);
    }
    if (prevProps.reduce !== this.props.reduce) {
      this.reduceNet();
    }
    if (prevProps.newNet !== this.props.newNet) {
      this.wipeNet();
    }
  };

  // saves all components of a given type
  saveAll(type) {
    var net = this.state.INet;
    if (type === "agents") {
      for (let i = 0; i < net[0].length; i++) {
        this.addToStore("agents", net[0][i]);
      }
    } else if (type === "rules") {
      for (let i = 0; i < net[1].length; i++) {
        this.addToStore("rules", net[1][i]);
      }
    }
  }

  wipeNet = () => {
    this.setState({
      INet: [[], [], []],
      agentPos: {},
      cons: [],
      rules: [],
      agents: [],
    });
  };

  fetcher = async (net) => {
    const response = await fetch("http://localhost:9000/API/" + net);
    if (!response.ok) {
      throw new Error("HTTP status " + response.status);
    }
    return response.text();
  };

  //call the API to reduce the current Net
  //NOTE API MUST BE RUNNING ON localhost:9000/API
  reduceNet = async () => {
    var sec = performance.now();
    var strnet = this.state.INetHandler.netToString(this.state.INet);
    console.log("TO API:");
    console.log(strnet);
    var result = await this.fetcher(strnet);
    console.log("FROM API:");
    console.log(result);
    var trimRes = result.substring(1, result.length - 1);
    var net = this.state.INetHandler.netParser(trimRes);
    this.setState(
      {
        INet: net,
        agentPos: this.initAgentPos(net[0]),
        cons: this.loadCons(net[2]),
        rules: this.loadRules(net[1]),
      },
      this.loadAgents
    );
    var sec2 = performance.now();
    console.log("Time to reduce =" + (sec2 - sec) + " milliseconds.");
  };

  //load net of given name to the current net, deleting the old net
  handleNetLoad(name) {
    var nets = JSON.parse(localStorage.getItem("nets"));
    var net;
    for (let i = 0; i < nets.length; i++) {
      if (nets[i][0] === name) {
        net = nets[i][1];
      }
    }
    this.setState(
      {
        INet: net,
        agentPos: this.initAgentPos(net[0]),
        cons: this.loadCons(net[2]),
        rules: this.loadRules(net[1]),
      },
      this.loadAgents
    );
    console.log(name + " loaded");
  }

  //add the current net to the saved nets with given name
  handleNetSave(name) {
    var newNet = [name, this.state.INet];
    this.addToStore("nets", newNet);
  }

  //adds object to specified array in store
  addToStore(key, obj) {
    var list = JSON.parse(localStorage.getItem(key));
    if (list === null) {
      list = [];
    }
    list.push(obj);
    localStorage.setItem(key, JSON.stringify(list));
  }

  //adds a new agent to the net from input of arity and name, generating a new ID for the agent, then updates net
  handleAgentAdd = (arity, name, save) => {
    if (arity < 0) return;
    var currentAgs = this.state.INet[0];
    var i;
    var store = 0;
    //loop to ensure agent ID is different to any in the current net before adding
    for (i = 0; i < currentAgs.length; i++) {
      if (currentAgs[i][3] >= store) {
        store = currentAgs[i][3] + 1;
      }
    }
    var freeports = [];
    //loop to generate freeports for the new agent
    for (i = 0; i <= arity; i++) {
      freeports.push(i);
    }
    var newAg = [arity, name, freeports, store];
    if (save) {
      this.addToStore("agents", newAg);
    }
    currentAgs.push(newAg);
    var newNet = this.state.INet;
    newNet[0] = currentAgs;
    this.setState({ INet: newNet }, this.loadAgents);
  };

  //check whether a given rule exists in a given list
  //@input [rule], rule
  //@output bool
  ruleCheck = (ruleList, rule) => {
    var check = false;
    for (let i = 0; i < ruleList.length; i++) {
      if (ruleList[i] === rule) check = true;
    }
    return check;
  };

  //handles adding a new rule from the Rule creation wizard by updating the state.
  //@input agent1, agent2, rnet
  handleRuleAdd = (agent1, agent2, rNet) => {
    var currentRules = this.state.INet[1];
    if (!this.ruleCheck(currentRules, [agent1, agent2, rNet])) {
      currentRules.push([agent1, agent2, rNet]);
    }
    var newNet = this.state.INet;
    newNet[1] = currentRules;
    this.addToStore("rules", [agent1, agent2, rNet]);
    this.setState({ INet: newNet, rules: this.loadRules(currentRules) });
  };

  //function to load agents from an agent list and updates state agent list
  loadAgents = () => {
    var input = this.state.INet[0];
    var i;
    var agents = [];
    for (i = 0; i < input.length; i++) {
      agents.push(this.createAgent(i));
    }

    this.setState({ agents: agents });
  };

  //create a single agent from an input of type (arity, name, portlist, id)
  createAgent = (input) => {
    var arity = this.state.INet[0][input][0];
    var name = this.state.INet[0][input][1];
    var portlist = this.state.INet[0][input][2];
    var id = this.state.INet[0][input][3];
    var ag = (
      <Agent
        name={name}
        x={0}
        y={0}
        onMove={this.handleMove}
        arity={arity}
        addConnection={this.addConnection}
        removeConnection={this.removeConnection}
        id={id}
        key={id}
        portConnectivity={portlist}
      ></Agent>
    );
    return ag;
  };

  //function which initialises the storage of agent locations
  initAgentPos(input) {
    var ags = input;
    var i;
    var agPos = this.state.agentPos;
    for (i = 0; i < ags.length; i++) {
      var id = ags[i][3];
      agPos[id] = { x: 0, y: 0 };
    }
    return agPos;
  }

  // return agent pos from input of agent as array(4)
  getAgPos = (input) => {
    var pos = this.state.agentPos[input[3]];
    return pos;
  };

  //function which loads connections from a connection list and outputs a list of Line Components
  loadCons = (input) => {
    var i;
    var cons = [];
    for (i = 0; i < input.length; i++) {
      cons.push(this.createCon(input[i]));
    }
    return cons;
  };

  //create a connection @input [agent 1, agent 2, ag1pid, ag2pid]
  //@return connection object to add to line list
  createCon = (input) => {
    var pos1 = this.getAgPos(input[0]);
    var pos2 = this.getAgPos(input[1]);
    var port1 = input[2];
    var port2 = input[3];
    var arity1 = input[0][0];
    var arity2 = input[1][0];
    var con = (
      <Connection
        pos1={pos1}
        pos2={pos2}
        port1={port1}
        port2={port2}
        arity1={arity1}
        arity2={arity2}
        stroke={port1 === 0 && port2 === 0 ? "blue" : "red"}
        key={uuidv4()}
      ></Connection>
    );
    return con;
  };

  //load rules from an input list of rules and add them to the "chip" layout beneath the current net
  loadRules = (input) => {
    var rules = [];
    for (let i = 0; i < input.length; i++) {
      rules.push(
        <Chip
          label={"Rule Between " + input[i][0][1] + " and " + input[i][1][1]}
          key={i}
        ></Chip>
      );
    }
    return rules;
  };

  //update agent positions after agent moves, then update line positions
  handleMove = (pos, id) => {
    var agPos = this.state.agentPos;
    agPos[id] = pos;
    this.setState({ agentPos: agPos });
    this.setState({ cons: this.loadCons(this.state.INet[2]) });
  };

  //find the index of the given agent in the current state's INet
  //@return index (int)
  findAgIndex = (input) => {
    var i;
    var ag;
    for (i = 0; i < this.state.INet[0].length; i++) {
      if (this.state.INet[0][i][3] === input) {
        ag = i;
      }
    }
    return ag;
  };

  //replace agent in given agent list with given agent
  //@return new list
  replaceAg = (agL, ag) => {
    var i;
    var newL = [];
    for (i = 0; i < agL.length; i++) {
      if ((ag[3] = agL[i][3])) {
        newL.push(ag);
      } else {
        newL.push(agL[i]);
      }
    }
    return newL;
  };

  //add a connection to the current net given a port id and agent id and taking the stored values from the previously clicked port
  addConnection = (pid, agid) => {
    if (this.state.conState) {
      var INet = this.state.INet;
      var index1 = this.findAgIndex(this.state.storedData[1]);
      var index2 = this.findAgIndex(agid);
      var agL = INet[0];
      var ag1 = agL[index1];
      var ag2 = agL[index2];

      ag1 = this.removeFreeport(ag1, this.state.storedData[0]);
      if (this.state.storedData[1] !== agid) {
        ag2 = this.removeFreeport(ag2, pid);
        agL[index1] = ag1;
        agL[index2] = ag2;
      } else {
        var ag3 = this.removeFreeport(ag1, pid);
        agL[index1] = ag3;
      }
      var cons = this.state.INet[2];
      cons.push([ag1, ag2, this.state.storedData[0], pid]);

      INet[0] = agL;
      INet[2] = cons;
      this.setState({
        INet: INet,
        conState: false,
        cons: this.loadCons(cons),
        storedData: [],
      });
    } else {
      var data = [pid, agid];
      this.setState({ storedData: data, conState: true });
    }
    this.loadAgents(this.state.INet[0]);
  };

  //add PID to freeport list in specified agent
  addFreeport = (inputAgentList, inputAID, inputPID) => {
    var i;
    var newList = [];
    var newAg;
    for (i = 0; i < inputAgentList.length; i++) {
      if (inputAgentList[i][3] === inputAID) {
        newAg = inputAgentList[i];
        newAg[2].push(inputPID);
      } else {
        newAg = inputAgentList[i];
      }
      newList.push(newAg);
    }
    return newList;
  };

  //remove given portID from Freeport list of given agent
  removeFreeport = (inputAgent, inputPID) => {
    var i;
    var newList = [];
    var newAg;
    for (i = 0; i < inputAgent[2].length; i++) {
      if (inputAgent[2][i] !== inputPID) {
        newList.push(inputAgent[2][i]);
      }
    }
    newAg = [inputAgent[0], inputAgent[1], newList, inputAgent[3]];
    return newAg;
  };

  //remove a connection from the net, updating agent freeports in the process
  removeConnection = (pid, aid) => {
    var cons = this.state.INet[2];
    var newcons = [];
    var i;
    var affectedAgent2id;
    var port2id;
    for (i = 0; i < cons.length; i++) {
      if (cons[i][0][3] === aid && cons[i][2] === pid) {
        affectedAgent2id = cons[i][1][3];
        port2id = cons[i][3];
      } else if (cons[i][1][3] === aid && cons[i][3] === pid) {
        affectedAgent2id = cons[i][0][3];
        port2id = cons[i][2];
      } else {
        newcons.push(cons[i]);
      }
    }
    var newNet = this.state.INet;
    newNet[2] = newcons;
    newNet[0] = this.addFreeport(newNet[0], aid, pid);
    newNet[0] = this.addFreeport(newNet[0], affectedAgent2id, port2id);
    this.setState({
      INet: newNet,
      cons: this.loadCons(newcons),
    });
    this.loadAgents(newNet[0]);
  };

  render() {
    return (
      <div>
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth={false}>
            <div>
              <Stage
                width={window.innerWidth - 50}
                height={window.innerHeight / 1.25}
              >
                <Layer>{this.state.agents}</Layer>
                <Layer>{this.state.cons}</Layer>
              </Stage>
              <Typography variant="h6" gutterBottom>
                Currently Active Rules:
              </Typography>
              <Paper>{this.state.rules}</Paper>
            </div>
          </Container>
        </React.Fragment>
      </div>
    );
  }
}
export default NetContainer;
