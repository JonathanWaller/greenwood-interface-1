import React, {Component} from 'react';
import { withRouter, Link } from "react-router-dom";
// import logoTmp from '../../assets/images/logo_tmp.png';
import { ArrowRight } from 'react-feather';
import './NavbarContainer.css';
import AppContext from '../../contexts/AppContext';
class NavbarContainer extends Component { 
  static contextType = AppContext;

  async componentDidMount() {
    if (this.props && this.props.location && this.props.location.pathname && ["/swap", "/pool", "/dashboard"].includes(this.props.location.pathname)) {
        await this.context.setState({
          route: this.props.location.pathname.replace('/','')
        });
    }
  }

  render() {
    return (
        <header>
            {/* <Link to="/" className="app-logo"><img src={logoTmp} className="app-logo-img" alt="Greenwood"/></Link> */}
            <Link to="/" className="app-logo">Greenwood</Link>
            { this.context.connected && this.context.isDesktop ? <Link className={this.context.accountSwaps.length ? 'nav-anchor-orange' : 'nav-anchor'} style={{paddingLeft: "20px", fontFamily: "Roboto Mono"}} to="/dashboard">My swaps<span disabled className={this.context.accountSwaps.length ? "account-swap-span" : null}>{this.context.accountSwaps.length ? this.context.accountSwaps.length : null}</span></Link> : null }
            { this.context.isDesktop ? <Link className="nav-anchor" style={{paddingLeft: "20px"}} to={this.context.route && this.context.route === 'swap' ? '/pool' : this.context.route === 'history' ? '/swap' : '/swap'}><button style={{borderRadius: "4px"}} className="nav-button"><span className="va-middle-bg-transparent">{this.context.route && this.context.route === 'swap' ? 'Pool' : this.context.route === 'dashboard' ? 'Swap' : 'Swap'}</span><ArrowRight className="va-middle-bg-transparent transx-2px-right"/> </button></Link> : null}
        </header>
    )
  }
}

export default withRouter(NavbarContainer);


