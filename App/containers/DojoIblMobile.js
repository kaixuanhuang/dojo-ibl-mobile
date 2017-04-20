import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Linking,
  Button,
  AsyncStorage,
  Alert
} from 'react-native';
import { Config } from '../config';
import { globalStyles } from '../styles/globalStyles';
import Auth from '../lib/Auth';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';

export default class DojoIblMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false
    };

    this.openLoginPage = this.openLoginPage.bind(this);
    this.handleAuthToken = this.handleAuthToken.bind(this);
    this.logoutWithConfirm = this.logoutWithConfirm.bind(this);
  }

  componentDidMount() {
    Auth.getTokens()
      .then((tokens) => {
        console.log(tokens)

        if (tokens && !Auth.accessTokenExpired(tokens)) {
          this.setState({
            loggedIn: true,
            tokens: tokens
          });
        } else if (tokens && Auth.accessTokenExpired(tokens)) {
          Auth.refreshTokens(tokens)
            .then((tokens) => {
              this.setState({
                loggedIn: true,
                tokens: tokens
              });
            })
            .catch((error) => {
              Alert.alert('Error', error);
            });
        } else {
          Linking.addEventListener('url', this.handleAuthToken);
        }
      })
      .catch((error) => {
        Alert.alert('Error', error);
      });
  }

  componentWillUnmount() {
    Linking.removeEventListener(this.handleAuthToken);
  }

  openLoginPage() {
    Linking.openURL('https://wespot-arlearn.appspot.com/Login.html?client_id=dojo-ibl&redirect_uri=dojoiblmobile://dojo-ibl.appspot.com/oauth/wespot&response_type=code&scope=profile+email')
      .catch((error) => {});
  }

  handleAuthToken(event) {
    const authToken = (event.url).split('code=')[1];

    Auth.getAccessTokenJson(authToken)
      .then((json) => {
        this.setState({
          accessToken: json.access_token
        });

        const expiresAt = Math.round(Date.now() / 1000) + json.expires_in;

        return Auth.saveTokens(authToken, json.access_token, expiresAt);
      })
      .then((tokens) => {
        this.setState({
          loggedIn: true,
          tokens: tokens
        });
      })
      .catch((error) => {
        Alert.alert('Error', error);
      });
  }

  logoutWithConfirm() {
    Alert.alert(
      'Are you sure you want to log out?',
      'Are you sure you want to log out? You\'ll have to log in again to access your data.',
      [
        {text: 'Cancel'},
        {text: 'Logout', onPress: () => this.logout()}
      ]
    );
  }

  logout() {
    Auth.removeTokens()
      .then(() => {
        this.setState({
          loggedIn: false
        });
      })
      .catch((error) => {
        Alert.alert('Error', error);
      });
  }

  render() {
    if (!this.state.loggedIn) {
      return <LoginPage openLoginPage={this.openLoginPage} />;
    } else {
      return <ProfilePage logout={this.logoutWithConfirm} tokens={this.state.tokens} />;
    }
  }
}
