import React, {Component} from 'react';
import './HistoryTable.css';
import AppContext from '../../contexts/AppContext';
import { withRouter } from 'react-router-dom';

class HistoryTable extends Component { 
  static contextType = AppContext;

  render() {
    return (
        <div style={{height: "80vh", overflow: "scroll"}}>
        <table className="table">
            <thead className="thead-light sticky-header">
                {this.context.historyColumns && this.context.historyColumns.length ? this.context.historyColumns.map(function(item, key) {
                    return (
                        <tr key = {key}>
                            <th scope="col">{item.swapType}</th>
                            <th scope="col">{item.asset}</th>
                            <th scope="col">{item.notional}</th>
                            <th scope="col">{item.swapRate}</th>
                            <th scope="col">{item.userCollateral}</th>
                            <th scope="col">{item.initTime}</th>
                            <th scope="col">{item.initIndex}</th>
                        </tr>
                    )
                }) : null }
            </thead>
            <tbody>
                {this.context.accountSwaps && this.context.accountSwaps.length ? this.context.accountSwaps.map(function(item, key) {
                    return (
                        <tr key = {key} >
                            <th scope="row">{item.swapType === 'pFix' ? 'Pay Fixed' : 'Receive Fixed'}</th>
                            <th>{item.asset}</th>
                            <th>{item.notional}</th>
                            <th>{item.swapRate}%</th>
                            <th>{item.userCollateral}</th>
                            <th>{item.initTime}</th>
                            <th>{item.initIndex}%</th>
                        </tr>
                    )
                }) :
                
                <tr>
                    <td colSpan="8" style={{textAlign: "center"}}>You have no open swaps</td>
                </tr>
                }
            </tbody>
        </table>
        </div>
    )
  }
}

export default withRouter(HistoryTable);