
import React, { Component } from 'react';

export default class Greeter extends Component {
    constructor(obj) {
        super(obj);
        this.state = {
            title: "pc收银台标题"
        }
    }
    render() {
        return (
            <div className="home">
                <div id="res"></div>
                <p className="title">Hello world! </p>
            </div>
        )
    }
}

