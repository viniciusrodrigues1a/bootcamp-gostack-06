import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

export default class Repository extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repoName'),
  });

  state = {
    repoURL: '',
  };

  componentDidMount() {
    const { navigation } = this.props;
    const repoURL = navigation.getParam('repoUrl');
    this.setState({ repoURL });
  }

  render() {
    const { repoURL } = this.state;

    return <WebView source={{ uri: repoURL }} />;
  }
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
