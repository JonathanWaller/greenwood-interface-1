import React from 'react';
import PoolContainer from "../../components/PoolContainer/PoolContainer.jsx"
import NavbarContainer from "../../components/NavbarContainer/NavbarContainer.jsx"
import FooterContainer from "../../components/FooterContainer/FooterContainer.jsx"
import './PoolView.css';

export default class PoolView extends React.Component {  
    render() {
        return (
            <div>
                <NavbarContainer></NavbarContainer>
                <PoolContainer></PoolContainer>
                <FooterContainer></FooterContainer>
            </div>
        )
    } 
}