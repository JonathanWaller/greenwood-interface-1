import React from 'react';
import { withRouter } from 'react-router-dom';
import './PoolContainer.css'
import coreAbi from '../../interfaces/v0.1.0_core'
import Web3 from 'web3';
import AppContext from '../../contexts/AppContext';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransactionToastContainer from '../TransactionToastContainer/TransactionToastContainer'

class PoolContainer extends React.Component {
  static contextType = AppContext;
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.handlePoolSubmit = this.handlePoolSubmit.bind(this);
    this.validatePoolForm = this.validatePoolForm.bind(this);
    this.getPoolDetails = this.getPoolDetails.bind(this);
  }

  async componentDidMount() {
    this.validatePoolForm();
  }
  
  async handleChange(e) {
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;
    
    await this.context.setState({
        [name]: value,
    }, () => {
        this.validatePoolForm();
    });
  }

  async getPoolDetails() {
    if ( this.context.connected && this.context.web3 && this.context.web3 !== null && this.context.web3 !== 'null') { 
      // const web3 = this.context.web3
      const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_ID))
      const abi = coreAbi['abi'];
      const address = this.context.contractAddresses[this.context.selectedLiquidityAsset];
      const instance = new web3.eth.Contract(abi, address);
      try {
        const stateResult = await instance.methods.getState().call();
        const accountResult = await instance.methods.getAccount(this.context.address).call();
        const totalLiquidity = Number(stateResult.totalLiquidity) * this.context.contractShift;
        const accountBalance = Number(accountResult.amount) * this.context.contractShift;
        
        let newAccountLiquidity, poolShare;
        if (this.context.selectedLiquidityAction === 'Supply') {
          newAccountLiquidity = (accountBalance + Number(this.context.selectedLiquidityAmount)).toFixed(2);
          if (totalLiquidity === 0) {
            poolShare = '100.00'
          } else {
            poolShare = ((newAccountLiquidity / (totalLiquidity + Number(this.context.selectedLiquidityAmount))) * 100).toFixed(2);
            if (Number(poolShare) < 0.01) {
              poolShare = '< 0.01'
            }
          }
        } else if (this.context.selectedLiquidityAction === 'Withdraw') {
          newAccountLiquidity = (Math.max(accountBalance - Number(this.context.selectedLiquidityAmount),0)).toFixed(2);
          if (totalLiquidity === 0) {
            poolShare = '100.00'
          } else {
            poolShare = ((newAccountLiquidity / (totalLiquidity - Number(this.context.selectedLiquidityAmount))) * 100).toFixed(2);
            if (Number(poolShare) < 0.01) {
              poolShare = '< 0.01'
            }
          }
        } else {
          alert('Malformed pool action')
        }

        this.context.setState({
          poolDetailBalance: newAccountLiquidity,
          poolDetailShare: poolShare
        });

      } catch ( e ) {
        console.error(`Error fetching contract state for pool details - ${e.message}`)
      }
    } else {
      console.warn('Web3 is not defined in the app context...')
    }
  }

  async validatePoolForm() {
    if (this.context.selectedLiquidityAction && this.context.selectedLiquidityAmount && this.context.selectedLiquidityAsset) {
      await this.getPoolDetails();
    }
  }

  async handlePoolSubmit() {
    if( this.context.connected ) {
      this.context.setState({
        transactionStatus: 'Pending',
        transactionHash: ''
      });
      const web3 = this.context.web3
      const abi = coreAbi['abi'];
      const address = this.context.contractAddresses[this.context.selectedLiquidityAsset];
      const instance = new web3.eth.Contract(abi, address);
      const amount = (Number(this.context.selectedLiquidityAmount) * Number(this.context.assetMantissas[this.context.selectedLiquidityAsset])).toLocaleString('fullwide', {useGrouping:false})
      if ( this.context.selectedLiquidityAction === 'Supply' ) {
        try {
          toast(<TransactionToastContainer/>, {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            transition: Zoom
          });
          const result = await instance.methods.addLiquidity(amount).send({from: this.context.address});
          this.context.setState({
            transactionStatus: 'Complete',
            transactionHash: result.transactionHash
          });
          // console.log( 'ADD LIQUIDITY RESULT: ', result );
        } catch ( e ) {
          console.error(`Error adding liquidity - ${e.message}`) 
          toast.dismiss()
          this.context.setState({
            transactionStatus: 'Pending'
          });
        }
      } else if ( this.context.selectedLiquidityAction === 'Withdraw' ) {
        try {
          toast(<TransactionToastContainer/>, {
            position: "bottom-right",
            autoClose: false,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            transition: Zoom
          });
          const result = await instance.methods.removeLiquidity(amount).send({from: this.context.address});
          this.context.setState({
            transactionStatus: 'Complete',
            transactionHash: result.transactionHash
          });
          // console.log( 'REMOVE LIQUIDITY RESULT: ', result );
        } catch ( e ) {
          console.error(`Error removing liquidity - ${e.message}`);
          toast.dismiss()
          this.context.setState({
            transactionStatus: 'Pending'
          });
        }
      } else {
        alert('Malformed liquidity action');
      }
    } else {
      alert('Connect to a wallet to manage your account liquidity')
    }
  }

  
  render() {
    return (
      <main className="aligner">
        <ToastContainer
          position="bottom-right"
          autoClose={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          transition={Zoom}
        />
        <div className="" style={{width: "100%", textAlign: "center"}}>
          <select className="pool-select" name="selectedLiquidityAction" style={{marginRight: "0"}} onChange={this.handleChange}>
            {this.context.actions.map(function (item, key) {
              return ( <option value={item.key} key={item.key}>{item.display}</option>)
              })
            }
          </select>
          <input className="form-input" type="number" placeholder="---" name="selectedLiquidityAmount" onChange={this.handleChange} value={this.context.selectedLiquidityAmount}/>
          <select className="pool-select" name="selectedLiquidityAsset" onChange={this.handleChange}>
            {this.context.greenwoodAssets.map(function (item, key) {
              return ( <option value={item.key} key={item.key}>{item.display}</option>)
              })
            }
          </select>

          <div className="" style={{width: "35%", margin: "auto", marginTop: "5%"}}>

            { this.context.connected ?
            <div>
              <div className="pool-detail">
                <h6 className="pool-detail-label">Your account liquidity will be</h6>
                <div>
                    <ul className="pool__nav__links">
                        <li className="pool-detail-value">
                          {this.context.poolDetailBalance ? this.context.poolDetailBalance : '---'} {this.context.poolDetailBalance && this.context.selectedLiquidityAsset ? this.context.selectedLiquidityAsset.toUpperCase() : ''}
                        </li>
                    </ul>
                </div>
              </div>

              <div className="pool-detail">
                <h6 className="pool-detail-label">Your share of the pool will be</h6>
                <div>
                    <ul className="pool__nav__links">
                        <li className="pool-detail-value">
                          {this.context.poolDetailShare ? this.context.poolDetailShare + '%' : '---'}
                        </li>
                    </ul>
                </div>
              </div>
            </div>

            :

            null

            }

            <div style={{marginTop: "5%"}}>
            <button className={this.context.connected ? 'submit-btn' : 'submit-btn-not-connected'} onClick={this.context.connected ? this.handlePoolSubmit : this.context.onConnect}>{!this.context.connected ? 'Connect to wallet' : this.context.selectedLiquidityAction}</button>
            </div>

          </div>

        </div>
      </main>
    );
  }

}

export default withRouter(PoolContainer);