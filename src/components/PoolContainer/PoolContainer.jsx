import React from 'react';
import { withRouter } from 'react-router-dom';
import './PoolContainer.css'
import coreAbi from '../../interfaces/v0.1.0_core'
import Web3 from 'web3';
import AppContext from '../../contexts/AppContext';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransactionToastContainer from '../TransactionToastContainer/TransactionToastContainer'
import ApprovalToastContainer from '../ApprovalToastContainer/ApprovalToastContainer'
import * as BigNumber from 'bignumber.js';

class PoolContainer extends React.Component {
  static contextType = AppContext;
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.handlePoolSubmit = this.handlePoolSubmit.bind(this);
    this.validatePoolForm = this.validatePoolForm.bind(this);
    this.getPoolDetails = this.getPoolDetails.bind(this);
    this.approveTransfer = this.approveTransfer.bind(this);
    this.processLiquidity = this.processLiquidity.bind(this);
  }

  async componentDidMount() {
    this.context.setState({
      approveRadio: false,
      selectedLiquidityAction: 'Supply'
    })
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
          poolDetailShare: poolShare,
          isValidLiquidityAmount: this.context.selectedLiquidityAmount !== '' && Number(this.context.selectedLiquidityAmount) > 0 ? true : false
        });

      } catch ( e ) {
        console.error(`Error fetching contract state for pool details - ${e.message}`)
      }
    } else {
      console.warn('Web3 is not defined in the app context...')
    }
  }

  async validatePoolForm() {
    if (this.context.selectedLiquidityAction && (this.context.selectedLiquidityAmount || this.context.selectedLiquidityAmount === '' ) && this.context.selectedLiquidityAsset) {
      await this.getPoolDetails();
    }
  }

  async handlePoolSubmit() {
    if( this.context.connected ) {
      this.context.setState({
        transactionStatus: 'Pending',
        transactionHash: ''
      });
        
      let allowance;
      try {
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_ID))
        const greenwoodAddress = this.context.contractAddresses[this.context.selectedLiquidityAsset];
        const tokenAbi = this.context.underlyingABIs[this.context.selectedLiquidityAsset];
        const tokenAddress = this.context.underlyingAddresses[this.context.selectedLiquidityAsset];
        const instance = new web3.eth.Contract(tokenAbi, tokenAddress);
        allowance = await instance.methods.allowance(this.context.address, greenwoodAddress).call();
      } catch( e ) {
        console.error( `Error getting allowance for current user in pool view - ${e.message}` );
      }

      if (Number(allowance) >= Number(this.context.selectedLiquidityAmount)) {
        try {
          await this.processLiquidity()
        } catch (e) {
          console.error( `Error executing liquidity action with allowance - ${e.message}` );
        }
      } else {
        if (this.context.approveRadio === true) {
          try {
            if (this.context.selectedLiquidityAction === 'Supply') {
              await this.approveTransfer();
              await this.processLiquidity();
            } else if (this.context.selectedLiquidityAction === 'Withdraw') {
              await this.processLiquidity();
            } else {
              throw new Error( 'Malformed liquidity action' )
            }
          } catch (e) {
            console.error(`Error executing liquidity action with infinite approval - ${e.message}`)
          }
        } else {
          try {
            if (this.context.selectedLiquidityAction === 'Supply') {
              await this.approveTransfer();
              await this.processLiquidity();
            } else if (this.context.selectedLiquidityAction === 'Withdraw') {
              await this.processLiquidity();
            } else {
              throw new Error( 'Malformed liquidity action' )
            }
          } catch (e) {
            console.error(`Error executing liquidity action with scoped approval - ${e.message}`)
          }
        }
      }
    } else {
      alert('Connect to a wallet to manage your account liquidity')
    }
  }

  async approveTransfer() {
    this.context.setState({
      approvalStatus: 'Pending',
      approvalHash: '',
    });
    const web3 = this.context.web3
    const greenwoodAddress = this.context.contractAddresses[this.context.selectedLiquidityAsset];
    const tokenAbi = this.context.underlyingABIs[this.context.selectedLiquidityAsset];
    const tokenAddress = this.context.underlyingAddresses[this.context.selectedLiquidityAsset];
    const instance = new web3.eth.Contract(tokenAbi, tokenAddress);

    if (this.context.approveRadio === true ) {
      try {
        toast(<ApprovalToastContainer/>, {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          transition: Zoom
        });
        const MAX_UINT = (new BigNumber(2)).pow(256).minus(1);
        const result = await instance.methods.approve(greenwoodAddress, MAX_UINT).send({from: this.context.address});
        this.context.setState({
          approvalStatus: 'Complete',
          approvalHash: result.transactionHash
        });
      } catch (e) {
        toast.dismiss()
        this.context.setState({
          approvalStatus: 'Pending'
        });
        throw new Error(`${e.message}`)
      }
    } else {
      try {
        toast(<ApprovalToastContainer/>, {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          transition: Zoom
        });
        const approvalAmount = (Number(this.context.selectedLiquidityAmount) * Number(this.context.assetMantissas[this.context.selectedLiquidityAsset])).toLocaleString('fullwide', {useGrouping:false});
        const result = await instance.methods.approve(greenwoodAddress, approvalAmount).send({from: this.context.address});
        this.context.setState({
          approvalStatus: 'Complete',
          approvalHash: result.transactionHash
        });
      } catch (e) {
        toast.dismiss()
        this.context.setState({
          approvalStatus: 'Pending'
        });
        throw new Error(`${e.message}`)
      }
    }
  }

  async processLiquidity() {
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
          toast.dismiss()
          this.context.setState({
            transactionStatus: 'Pending'
          });
          throw new Error(`Error adding liquidity - ${e.message}`);
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
          toast.dismiss()
          this.context.setState({
            transactionStatus: 'Pending'
          });
          throw new Error(`Error removing liquidity - ${e.message}`);
        }
      } else {
        throw new Error('Malformed liquidity action');
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
        <div className="" style={{width: "100%", textAlign: "center", minHeight: "75vh"}}>
          <div className="chain-warning-div">
            <button disabled className={this.context.isOnSupportedNetwork ? "chain-warning-btn-hidden" : "chain-warning-btn"}>You must be connected to the Kovan testnet to use Greenwood</button>
          </div>
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
            <button 
              className={this.context.connected && this.context.isValidLiquidityAmount && this.context.isOnSupportedNetwork ? 'submit-btn' : 'submit-btn-not-connected'} 
              onClick={this.context.connected && this.context.isOnSupportedNetwork ? this.handlePoolSubmit : this.context.onConnect}
              disabled={this.context.connected && !this.context.isOnSupportedNetwork ? true : false}>
                {this.context.connected && this.context.isOnSupportedNetwork ? this.context.selectedLiquidityAction : this.context.connected && !this.context.isOnSupportedNetwork ? 'Use a supported network' : 'Connect to a wallet'}
            </button>

            <div style={{marginTop: "5%"}} className={this.context.isValidLiquidityAmount && this.context.isOnSupportedNetwork ? ' aligner infinite-approve-div' : 'aligner infinite-approve-div-hidden'}>
              <label className={this.context.approveRadio === true ? "approve-label" : "approve-label-disabled"}><input type="checkbox" name="approveRadio" id="name" className="approve-radio" onChange={this.handleChange}/>Infinite approval</label>
            </div>
            <div className="aligner" style={{marginTop: "1%", textAlign: "center"}}>
              <button disabled className={this.context.isValidLiquidityAmount ? "warning-btn-hidden" : "warning-btn"}>{`The ${this.context.selectedLiquidityAction.toLowerCase()} amount can not be 0`}</button>
            </div>
            </div>

          </div>

        </div>
      </main>
    );
  }

}

export default withRouter(PoolContainer);