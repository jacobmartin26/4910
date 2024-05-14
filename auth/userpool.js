import { CognitoUserPool } from "amazon-cognito-identity-js";

const REACT_APP_USER_POOL_ID = 'us-east-1_feJKa0HRc';
const REACT_APP_CLIENT_ID = '2s53dnf63260p3emkb3ejbbbjm';

const poolData = {
    UserPoolId: REACT_APP_USER_POOL_ID,
    ClientId: REACT_APP_CLIENT_ID,
}
const user = new CognitoUserPool(poolData)
export default user