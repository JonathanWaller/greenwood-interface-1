import React from 'react';
import { withRouter } from 'react-router-dom';
import './HistoryContainer.css'
// import coreAbi from '../../interfaces/v0.1.0_core'
// import Web3 from 'web3';
import moment from 'moment';
import AppContext from '../../contexts/AppContext';
// import HistoryTable from '../HistoryTable/HistoryTable'
import { ToastContainer, toast, Zoom } from 'react-toastify';
import TransactionToastContainer from '../TransactionToastContainer/TransactionToastContainer'
// import axios from 'axios'

class HistoryContainer extends React.Component {
  static contextType = AppContext;
  constructor(props, context) {
    super(props, context);
    this.closeSwap = this.closeSwap.bind(this);
  }
  
  async componentDidMount() {
    await this.context.getHistory();
  }

  async closeSwap(swapKey, asset) {
    this.context.setState({
        transactionStatus: 'Pending',
        transactionHash: ''
    });
    const web3 = this.context.web3
    const abi = this.context.greenwoodABIs[asset]
    // const abi = coreAbi['abi'];
    const address = this.context.greenwoodAddresses[asset];
    const instance = new web3.eth.Contract(abi, address);

    try {
        toast(<TransactionToastContainer/>, {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            transition: Zoom
          });
          const result = await instance.methods.closeSwap(web3.utils.keccak256(swapKey)).send({from: this.context.address});
          this.context.setState({
            transactionStatus: 'Complete',
            transactionHash: result.transactionHash
          });
          await this.context.getHistory();
    } catch (e) {
        toast.dismiss()
        this.context.setState({
          transactionStatus: 'Pending'
        });
        console.error(`Error closing swap - ${e.message}`);
    }
  }
  
  render() {
    return (
      <main className="aligner">
        <div className="aligner-item" style={{width: "100%", textAlign: "center"}}>
            <div style={{height: "80vh", overflow: "scroll"}}>
            <ToastContainer
            position="bottom-right"
            autoClose={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            transition={Zoom}
            />
            <table className="table">
                <thead className="thead-light sticky-header">
                    {this.context.historyColumns && this.context.historyColumns.length ? this.context.historyColumns.map(function(item, key) {
                        return (
                            <tr key = {key}>
                                <th scope="col">{item.swapType}</th>
                                {/* <th scope="col">{item.asset}</th> */}
                                {/* <th scope="col">{item.notional}</th> */}
                                {/* <th scope="col">{item.swapRate}</th> */}
                                <th scope="col">{item.userCollateral}</th>
                                {/* <th scope="col">{item.initTime}</th> */}
                                {/* <th scope="col">{item.initIndex}</th> */}
                                <th scope="col">{item.expiryTime}</th>
                                <th scope="col">{item.liquidationTime}</th>
                                <th scope="col">{item.currentProfit}</th>
                                <th scope="col">Settle Swap</th>
                            </tr>
                        )
                    }) : null }
                </thead>
                <tbody>
                    {this.context.accountSwaps && this.context.accountSwaps.length ? this.context.accountSwaps.map(function(item, key) {
                        return (
                            <tr key = {key} >
                                <th scope="row">{item.swapType === 'pFix' ? 'Pay Fixed' : 'Receive Fixed'}</th>
                                {/* <th>{item.asset}</th> */}
                                {/* <th>{item.notional}</th> */}
                                {/* <th>{item.swapRate}%</th> */}
                                <th>{item.userCollateral}</th>
                                {/* <th>{moment.unix(Number(item.initTime)).format('MMMM Do, YYYY')}</th> */}
                                {/* <th>{item.initIndex}%</th> */}
                                <th>{item.expiryTime}</th>
                                <th>{item.liquidationTime}</th>
                        <th className={Number(item.currentProfit) > 0 ? 'color-green' : 'color-red'}>{Number(item.currentProfit) > 0 ? '+' : ''}{item.currentProfit} {item.asset}</th>
                                <th>{moment().utc().unix() - item.initTime < this.context.swapDurationInSeconds ? <button disabled className="close-swap-btn">This swap is active</button> : <button className="close-swap-btn" onClick={ () => this.closeSwap(item.swapKey, item.asset.toLowerCase()) }>Close this swap now</button> }</th>
                            </tr>
                        )
                    }.bind(this)) :
                    
                    <tr>
                        <td colSpan="8" style={{textAlign: "center"}}>
                            {this.context.isOnSupportedNetwork ? "You have no open swaps"
                            
                            : 
                            
                            <div className="chain-warning-div">
                              {/* <button disabled className="chain-warning-btn">Connect to the Kovan testnet to use Greenwood</button> */}
                              <button disabled className="chain-warning-btn">Connect to the Ethereum Mainnet to use Greenwood</button>
                            </div>
                            
                            }

                        </td>


                        

                    </tr>
                    }
                </tbody>
            </table>
            </div>
        </div>
      </main>
    );
  }

}

export default withRouter(HistoryContainer);