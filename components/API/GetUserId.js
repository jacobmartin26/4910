import React from "react";
import API from "./API";
import userpool from 'app/auth/userpool';

const user = userpool.getCurrentUser();
const email = user.username;
//let userId;
console.log(email)


export default class GetUserId extends React.Component {
    state = {
        data: []
    }
    
    componentDidMount() {
        console.log("inside");
        API.get('/proxy/user/email/' + email)
            .then(res => {
                console.log(res)
                const data = res.data;
                console.log(res.data);
                //this.setState({ data });
                //console.log(res.data);
                console.log(data.user_id);
                //userId = data.user_id[0];
                console.log(data.user_id[0]);
                //userId = data.user_id;
            })
            .catch(e => console.log(e))
    }

    render() {
        return (
            <div>
                <p>User ID: {this.state.data.user_id}</p>
            </div>
        )
    }
}
//export {userId};


