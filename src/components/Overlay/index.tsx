import * as React from 'react'

interface IProps {
  onClick: React.MouseEventHandler
}

const styles: React.CSSProperties = {
  position: 'fixed' as 'fixed',
  height: '100%',
  width: '100%',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 9996,
  background: 'rgba(0, 0, 0, 0)',
  cursor: 'pointer',
}

const Overlay: React.StatelessComponent<IProps> = ({ onClick }) => (
  <div style={styles} onClick={onClick} />
);

export default Overlay
