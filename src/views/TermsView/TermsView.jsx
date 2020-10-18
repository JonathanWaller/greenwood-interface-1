import React from 'react';
import LandingNavbarContainer from "../../components/LandingNavbarContainer/LandingNavbarContainer.jsx"
import TermsContainer from "../../components/TermsContainer/TermsContainer.jsx"
import LandingFooterContainer from "../../components/LandingFooterContainer/LandingFooterContainer.jsx"
import './TermsView.css';

export default class TermsView extends React.Component {  
    render() {
        return (
            <div>
                <LandingNavbarContainer></LandingNavbarContainer>
                <TermsContainer></TermsContainer>
                <LandingFooterContainer></LandingFooterContainer>
            </div>
        )
    } 
}