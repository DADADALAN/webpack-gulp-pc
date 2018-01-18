require('es5-shim');
require('es5-shim/es5-sham');
require('babel-polyfill');

const React = require('react');
const ReactDOM = require('react-dom');
const App = require('./Greeter.jsx');

console.log(App)

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

