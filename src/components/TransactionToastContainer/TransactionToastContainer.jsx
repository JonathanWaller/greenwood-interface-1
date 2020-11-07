import React, {Component} from 'react';
import './TransactionToastContainer.css'
import AppContext from '../../contexts/AppContext';
import { ArrowUpRight } from 'react-feather';
import Loader from 'react-loader-spinner'


export default class TransactionToastContainer extends Component { 
  static contextType = AppContext;
  constructor(props, context) {
    super(props, context);    
    this.state = {

    }

  }

  render() {
    return (
      <div className="aligner toast-aligner">
        <div className="aligner-item">
          {this.context && this.context.transactionStatus === 'Pending' && <h6 className="toast-text-dark">Transaction Status: <span className="toast-text-light font-roboto-mono">{this.context.transactionStatus}</span></h6>}
          {this.context && this.context.transactionStatus === 'Pending' && <Loader className="transaction-loader" type="Bars" color="#D4D5D8"/>}
          {this.context && this.context.transactionStatus === 'Complete' && this.context.transactionHash && <h6 className="toast-text-dark">Transaction Status: <a className="toast-text-orange toast-link font-roboto-mono" href={`https://etherscan.io/tx/${this.context.transactionHash}`} target="_blank" rel="noopener noreferrer">{this.context.transactionStatus}<ArrowUpRight className="va-middle-bg-transparent transx-2px-right"/></a></h6>}
        </div>
      </div>
    )
  }
}