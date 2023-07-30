import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// 테스트 하기
import JoinSession from './Openvidu/1_JoinSession';

ReactDOM.render(<JoinSession />, document.getElementById('root'));
registerServiceWorker();
