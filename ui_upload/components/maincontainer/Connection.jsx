import React from "react";
import { Line } from "react-konva";

class Connection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stroke: this.props.stroke,
      x: this.props.x,
      y: this.props.y,
      pos1: this.props.pos1,
      pos2: this.props.pos2,
      arity1: this.props.arity1,
      arity2: this.props.arity2,
      port1: this.props.port1,
      port2: this.props.port2,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState(this.props);
      this.forceUpdate();
    }
  }

  genPoints() {
    var x1 = this.state.pos1.x;
    var x2 = this.state.pos2.x;
    var y1 = this.state.pos1.y;
    var y2 = this.state.pos2.y;
    var a1 = this.state.arity1;
    var a2 = this.state.arity2;
    var p1 = this.state.port1;
    var p2 = this.state.port2;

    var yshift1 = p1 === 0 ? 50 : 0;
    var yshift2 = p2 === 0 ? 50 : 0;

    var xshift1 = p1 === 0 ? (a1 === 0 ? 25 : a1 * 25) : 25 + 50 * (p1 - 1);
    var xshift2 = p2 === 0 ? (a2 === 0 ? 25 : a2 * 25) : 25 + 50 * (p2 - 1);

    return [x1 + xshift1, y1 + yshift1, x2 + xshift2, y2 + yshift2];
  }

  render() {
    return (
      <Line
        x={this.state.x}
        y={this.state.y}
        points={this.genPoints()}
        onClick={this.handleClick}
        stroke={this.state.stroke}
      ></Line>
    );
  }
}
export default Connection;
