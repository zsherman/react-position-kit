import * as React from "react";
// import * as ReactDOM from 'react-dom'
// import Rect from '@reach/rect'

class Tour extends React.Component {
  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}

export default Tour;
