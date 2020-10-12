import React from 'react';
import HistoryContainer from "../../components/HistoryContainer/HistoryContainer.jsx"
import NavbarContainer from "../../components/NavbarContainer/NavbarContainer.jsx"
import FooterContainer from "../../components/FooterContainer/FooterContainer.jsx"
import './HistoryView.css';
import AppContext from '../../contexts/AppContext';

export default class HistoryView extends React.Component {
    static contextType = AppContext;
    
    render() {
        return (
            <div>

                { this.context.isDesktop ?

                <div>
                    <NavbarContainer></NavbarContainer>
                    <HistoryContainer></HistoryContainer>
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