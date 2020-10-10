import React from 'react';
import LandingNavbarContainer from "../../components/LandingNavbarContainer/LandingNavbarContainer.jsx"
import LandingContainer from "../../components/LandingContainer/LandingContainer.jsx"
import FooterContainer from "../../components/FooterContainer/FooterContainer.jsx"
import './LandingView.css';

export default class PoolView extends React.Component {  
    render() {
        return (
            <div>
                <LandingNavbarContainer></LandingNavbarContainer>
                <LandingContainer></LandingContainer>
                <FooterContainer></FooterContainer>
            </div>
        )
    } 
}