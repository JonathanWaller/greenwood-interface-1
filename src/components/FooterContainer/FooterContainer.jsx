import React, {Component} from 'react';
import { GitHub, Twitter } from 'react-feather';
import './FooterContainer.css'

export default class FooterContainer extends Component { 
  constructor(props) {
    super(props);    
    this.state = {

    }

  }

  render() {
    return (
        <footer>
            <h6 className="copyright">&copy; 2020 Greenwood Labs, Inc.</h6>
            <div>
                <ul className="nav__links">
                    <li><a href="https://github.com/greenwood-finance" title="Greenwood GitHub"><span><GitHub className="va-middle-bg-transparent filled-footer-icon"/></span></a></li>
                    <li style={{paddingRight: "0"}}><a href="https://twitter.com/GreenwoodDeFi" title="Greenwood Twitter"><span><Twitter className="va-middle-bg-transparent filled-footer-icon" /></span></a></li>
                </ul>
            </div>
        </footer>
    )
  }
}
