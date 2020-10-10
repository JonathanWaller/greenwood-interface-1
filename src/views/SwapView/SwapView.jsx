import React from 'react';
import SwapContainer from "../../components/SwapContainer/SwapContainer.jsx"
import NavbarContainer from "../../components/NavbarContainer/NavbarContainer.jsx"
import FooterContainer from "../../components/FooterContainer/FooterContainer.jsx"
import './SwapView.css';

export default class SwapView extends React.Component {  
    render() {
        return (
            <div>
                <NavbarContainer></NavbarContainer>
                <SwapContainer></SwapContainer>
                <FooterContainer></FooterContainer>
            </div>
        )
    } 
}