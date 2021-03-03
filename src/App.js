import logo from './logo.svg';
import './App.css';
import { Component } from 'react';
import Amplify, { API, Auth, Hub } from 'aws-amplify';
import { AmplifyForgotPassword, AmplifySignOut, AmplifySignIn, AmplifySignUp } from '@aws-amplify/ui-react';
// import { ConfirmSignIn, ConfirmSignUp, ForgotPassword, RequireNewPassword, SignIn, SignUp, VerifyContact, withAuthenticator } from 'aws-amplify-react';

Amplify.configure({
  Auth: {

    // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
    // identityPoolId: 'XX-XXXX-X:XXXXXXXX-XXXX-1234-abcd-1234567890ab',

    // REQUIRED - Amazon Cognito Region
    region: 'ap-northeast-1',

    // OPTIONAL - Amazon Cognito Federated Identity Pool Region
    // Required only if it's different from Amazon Cognito Region
    // identityPoolRegion: 'XX-XXXX-X',

    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'ap-northeast-1_N3nN9QGRU',

    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '15kir6mhm97m6etpfk2bng22sk',

    // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
    // mandatorySignIn: false,

    // OPTIONAL - Configuration for cookie storage
    // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
    // cookieStorage: {
    // // REQUIRED - Cookie domain (only required if cookieStorage is provided)
    //     domain: '.yourdomain.com',
    // // OPTIONAL - Cookie path
    //     path: '/',
    // // OPTIONAL - Cookie expiration in days
    //     expires: 365,
    // // OPTIONAL - See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
    //     sameSite: "strict" | "lax",
    // // OPTIONAL - Cookie secure flag
    // // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
    //     secure: true
    // },

    // OPTIONAL - customized storage object
    // storage: MyStorage,

    // OPTIONAL - Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
    // authenticationFlowType: 'USER_PASSWORD_AUTH',

    // OPTIONAL - Manually set key value pairs that can be passed to Cognito Lambda Triggers
    // clientMetadata: { myCustomKey: 'myCustomValue' },

    // OPTIONAL - Hosted UI configuration
    oauth: {
      domain: 'greet-proto-01.auth.ap-northeast-1.amazoncognito.com',
      scope: ['openid'],
      redirectSignIn: 'http://localhost:3000',
      redirectSignOut: 'http://localhost:3000',
      responseType: 'code'
    }
  },
  API: {
    endpoints: [
      {
        name: "GreetProtoHTTPAPI01",
        endpoint: "https://nfxhxf9hld.execute-api.ap-northeast-1.amazonaws.com",
        custom_header: async () => {
          try {
            const session = await Auth.currentSession()
            return {
              Authorization: 'Bearer ' + session.getAccessToken().getJwtToken()
            }
          } catch (err) {
          }
          return {}
        }
      },
    ]
  }
});

class App extends Component {
  state = { user: null, customState: null };

  componentDidMount() {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      console.log(event, data)
      switch (event) {
        case "signIn":
          this.setState({ user: data });
          break;
        case "signOut":
          this.setState({ user: null });
          break;
        case "customOAuthState":
          this.setState({ customState: data });
          break;
        default:
          break;
      }
    });

    Auth.currentAuthenticatedUser()
      .then(user => this.setState({ user }))
      .catch(() => console.log("Not signed in"));
  }

  callAPI() {
    API.get('GreetProtoHTTPAPI01', '/me', {
      headers: {},
      response: true
    }).then(result => {
      console.log(result.data)
    }).catch(error => {
      console.log(error.response || error)
    });
  }

  render() {
    return (
      <div className="App">
        <AmplifySignIn />
        <AmplifyForgotPassword />
        <AmplifySignUp
          usernameAlias="email"
          formFields={[
            {
              type: 'nickname',
              label: 'ユーザー名',
              placeholder: '',
              required: true,
              inputProps: {
                maxLength: 10
              }
            },
            {
              type: 'email',
              label: 'メールアドレス',
              placeholder: '',
              required: true,
              inputProps: {
                maxLength: 255
              }
            },
            {
              type: 'password',
              label: 'パスワード',
              placeholder: '',
              required: true,
              inputProps: {
                maxLength: 99
              }
            },
            {
              type: 'birthdate',
              label: '生年月日',
              placeholder: 'YYYY-MM-DD',
              required: false,
              inputProps: {
                maxLength: 10
              }
            },
            {
              type: 'gender',
              label: '性別',
              placeholder: 'male of female',
              required: false,
              inputProps: {
                maxLength: 6
              }
            }
          ]}
        />
        <AmplifySignOut />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <p>
            <button onClick={() => Auth.federatedSignIn({ provider: 'Facebook' })}>Open Facebook</button>
          </p>
          <p>
            <button onClick={() => Auth.federatedSignIn({ provider: 'Google' })}>Open Google</button>
          </p>
          <p>
            <button onClick={() => Auth.federatedSignIn({ provider: 'LINE' })}>Open LINE</button>
          </p>
          <a
            className="App-link"
            rel="noopener noreferrer"
            onClick={this.callAPI}
          >
            Call API
          </a>
        </header>
      </div>
    );
  }
}

export default App
