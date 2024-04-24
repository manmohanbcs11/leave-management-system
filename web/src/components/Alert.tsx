import React from 'react';

interface AlertProp {
  alert: { type: string; message: string; };
}

export function Alert(props: AlertProp) {
  const capitalize = (word: string) => {
    if (word === 'danger') {
      word = 'Error';
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  return (
    <div style={{ height: '70px' }}>
      {props.alert && props.alert.type && props.alert.message &&
        <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
          <strong>{capitalize(props.alert.type)}</strong>: {props.alert.message}
        </div>
      }
    </div>
  )
}