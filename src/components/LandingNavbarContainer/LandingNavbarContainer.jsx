import React, {Component} from 'react';
import { withRouter, Link } from "react-router-dom";
import { ArrowRight } from 'react-feather';
import './LandingNavbarContainer.css';
// import logoTmp from '../../assets/images/logo_tmp.png';
// import logoSmall from '../../assets/images/logo_small.png';

class LandingNavbarContainer extends Component { 
  constructor(props) {
    super(props);    
    this.state = {
    }
  }

  async componentDidMount() {
  }

  render() {
    return (
        <header-landing style={{background: "#2D2F3A"}}>
            {/* <Link to="/" className="logo"><img src={logoSmall} className="logo-img" alt="Greenwood"/></Link> */}
            <Link to="/" className="logo">Greenwood</Link>
            <Link className="nav-anchor" to="/swap"><button style={{borderRadius: "4px"}} className="nav-button-go-to"><span className="va-middle-bg-transparent">Go to app</span><ArrowRight className="va-middle-bg-transparent transx-2px-right"/> </button></Link>
        </header-landing>

    )
  }
}

export default withRouter(LandingNavbarContainer);


