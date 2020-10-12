import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { ArrowUpRight } from 'react-feather';
import './LandingContainer.css';
import stag from '../../assets/images/stag_large.png'
import AppContext from '../../contexts/AppContext';

class LandingContainer extends Component {
  static contextType = AppContext;
  constructor(props) {
    super(props);    
    this.state = {
    }
  }

  async componentDidMount() {
  }

  render() {
    return (
        <main className="">
            <div className="aligner aligner-landing">
              <div className="landing-inner">
                  <h1 className="landing-header-text">The automated interest rate swap protocol on Ethereum</h1>
                  <h6 className="landing-header-subtext">Greenwood interest rate swaps allow cryptocurrency lenders and borrowers to turn their floating interest rates into fixed interest rates</h6>
                  <h6 className="whitepaper-h6"><a className="whitepaper-link" href="/rho-whitepaper.pdf" target="_blank" rel="noopener noreferrer">Read the whitepaper<ArrowUpRight className="va-middle-bg-transparent transx-2px-right"/></a></h6>
              </div>
              <img src={stag} className="landing-stag" alt="Greenwood" style={{maxHeight: "80vh"}}/>
              {this.context.isDesktop ? null : <button disabled className="badge-btn">Greenwood is not available on mobile devices</button>}
            </div>
        </main>
    )
  }
}

export default withRouter(LandingContainer);


