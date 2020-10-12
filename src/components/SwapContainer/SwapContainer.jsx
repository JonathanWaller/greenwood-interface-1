import React from 'react';
import { withRouter } from 'react-router-dom';
import './SwapContainer.css'
import '../TextSelect/TextSelect.css'
import coreAbi from '../../interfaces/v0.1.0_core'
import Web3 from 'web3';
import moment from 'moment';
import AppContext from '../../contexts/AppContext';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TransactionToastContainer from '../TransactionToastContainer/TransactionToastContainer'


class SwapContainer extends React.Component {
  static contextType = AppContext;
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.handleSwapSubmit = this.handleSwapSubmit.bind(this);
    this.validateSwapForm = this.validateSwapForm.bind(this);
    this.getFee = this.getFee.bind(this);
    this.getRate = this.getRate.bind(this);
    this.getMaturity = this.getMaturity.bind(this);
    this.getCollateral = this.getCollateral.bind(this);
    this.getSwapDetails = this.getSwapDetails.bind(this);
  }
  
  async componentDidMount() {
    this.validateSwapForm();
  }

  async handleChange(e) {
    let target = e.target;
    let value = target.type === 'checkbox' ? target.checked : target.value;
    let name = target.name;
    
    await this.context.setState({
        [name]: value,
    }, () => {
        this.validateSwapForm()
    });
  }

  async getFee( contract ) {
    const totalLiquidity = Number(contract.totalLiquidity) * this.context.contractShift;
    const feeBase = Number(contract.feeBase) * this.context.contractShift;
    const activeCollateral = Number(contract.activeCollateral) * this.context.contractShift;
    const feeSensitivity = Number(contract.feeSensitivity) * this.context.contractShift;

    if ( Number(totalLiquidity) === 0) {
      return Number(feeBase);
    } else {
      return (((Number(activeCollateral) * Number(feeSensitivity))/Number(totalLiquidity)) + Number(feeBase));
    }
  }

  async getRate( contract ) {
    let fee = await this.getFee( contract );
    let rateFactorDelta = 0;

    let rateFactor = Number(contract.rateFactor) * this.context.contractShift;
    const totalLiquidity = Number(contract.totalLiquidity) * this.context.contractShift;
    const rateFactorSensitivity = Number(contract.rateFactorSensitivity) * this.context.contractShift;
    const swapDuration = Number(contract.swapDuration) * this.context.contractShift;
    const rateRange = Number(contract.rateRange) * this.context.contractShift;
    const slopeFactor = Number(contract.slopeFactor) * this.context.contractShift;
    const yOffset = Number(contract.yOffset) * this.context.contractShift;

    if ( Number(totalLiquidity) !== 0 ) {
      rateFactorDelta = (this.context.selectedSwapAmount * (rateFactorSensitivity * swapDuration)) / totalLiquidity;
    }

    if( this.context.selectedSwapPosition === "pFix" ) {
      rateFactor += rateFactorDelta;
    } else if ( this.context.selectedSwapPosition === "rFix" ) {
      rateFactor -= rateFactorDelta;
      fee = -fee;
    }

    return (((rateRange * rateFactor / (Math.sqrt((rateFactor * rateFactor) + slopeFactor))) + yOffset + fee) * 100).toFixed(2);
  }

  async getMaturity( contract ) {
    const duration = Number(contract.swapDuration) * this.context.contractShift;
    return moment.utc().startOf('day').add(duration, 'day').format('MMMM Do, YYYY');
  }

  async getCollateral( contract ) {
    const swapDuration = Number(contract.swapDuration) * this.context.contractShift;
    const minPayoutRate = Number(contract.minPayoutRate) * this.context.contractShift;
    const maxPayoutRate = Number(contract.maxPayoutRate) * this.context.contractShift;
    const swapFixedRate = await this.getRate( contract );
    const daysInYear = 360;

    if (this.context.selectedSwapPosition === 'pFix') {
      return ((this.context.selectedSwapAmount * swapDuration * ( Number((swapFixedRate/100)) - minPayoutRate)) / daysInYear).toFixed(2)
    } else if (this.context.selectedSwapPosition === 'rFix') {
      return ((this.context.selectedSwapAmount * swapDuration * (maxPayoutRate - Number((swapFixedRate/100)))) / daysInYear).toFixed(2)
    }
  }

  async getSwapDetails() {
    // const web3 = this.context.web3
    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_ID))
    const abi = coreAbi['abi'];
    const address = this.context.contractAddresses['dai'];
    const instance = new web3.eth.Contract(abi, address);
    try {
      const result = await instance.methods.getState().call();
      const rate = await this.getRate( result );
      const maturity = await this.getMaturity( result );
      const fee = await this.getFee( result );
      const collateral = await this.getCollateral( result );

      await this.context.setState({
        swapDetailRate: rate
        , swapDetailMaturity: maturity
        , swapDetailFee: Number(fee * this.context.selectedSwapAmount).toFixed(2)
        , swapDetailCollateral: collateral
      });

    } catch ( e ) {
      console.error(`Error fetching contract state for swap details - ${e.message}`)
    }

  }

  async validateSwapForm() {
    if (this.context.selectedSwapPosition && this.context.selectedSwapAmount && this.context.selectedSwapAsset) {
      await this.getSwapDetails();
    }
  }

  async handleSwapSubmit() {
    if( this.context.connected ) {
      this.context.setState({
        transactionStatus: 'Pending',
        transactionHash: ''
      });
      const web3 = this.context.web3
      const abi = coreAbi['abi'];
      const address = this.context.contractAddresses[this.context.selectedSwapAsset];
      const instance = new web3.eth.Contract(abi, address);
      const amount = (Number(this.context.selectedLiquidityAmount) * Number(this.context.assetMantissas[this.context.selectedLiquidityAsset])).toLocaleString('fullwide', {useGrouping:false})
      if ( this.context.selectedSwapPosition === 'pFix' ) {
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
          const result = await instance.methods.openPayFixedSwap(amount).send({from: this.context.address});
          this.context.setState({
            transactionStatus: 'Complete',
            transactionHash: result.transactionHash
          });
          // console.log( 'PAY FIXED RESULT: ', result );
        } catch ( e ) {
          console.error(`Error opening payFixed swap - ${e.message}`);
          toast.dismiss()
          this.context.setState({
            transactionStatus: 'Pending'
          });
        }
      } else if ( this.context.selectedSwapPosition === 'rFix' ) {
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
          const result = await instance.methods.openReceiveFixedSwap(amount).send({from: this.context.address});
          this.context.setState({
            transactionStatus: 'Complete',
            transactionHash: result.transactionHash
          });
          // console.log( 'RECEIVE FIXED RESULT: ', result );
        } catch ( e ) {
          console.error(`Error opening receiveFixed swap - ${e.message}`)
          toast.dismiss()
          this.context.setState({
            transactionStatus: 'Pending'
          });
        }
      } else {
        alert('Malformed swap position');
      }
    } else {
      alert('Connect to a wallet to execute a swap')
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
          <select className="swap-select" name="selectedSwapPosition" onChange={this.handleChange}>
            {this.context.positions.map(function (item, key) {
              return ( <option value={item.key} key={item.key}>{item.display}</option>)
              })
            }
          </select>
          <span className="form-span">a fixed interest rate on</span>
          <input className="form-input" type="number" placeholder="---" name="selectedSwapAmount" onChange={this.handleChange} value={this.context.selectedSwapAmount}/>
          <select className="swap-select" name="selectedSwapAsset" onChange={this.handleChange}>
            {this.context.greenwoodAssets.map(function (item, key) {
              return ( <option value={item.key} key={item.key}>{item.display}</option>)
              })
            }
          </select>

          <div className="" style={{width: "35%", margin: "auto", marginTop: "5%"}}>
            <div className="swap-detail">
              <h6 className="swap-detail-label">The fixed rate for this swap is</h6>
              <div>
                  <ul className="swap__nav__links">
                    <li className="swap-detail-value">
                      {this.context.swapDetailRate ? this.context.swapDetailRate + '%' : '---'}
                    </li>
                  </ul>
              </div>
            </div>

            <div className="swap-detail">
              <h6 className="swap-detail-label">The payout day for this swap is</h6>
              <div>
                  <ul className="swap__nav__links">
                      <li className="swap-detail-value">
                        {this.context.swapDetailMaturity ? this.context.swapDetailMaturity : '---'} 
                      </li>
                  </ul>
              </div>
            </div>

            <div className="swap-detail">
              <h6 className="swap-detail-label">The liquidity fee for this swap is</h6>
              <div>
                  <ul className="swap__nav__links">
                      <li className="swap-detail-value">
                        {this.context.swapDetailFee ? this.context.swapDetailFee : '---'} {this.context.swapDetailFee && this.context.selectedSwapAsset ? this.context.selectedSwapAsset.toUpperCase() : ''} 
                      </li>
                  </ul>
              </div>
            </div>

            <div className="swap-detail">
              <h6 className="swap-detail-label">The collateral required for this swap is</h6>
              <div>
                  <ul className="swap__nav__links">
                      <li className="swap-detail-value">
                        {this.context.swapDetailCollateral ? this.context.swapDetailCollateral : '---'} {this.context.swapDetailCollateral && this.context.selectedSwapAsset ? this.context.selectedSwapAsset.toUpperCase() : ''} 
                        {/* <span className="va-middle-bg-transparent">
                          <HelpCircle className="detail-help-circle"/>
                        </span> */}
                      </li>
                  </ul>
              </div>
            </div>
            <div style={{marginTop: "5%"}}>
            <button className={this.context.connected ? 'submit-btn' : 'submit-btn-not-connected'} onClick={this.context.connected ? this.handleSwapSubmit : this.context.onConnect}>{this.context.connected ? 'Swap' : 'Connect to a wallet'}</button>
            </div>
          </div>
        </div>
      </main>
    );
  }

}

export default withRouter(SwapContainer);