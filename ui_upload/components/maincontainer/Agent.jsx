import React from "react";
import { Rect, Text, Group } from "react-konva";
import Port from "./Port";

class Agent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: 50,
      color: "#9575cd",
      portlist: [],
      name: this.props.name,
      x: this.props.x,
      y: this.props.y,
      width: this.props.arity === 0 ? 50 : this.props.arity * 50,
      arity: this.props.arity,
      portConnectivity: this.props.portConnectivity,
      portY: this.props.y,
      prinY: this.props.y + 50,
      portX:
        this.props.x +
        (this.props.arity === 0 ? 50 : this.props.arity * 50) /
          (this.props.arity === 0 ? 1 : this.props.arity) -
        25,
      prinX: (this.props.arity === 0 ? 50 : this.props.arity * 50) / 2,
      rect: (
        <Rect
          x={this.props.x}
          y={this.props.y}
          width={this.props.arity === 0 ? 50 : this.props.arity * 50}
          height={50}
          fill={"#9575cd"}
          shadowBlur={5}
        />
      ),
      txt: (
        <Text
          align="center"
          verticalAlign="middle"
          fontSize={15}
          fontFamily="Courier"
          text={this.props.name}
          x={
            this.props.x +
            3 +
            (this.props.arity === 0 ? 50 : this.props.arity * 50) / 2 -
            this.props.name.length * 5
          }
          y={this.props.y + 15}
        />
      ),
    };
  }

  componentDidMount() {
    this.updateState();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.updateState();
    }
  }

  updateState() {
    this.setState(
      { portConnectivity: this.props.portConnectivity },
      this.refreshPortlist
    );
  }

  handleDragEnd = (e) => {
    var pos = e.target.absolutePosition();
    this.props.onMove(pos, this.props.id);
  };
  refreshPortlist = () => {
    this.setState({ portlist: this.genPortlist() });
  };
  handleAddConnection = (id) => {
    this.props.addConnection(id, this.props.id);
    this.updateState();
  };
  handleRemoveConnection = (id) => {
    this.props.removeConnection(id, this.props.id);
    this.updateState();
  };
  genPortlist = (e) => {
    var portlist = [];
    var i;
    for (i = 0; i <= this.state.arity; i++) {
      this.state.portConnectivity.includes(i)
        ? portlist.push(true)
        : portlist.push(false);
    }
    var ports = [
      <Port
        x={this.state.prinX}
        y={this.state.prinY}
        key={0}
        id={0}
        fill={portlist[0] ? "#ffeb3b" : "#3f51b5"}
        addC={this.handleAddConnection}
        removeC={this.handleRemoveConnection}
        available={portlist[0]}
      />,
    ];
    for (i = 1; i <= this.state.arity; i++) {
      var port = (
        <Port
          x={this.state.portX + 50 * (i - 1)}
          y={this.state.portY}
          key={i}
          id={i}
          fill={portlist[i] ? "#8bc34a" : "#e91e63"}
          addC={this.handleAddConnection}
          removeC={this.handleRemoveConnection}
          available={portlist[i]}
        />
      );
      ports.push(port);
    }
    return ports;
  };

  render() {
    return (
      <Group draggable={true} onDragEnd={this.handleDragEnd}>
        {this.state.rect}
        {this.state.txt}
        {this.state.portlist}
      </Group>
    );
  }
}
export default Agent;
