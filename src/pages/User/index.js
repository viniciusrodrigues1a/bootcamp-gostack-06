import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  StarredRepos,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  state = {
    starredRepos: [],
    page: 1,
    loading: false,
    refreshing: false,
  };

  componentDidMount() {
    this.apiCall();
  }

  apiCall = async () => {
    const { page, starredRepos } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading: page === 1 });

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page,
      },
    });

    this.setState({
      starredRepos: [...starredRepos, ...response.data],
      loading: false,
      page: page + 1,
    });

    return response;
  };

  refreshStarredRepos = async () => {
    await this.setState({
      refreshing: true,
      starredRepos: [],
      page: 1,
    });

    await this.apiCall();

    this.setState({ refreshing: false });
  };

  handleNavigation = item => {
    const { navigation } = this.props;

    navigation.navigate('Repository', {
      repoURL: item.html_url,
      repoName: item.name,
    });
  };

  render() {
    const { navigation } = this.props;
    const { starredRepos, loading, refreshing } = this.state;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading />
        ) : (
          <>
            <StarredRepos
              data={starredRepos}
              keyExtractor={star => String(star.id)}
              onEndReachedThreshold={0.2}
              onEndReached={this.apiCall}
              onRefresh={this.refreshStarredRepos}
              refreshing={refreshing}
              renderItem={({ item }) => (
                <Starred onPress={() => this.handleNavigation(item)}>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              )}
            />
          </>
        )}
      </Container>
    );
  }
}

User.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    getParam: PropTypes.func,
  }).isRequired,
};
