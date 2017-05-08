import React, { PureComponent } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';
import { sizes } from '../styles/sizes';
import Auth from '../lib/Auth';
import AllInquiriesList from '../components/AllInquiriesList';

export default class AllInquiries extends PureComponent {
  static navigationOptions = {
    tabBarLabel: 'All inquiries'
  };

  shouldComponentUpdate() { return false; }

  render() {
    return (
      <ScrollView style={globalStyles.containerScrollView}>
        <Text style={globalStyles.title}>All inquiries</Text>
        <AllInquiriesList navigate={this.props.screenProps.navigate} tokens={this.props.screenProps.tokens} />
      </ScrollView>
    );
  }
}