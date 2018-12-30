import * as React from "react";
// import Poitioner from './Positioner'
// import * as ReactDOM from 'react-dom'
// import Rect from '@reach/rect'

interface Props {
  position: Position;
  children: any;
}

class Popover extends React.Component<Props, {}> {
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

export default Popover;
