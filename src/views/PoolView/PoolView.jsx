import React from 'react';
import PoolContainer from "../../components/PoolContainer/PoolContainer.jsx"
import NavbarContainer from "../../components/NavbarContainer/NavbarContainer.jsx"
import FooterContainer from "../../components/FooterContainer/FooterContainer.jsx"
import './PoolView.css';
import AppContext from '../../contexts/AppContext';

export default class PoolView extends React.Component {  
    static contextType = AppContext;
    render() {
        return (
            <div>

                { this.context.isDesktop ?

                <div>
                    <NavbarContainer></NavbarContainer>
                    <PoolContainer></PoolContainer>
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