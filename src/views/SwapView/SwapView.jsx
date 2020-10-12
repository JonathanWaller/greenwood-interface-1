import React from 'react';
import SwapContainer from "../../components/SwapContainer/SwapContainer.jsx"
import NavbarContainer from "../../components/NavbarContainer/NavbarContainer.jsx"
import FooterContainer from "../../components/FooterContainer/FooterContainer.jsx"
import './SwapView.css';
import AppContext from '../../contexts/AppContext';

export default class SwapView extends React.Component {
    static contextType = AppContext;
    render() {
        return (
            <div>

            { this.context.isDesktop ?

            <div>
                <NavbarContainer></NavbarContainer>
                <SwapContainer></SwapContainer>
                <FooterContainer></FooterContainer>
            </div>

            :

            <div>
                <NavbarContainer></NavbarContainer>
                <div className="aligner-mobile">
                    <div className="aligner-item-mobile">
                        <h1 className="landing-header-text" style={{textAlign: "center"}}>Greenwood is not available on mobile devices</h1>
                    </div>
                </div>
                <FooterContainer></FooterContainer>

            </div>
            
            }

            </div>
        )
    } 
}