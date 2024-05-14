import React from "react";
import API from "./API";

export default class AboutData extends React.Component {
    state = {
        data: []
    }

    componentDidMount() {
        API.get('About')
            .then(res => {
                const data = res.data;
                this.setState({ data });
                console.log(this.state);
            })
    }

    render() {
        return (
            <div>
                <p>About ID: {this.state.data[0]}</p>
                <p>Prod. Description: {this.state.data[5]}</p>                    
                <p>Prod. Name: {this.state.data[4]}</p>
                <p>Release Date: {this.state.data[3]}</p>
                <p>Sprint: {this.state.data[2]}</p>
                <p>Team Num: {this.state.data[1]}</p>
            </div>
        )
    }
}