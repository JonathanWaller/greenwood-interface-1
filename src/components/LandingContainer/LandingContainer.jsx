import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import { ArrowUpRight } from 'react-feather';
import './LandingContainer.css';
import stag from '../../assets/images/stag_large.png'

class LandingContainer extends Component { 
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
            <div className="aligner" style={{display: "flex", justifyContent: "space-evenly", textAlign: "left"}}>
              <div style={{maxWidth: '50%', textAlign: 'left'}}>
                  <h1 className="landing-header-text" style={{textAlign: "left"}}>The automated interest rate swap protocol on Ethereum</h1>
                  <h6 className="landing-header-subtext" style={{textAlign: "left"}}>Greenwood interest rate swaps allow cryptocurrency lenders and borrowers to turn their floating interest rates into fixed interest rates</h6>
                  <h6 className="whitepaper-h6"><a className="whitepaper-link" href="/rho-whitepaper.pdf" target="_blank" rel="noopener noreferrer">Read the whitepaper<ArrowUpRight className="va-middle-bg-transparent transx-2px-right"/></a></h6>
              </div>
              <img src={stag} height="50%" alt="Greenwood" style={{maxHeight: "80vh"}}/>
            </div>
        </main>
    )
  }
}

export default withRouter(LandingContainer);


