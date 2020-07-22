import React from "react";

/* this class handles the connection between the front-end and the API -> and also therefore the 
backend. This means it contains functions for parsing interaction nets from the received strings, as well
as functions for converting interaction nets into these strings.
*/
class INetsHandler extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "", apiTranslation: [] };
  }

  componentDidMount() {
    this.callAPI();
  }

  callAPI() {
    fetch("http://localhost:9000/API/netgoeshere")
      .then((res) => res.text())
      .then((res) => this.setState({ apiResponse: res }));
  }

  testy = () => {
    this.callAPI();
    //console.log(this.state.apiResponse);
    this.setState({ apiTranslation: this.netParser(this.state.apiResponse) });
    console.log(this.netParser(this.state.apiResponse));
  };

  testy2 = () => {
    console.log("API RESPONSE, API TRANSLATION TO STRING");
    console.log(this.state.apiResponse);
    console.log(
      this.netToString(this.state.apiTranslation) === this.state.apiResponse
    );
  };

  // START OF PARSING METHODS
  // agent components are split on "."
  agentParser = (input) => {
    if (input === "") return [];
    var agentL = input.split(".");
    var agent = [
      JSON.parse(agentL[0]),
      agentL[1],
      JSON.parse(agentL[2]),
      JSON.parse(agentL[3]),
    ];
    return agent;
  };
  // rule components are split on "~"
  ruleParser = (input) => {
    if (input === "") return [];
    var ruleL = input.split("~");
    var rule = [
      this.agentParser(ruleL[0]),
      this.agentParser(ruleL[1]),
      this.rNetParser(ruleL[2]),
    ];
    return rule;
  };
  // rNets components are split on "-"
  rNetParser = (input) => {
    if (input === "") return [];
    var rNetL = input.split("-");
    var rNet = [
      this.agentListParser(rNetL[0]),
      this.conListParser(rNetL[1]),
      this.freeportListParser(rNetL[2]),
    ];
    return rNet;
  };
  // freeport list is split on "$"
  freeportListParser = (input) => {
    if (input === "") return [];
    var freeportL = input.split("$");
    var freeports = [];
    var i;
    for (i = 0; i < freeportL.length - 1; i++) {
      freeports.push(this.freeportParser(freeportL[i]));
    }
    return freeports;
  };
  //freeport components are split on "|"
  freeportParser = (input) => {
    if (input === "") return [];
    var freeportL = input.split("|");
    var freeport = [
      this.agentParser(freeportL[0]),
      JSON.parse(freeportL[1]),
      this.agentParser(freeportL[2]),
      JSON.parse(freeportL[3]),
    ];
    return freeport;
  };

  // con components are split on "("
  conParser = (input) => {
    if (input === "") return [];
    var conL = input.split("(");
    var con = [
      this.agentParser(conL[0]),
      this.agentParser(conL[1]),
      JSON.parse(conL[2]),
      JSON.parse(conL[3]),
    ];
    return con;
  };
  // each of these iterations is ended one early as split creates an undefined object at the end of the list
  // agent list is split on ")"
  agentListParser = (input) => {
    if (input === "") return [];
    var agents = input.split(")");
    var i;
    var procAgents = [];
    for (i = 0; i < agents.length - 1; i++) {
      procAgents.push(this.agentParser(agents[i]));
    }
    return procAgents;
  };
  // rule list is split on "*"
  ruleListParser = (input) => {
    if (input === "") return [];
    var rules = input.split("*");
    var i;
    var procRules = [];
    for (i = 0; i < rules.length - 1; i++) {
      procRules.push(this.ruleParser(rules[i]));
    }
    return procRules;
  };
  //connection list is split on "!"
  conListParser = (input) => {
    if (input === "") return [];
    var cons = input.split("!");
    var i;
    var procCons = [];
    for (i = 0; i < cons.length - 1; i++) {
      procCons.push(this.conParser(cons[i]));
    }
    return procCons;
  };
  // the three components of an interaction net are seperated by ":"
  netParser = (input) => {
    if (input === "") return [];
    var splitInput = input.split(":");
    var net = [
      this.agentListParser(splitInput[0]),
      this.ruleListParser(splitInput[1]),
      this.conListParser(splitInput[2]),
    ];
    return net;
  };
  // END OF PARSING FUNCTIONS

  // START OF NET TO STRING FUNCTIONS
  netToString = (input) => {
    if (input === []) return "";
    if (input === null) return "";
    var output =
      this.agentListToString(input[0]) +
      ":" +
      this.ruleListToString(input[1]) +
      ":" +
      this.conListToString(input[2]);
    return output;
  };

  // add ")" between each agent
  agentListToString = (input) => {
    if (input === []) return "";
    if (input === null) return "";
    var i;
    var agents = "";
    for (i = 0; i < input.length; i++) {
      agents = agents + this.agentToString(input[i]) + ")";
    }
    return agents;
  };

  // add "." between each component
  agentToString = (input) => {
    if (input === []) return "";
    if (input === null) return "";
    var agent =
      input[0].toString() +
      "." +
      input[1] +
      "." +
      this.portListToString(input[2]) +
      "." +
      input[3].toString();
    return agent;
  };

  // portlist outputted as a standard array with square brackets
  portListToString = (input) => {
    if (input === null) return "[]";
    var output = "[" + input.toString() + "]";
    return output;
  };

  //rules seperated by "*"
  ruleListToString = (input) => {
    if (input === []) return "";
    if (input === null) return "";
    var rules = "";
    var i;
    for (i = 0; i < input.length; i++) {
      rules = rules + this.ruleToString(input[i]) + "*";
    }
    return rules;
  };

  //rule components seperated by "~"
  ruleToString = (input) => {
    if (input === []) return "";
    if (input === null) return "";
    var rule =
      this.agentToString(input[0]) +
      "~" +
      this.agentToString(input[1]) +
      "~" +
      this.rNetToString(input[2]);
    return rule;
  };

  //rNet components split by "-"
  rNetToString = (input) => {
    if (input === []) return "";
    if (input === null) return "";
    var rNet =
      this.agentListToString(input[0]) +
      "-" +
      this.conListToString(input[1]) +
      "-" +
      this.freeportToString(input[2]);
    return rNet;
  };

  //freeport components split by "|", with each split by a "$"
  freeportToString = (input) => {
    if (input === []) return "";
    if (input === null) return "";
    var i;
    var freeport = "";
    for (i = 0; i < input.length; i++) {
      freeport =
        freeport +
        this.agentToString(input[i][0]) +
        "|" +
        input[i][1].toString() +
        "|" +
        this.agentToString(input[i][2]) +
        "|" +
        input[i][3].toString() +
        "$";
    }
    return freeport;
  };

  //conlist split by "!"
  conListToString = (input) => {
    if (input === []) return "";
    if (input === null) return "";
    var i;
    var cons = "";
    for (i = 0; i < input.length; i++) {
      cons = cons + this.conToString(input[i]) + "!";
    }
    return cons;
  };

  //con components split by "("
  conToString = (input) => {
    if (input === []) return "";
    if (input === null) return "";
    var con =
      this.agentToString(input[0]) +
      "(" +
      this.agentToString(input[1]) +
      "(" +
      input[2].toString() +
      "(" +
      input[3].toString();
    return con;
  };

  // END OF NET TO STRING FUNCTIONS

  render() {
    return <div></div>;
  }
}
export default INetsHandler;
