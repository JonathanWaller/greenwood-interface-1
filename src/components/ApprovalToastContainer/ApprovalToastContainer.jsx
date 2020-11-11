import React, {Component} from 'react';
import './ApprovalToastContainer.css'
import AppContext from '../../contexts/AppContext';
import { ArrowUpRight } from 'react-feather';
import Loader from 'react-loader-spinner'


export default class ApprovalToastContainer extends Component { 
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
          {this.context && this.context.approvalStatus === 'Pending' && <h6 className="toast-text-dark">Approval Status: <span className="toast-text-light font-roboto-mono">{this.context.approvalStatus}</span></h6>}
          {this.context && this.context.approvalStatus === 'Pending' && <Loader className="approval-loader" type="Bars" color="#D4D5D8"/>}
          {this.context && this.context.approvalStatus === 'Complete' && this.context.approvalHash && <h6 className="toast-text-dark">Approval Status: <a className="toast-text-orange toast-link font-roboto-mono" href={`https://kovan.etherscan.io/tx/${this.context.approvalHash}`} target="_blank" rel="noopener noreferrer">{this.context.approvalStatus}<ArrowUpRight className="va-middle-bg-transparent transx-2px-right"/></a></h6>}
        </div>
      </div>
    )
  }
}