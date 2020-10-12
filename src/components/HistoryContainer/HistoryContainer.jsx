import React from 'react';
import { withRouter } from 'react-router-dom';
import './HistoryContainer.css'
import coreAbi from '../../interfaces/v0.1.0_core'
import Web3 from 'web3';
import moment from 'moment';
import AppContext from '../../contexts/AppContext';
import HistoryTable from '../HistoryTable/HistoryTable'

class HistoryContainer extends React.Component {
  static contextType = AppContext;
  
  async componentDidMount() {
    await this.getHistory();
  }

  async getHistory() {
    if( this.context && this.context.address ) {
        // const web3 = this.context.web3
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_ID))
        const abi = coreAbi['abi'];

        let swaps = [];
        for( let asset of this.context.greenwoodAssets) {
            const address = this.context.contractAddresses[asset.key];
            const instance = new web3.eth.Contract(abi, address);
            let swapNumbers;

            try {
                swapNumbers = await instance.methods.swapNumbers(this.context.address).call();
                swapNumbers = Number(swapNumbers)
            } catch ( e ) {
                console.error(`Error fetching swap numbers for ${ asset.display } - ${e.message}`)
            }

            if ( swapNumbers && swapNumbers > 0 ) {
                let assetSwaps = [];
                await Promise.all (
                    [...Array(swapNumbers).keys()].map( async swapNumber => {
                        try {
                            const addressBytes = web3.utils.padLeft(web3.utils.toHex(this.context.address), 64)
                            const swapNumberBytes = web3.utils.padLeft(web3.utils.toHex(swapNumber), 64)
                            const swapKey = addressBytes.concat(swapNumberBytes.replace('0x',''));
                   
                            const swap = await instance.methods.getSwap(web3.utils.keccak256(swapKey)).call();
                            const swapType = await instance.methods.getSwapType (web3.utils.keccak256(swapKey)).call();

                            const data = {
                                swapType: swapType,
                                notional: (Number(swap.notional) * this.context.contractShift).toFixed(2),
                                initTime: moment.unix(parseInt(Number(swap.initTime) * this.context.contractShift)).format('MMMM Do, YYYY'),
                                swapRate: ((Number(swap.swapRate) * this.context.contractShift) * 100).toFixed(2),
                                initIndex: (Number(swap.initIndex) * this.context.contractShift).toFixed(2),
                                userCollateral: (Number(swap.userCollateral) * this.context.contractShift).toFixed(2),
                                asset: asset.display
                            };
                            if (swapType !== '') {
                                assetSwaps.push(data);
                            }
                        } catch ( e ) {
                            console.error( `Error fetching swap number ${swapNumber} for asset ${asset.display} - ${e.message}` );
                        }
                    })
                );
                swaps.push(...assetSwaps);
            }
        }

        swaps.sort((a,b) => (a.initTime < b.initTime) ? 1 : ((b.initTime < a.initTime) ? -1 : 0)); 


        await this.context.setState({
            accountSwaps: swaps
        })
    }
  }
  
  render() {
    return (
      <main className="aligner">
        <div className="aligner-item" style={{width: "100%", textAlign: "center"}}>
            <HistoryTable/>
        </div>
      </main>
    );
  }

}

export default withRouter(HistoryContainer);