import React, {Component} from 'react';
import { withRouter, Link } from "react-router-dom";
import logoTmp from '../../assets/images/logo_tmp.png';
import { ArrowRight } from 'react-feather';
import './NavbarContainer.css';
import AppContext from '../../contexts/AppContext';
class NavbarContainer extends Component { 
  static contextType = AppContext;

  async componentDidMount() {
    if (this.props && this.props.location && this.props.location.pathname && ["/swap", "/pool", "/history"].includes(this.props.location.pathname)) {
        await this.context.setState({
          route: this.props.location.pathname.replace('/','')
        });
    }
  }

  render() {
    return (
        <header>
            <Link to="/" className="logo"><img src={logoTmp} height="40px" alt="Greenwood"/></Link>
            { this.context.connected ? <Link className="nav-anchor" style={{paddingLeft: "20px"}} to="/history">My swaps</Link> : null }
            <Link className="nav-anchor" style={{paddingLeft: "20px"}} to={this.context.route && this.context.route === 'swap' ? '/pool' : this.context.route === 'history' ? '/swap' : '/swap'}><button style={{borderRadius: "4px"}} className="nav-button"><span className="va-middle-bg-transparent">{this.context.route && this.context.route === 'swap' ? 'Pool' : this.context.route === 'history' ? 'Swap' : 'Swap'}</span><ArrowRight className="va-middle-bg-transparent transx-2px-right"/> </button></Link>
        </header>
    )
  }
}

export default withRouter(NavbarContainer);


