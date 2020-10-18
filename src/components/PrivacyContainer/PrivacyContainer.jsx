import React, {Component} from 'react';
import { withRouter } from "react-router-dom";
import './PrivacyContainer.css';
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
            <div className="aligner aligner-landing" style={{height: "80vh"}}>
                <div style={{overflow: "scroll", height: "80vh", color: "#FFFFFF"}}>
                <h2>Privacy Policy</h2>
                <br/>
                <p>Your privacy is important to us. It is Greenwood Labs, Inc's policy to respect your privacy regarding any information we may collect from you across our website, <a href="https://www.greenwood.finance">https://www.greenwood.finance</a>, and other sites we own and operate.</p>
                <br/>
                <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.</p>
                <br/>
                <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
                <br/>
                <p>We don’t share any personally identifying information publicly or with third-parties, except when required to by law.</p>
                <br/>
                <p>Our website may link to external sites that are not operated by us. Please be aware that we have no control over the content and practices of these sites, and cannot accept responsibility or liability for their respective privacy policies.</p>
                <br/>
                <p>You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of your desired services.</p>
                <br/>
                <p>Your continued use of our website will be regarded as acceptance of our practices around privacy and personal information. If you have any questions about how we handle user data and personal information, feel free to contact us.</p>
                <br/>
                <p>This policy is effective as of 1 October 2020.</p>
                <br/>
                <p><a href="https://getterms.io" title="Generate a free privacy policy" style={{color: "#66676F"}}>Privacy Policy created with GetTerms.</a></p>

                </div>
            </div>
        </main>
    )
  }
}

export default withRouter(LandingContainer);


