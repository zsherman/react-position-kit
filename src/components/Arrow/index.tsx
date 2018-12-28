import * as React from 'react'

const Arrow: React.StatelessComponent<Props> = ({
  position,
  children,
  style,
  arrowColor = Constants.DEFAULT_ARROW_COLOR,
  arrowSize = 10,
  arrowStyle,
  anchorRect,
  contentRect,
}) => (
    <div>
      ->
    </div>
  );

export default Arrow
