import React, {Component} from 'react';
import { GitHub, Twitter } from 'react-feather';
import './FooterContainer.css'
import discord from '../../assets/images/discord_icon.png';
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
                <ul className="footer__nav__links">
                    <li><a href="https://github.com/greenwood-finance" title="Greenwood GitHub"><span><GitHub className="va-middle-bg-transparent filled-footer-icon"/></span></a></li>
                    <li><a href="https://twitter.com/GreenwoodDeFi" title="Greenwood Twitter"><span><Twitter className="va-middle-bg-transparent filled-footer-icon" /></span></a></li>
                    <li className="footer-last-li"><a href="https://discord.com/invite/dxejH7fAxr" title="Greenwood Discord"><span><img className="va-middle-bg-transparent filled-footer-landing-image" src={discord} alt="discord"/></span></a></li>
                </ul>
            </div>
        </footer>
    )
  }
}
