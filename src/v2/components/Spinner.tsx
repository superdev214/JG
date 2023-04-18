import './Spinner.css';

import React from 'react';

const Spinner = (props: { open: boolean }) => {
  return props.open ? (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: '#0006',
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
        left: 0,
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 2000,
      }}
    >
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  ) : null;
};

export default Spinner;
