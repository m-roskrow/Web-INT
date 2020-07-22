import React from "react";
import { Circle } from "react-konva";

class Port extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fill: this.props.fill,
      width: 10,
      height: 10,
      x: this.props.x,
      y: this.props.y,
      available: this.props.available,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.available !== this.props.available) {
      this.setState({ available: this.props.available, fill: this.props.fill });
      this.forceUpdate();
    }
  }
  handleClick = (e) => {
    var id = this.props.id;
    if (this.state.available) {
      this.props.addC(id);
    } else {
      this.props.removeC(id);
    }
  };

  render() {
    return (
      <Circle
        x={this.state.x}
        y={this.state.y}
        width={this.state.width}
        height={this.state.height}
        fill={this.state.fill}
        shadowBlur={5}
        opacity={0.9}
        onClick={this.handleClick}
      ></Circle>
    );
  }
}
export default Port;
