import { Spin, Alert } from 'antd';
import { Component } from 'react';

export default class ComponentState extends Component {
  render() {
    const { componentState } = this.props;
    return (
      <>
        {componentState.loading && <Spin style={{ position: 'fixed', top: '50%', left: '50%' }} size="large" />}
        {componentState.error && (
          <Alert message="Connection error" description="Check your VPN connection" type="error" />
        )}
        {componentState.emptySearch && (
          <Alert
            message="No found"
            description="Check if the movie title is correct or the movie is not in the TMDB"
            type="info"
          />
        )}
        {componentState.loading == false && componentState.error == false && this.props.children}
      </>
    );
  }
}
