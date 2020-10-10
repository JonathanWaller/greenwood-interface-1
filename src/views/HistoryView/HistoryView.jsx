import React from 'react';
import HistoryContainer from "../../components/HistoryContainer/HistoryContainer.jsx"
import NavbarContainer from "../../components/NavbarContainer/NavbarContainer.jsx"
import FooterContainer from "../../components/FooterContainer/FooterContainer.jsx"
import './HistoryView.css';

export default class HistoryView extends React.Component {  
    render() {
        return (
            <div>
                <NavbarContainer></NavbarContainer>
                <HistoryContainer></HistoryContainer>
                <FooterContainer></FooterContainer>
            </div>
        )
    } 
}