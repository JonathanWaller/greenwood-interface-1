import React from 'react';
import LandingNavbarContainer from "../../components/LandingNavbarContainer/LandingNavbarContainer.jsx"
import PrivacyContainer from "../../components/PrivacyContainer/PrivacyContainer.jsx"
import LandingFooterContainer from "../../components/LandingFooterContainer/LandingFooterContainer.jsx"
import './PrivacyView.css';

export default class TermsView extends React.Component {  
    render() {
        return (
            <div>
                <LandingNavbarContainer></LandingNavbarContainer>
                <PrivacyContainer></PrivacyContainer>
                <LandingFooterContainer></LandingFooterContainer>
            </div>
        )
    } 
}