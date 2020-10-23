import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { ArrowUpRight } from 'react-feather';
import './LandingContainer.css';
// import stag from '../../assets/images/stag_large_grey.png'
import tokenGrid from '../../assets/images/token_grid.png'
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
        <main className="" style={{backgroundColor: "#2D2F3A"}}>
            <div className="aligner aligner-landing">
              <div className="landing-inner">
                  {/* <h1 className="landing-header-text">Ethereum's automated interest rate swap protocol</h1> */}
                  {/* <h1 className="landing-header-text">ETHEREUM'S AUTOMATED INTEREST RATE SWAP PROTOCOL</h1> */}
                  <h1 className="landing-header-text">Interest rate swaps for decentralized finance</h1>
                  <h6 className="landing-header-subtext">Turn Compound's floating interest rates into fixed interest rates</h6>
                  <div style={{display:"flex", verticalAlign:"middle"}}>
                  <h6 className="whitepaper-h6"><a className="whitepaper-link" href="/rho-revision.pdf" target="_blank" rel="noopener noreferrer">Read the whitepaper<ArrowUpRight className="va-middle-bg-transparent transx-2px-xy"/></a></h6>
                  {/* <Link className="nav-anchor" to="/swap"><button style={{borderRadius: "4px"}} className="nav-button-go-to"><span className="va-middle-bg-transparent">Go to app</span><ArrowRight className="va-middle-bg-transparent transx-2px-right"/> </button></Link> */}

                  </div>
                  
              </div>
              {/* <img src={stag} className="landing-stag" alt="Greenwood" style={{maxHeight: "80vh", opacity: "0"}}/> */}
              <div>
                <img src={tokenGrid} className="landing-stag" alt="Greenwood" style={{maxHeight: "50vh"}}/>
              </div>
              {this.context.isDesktop ? null : <button disabled className="badge-btn">Greenwood is not available on mobile devices</button>}
            </div>
        </main>
    )
  }
}

export default withRouter(LandingContainer);


