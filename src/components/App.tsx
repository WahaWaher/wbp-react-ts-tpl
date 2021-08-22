import React, { FC } from 'react';
import reactLogoSrc from '@/img/react-logo.png';
import styles from './App.module.scss';

const App: FC = () => {
  const [{ title, content }, setState] = React.useState({
    title: 'Webpack React Template 2021',
    content: '...',
  });

  const changeState = () => {
    setState((s) => ({ ...s, content: `${s.content}.` }));
  };

  return (
    <div className="container">
      <h4 className={styles.title}>
        <img className="logo me-1" src={reactLogoSrc} alt="logo" />
        <span>{title}</span>
        <span>{content}</span>
      </h4>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={changeState}
      >
        Change State
      </button>
    </div>
  );
};

export default App;
