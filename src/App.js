import React from 'react';
import { createBrowserHistory } from "history";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import './App.css';

import LandingView from './views/LandingView/LandingView.jsx'
import SwapView from './views/SwapView/SwapView.jsx'
import PoolView from './views/PoolView/PoolView.jsx'
import HistoryView from './views/HistoryView/HistoryView.jsx'
import TermsView from './views/TermsView/TermsView.jsx'
import PrivacyView from './views/PrivacyView/PrivacyView.jsx'

import AppContext from './contexts/AppContext'

import Web3 from 'web3';
import Web3Modal from "web3modal";
import Modal from "./components/Web3Modal/Web3Modal";
import { getChainData } from "./helpers/utilities";
import { apiGetAccountAssets } from "./helpers/api";
import styled from "styled-components";
import Loader from "./components/Web3ModalLoader/Web3ModalLoader";
import ModalResult from "./components/Web3ModalResult/Web3ModalResult";
import WalletConnectProvider from "@walletconnect/web3-provider";

import daiAbi from './interfaces/dai'
import cDai from './interfaces/cDai'
import modelAbi from './interfaces/v0.1.0_model'
// import axios from 'axios'

import moment from 'moment'
import coreAbi from './interfaces/v0.1.0_core'

const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`;

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SModalParagraph = styled.p`
  margin-top: 30px;
`;

function initWeb3(provider) {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}

class App extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      route: '',
      currentAccount: '',
      currentAccountTruncated: '',
      fetching: false,
      address: "",
      web3: null,
      provider: null,
      connected: false,
      chainId: 1,
      networkId: 1,
      assets: [],
      showModal: false,
      pendingRequest: false,
      result: null,
      setState: this.stateUpdate,
      onConnect: this.onConnect,
      getHistory: this.getHistory,
      subscribeProvider: this.subscribeProvider,
      smartTrim: this.smartTrim,
      getAccountAssets: this.getAccountAssets,
      selectedSwapPosition: 'rFix',
      selectedSwapAmount: '100',
      selectedSwapAsset: 'dai',
      selectedLiquidityAction: 'Supply',
      selectedLiquidityAmount: '100',
      selectedLiquidityAsset: 'dai',
      positions: [ 
        {'display':'Receive', 'key': 'rFix'},
        {'display':'Pay', 'key': 'pFix'} 
      ],
      actions: [ 
        {'display':'Supply', 'key': 'Supply'},
        {'display':'Withdraw', 'key': 'Withdraw'}
      ],
      greenwoodAssets: [
        {'display':'DAI', 'key': 'dai'},
        // {'display':'ETH', 'key': 'eth'},
        // {'display':'USDC', 'key': 'usdc'},
        // {'display':'USDT', 'key': 'usdt'},
        // {'display':'ZRX', 'key': 'zrx'}
      ],
      contractAddresses: {
        'dai': '0x4e4F41AA1fBB6410c3DfBB919bD9365DF7070BF1',
        // 'eth': '',
        // 'usdc': '',
        // 'usdt': '',
        // 'zrx': '',
      },
      calculatorAddresses: {
        'dai': '0xe92d94B0f2c6eC712E3aa0a7EBB6036350b88283',
        // 'eth': '',
        // 'usdc': '',
        // 'usdt': '',

        // 'zrx': '',
      },
      modelAddresses: {
        'dai': '0xC131B2b9d7F7c02fC9c63506D2a62C97cF2F6274',
        // 'eth': '',
        // 'usdc': '',
        // 'usdt': '',
        // 'zrx': '',
      },
      underlyingAddresses: {
        'dai': '0xC4375B7De8af5a38a93548eb8453a498222C4fF2',
        // 'eth': '',
        // 'usdc': '',
        // 'usdt': '',
        // 'zrx': '',
      },
      underlyingABIs: {
        'dai': daiAbi
      },
      assetMantissas: {
        'dai': '1000000000000000000',
        // 'eth': '1000000000000000000',
        // 'usdc': '1000000',
        // 'usdt': '1000000',
        // 'zrx': '1000000000000000000',
      },
      cTokenAddresses: {
        '1': {
          'dai': '',
          'bat': '',
          'eth': '',
          'rep': '',
          'sai': '',
          'usdc': '',
          'usdt': '',
          'wbtc': '',
          'zrx': '',
        },
        '42': {
          'dai': '0xf0d0eb522cfa50b716b3b1604c4f0fa6f04376ad',
          'bat': '0x4a77faee9650b09849ff459ea1476eab01606c7a',
          'eth': '0x41b5844f4680a8c38fbb695b7f9cfd1f64474a72',
          'rep': '0xa4ec170599a1cf87240a35b9b1b8ff823f448b57',
          'sai': '0xb3f7fb482492f4220833de6d6bfcc81157214bec',
          'usdc': '0x4a92e71227d294f041bd82dd8f78591b75140d63',
          'usdt': '0x3f0a0ea2f86bae6362cf9799b523ba06647da018',
          'wbtc': '0xa1faa15655b0e7b6b6470ed3d096390e6ad93abb',
          'zrx': '0xaf45ae737514c8427d373d50cd979a242ec59e5a',
        }  
      },
      contractShift: 0.0000000001,
      swapDetailRate: '',
      swapDetailMaturity: '',
      swapDetailFee: '',
      swapDetailCollateral: '',
      poolDetailBalance: '',
      poolDetailShare: '',
      renderRoute: false,
      accountSwaps: [],
      historyColumns: [
        {
          swapType: 'Swap Type',
          // notional: 'Swap Notional',
          // swapRate: 'Swap Rate',
          userCollateral: 'Collateral Locked',
          // initTime: 'Swap Time',
          // initIndex: 'Floating Index Start',
          // asset: 'Asset',
          // settlement: 'Settle Swap'
          expiryTime: 'Time Until Expiry',
          currentProfit: 'Approximate Current Profit', 
          liquidationTime: 'Time Until Liquidation'
        }
      ],
      renderTable: false,
      transactionStatus: 'Pending',
      transactionHash: '',
      approvalStatus: 'Pending',
      approvalHash: '',
      isDesktop: false,
      approveRadio: false,
      swapDurationInSeconds: 60,
      isValidCollateralAmount: true,
      isValidLiquidityAmount: true,
      isOnSupportedNetwork: false
    }

    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: false,
      disableInjectedProvider: false,
      providerOptions: this.getProviderOptions()
    });

    this.onConnect = this.onConnect.bind(this);
    this.subscribeProvider = this.subscribeProvider.bind(this);
    this.getNetwork = this.getNetwork.bind(this);
    this.getProviderOptions = this.getProviderOptions.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.getAccountAssets = this.getAccountAssets.bind(this);
    this.resetApp = this.resetApp.bind(this);
    this.smartTrim = this.smartTrim.bind(this);
    this.updatePredicate = this.updatePredicate.bind(this);
    this.getHistory = this.getHistory.bind(this);
  }

  async componentDidMount() {
    this.updatePredicate();
    window.addEventListener("resize", this.updatePredicate);

    await this.setState({
      renderRoute: false
    });
    if (window.web3 && window.web3.currentProvider) {
      const provider = window.web3.currentProvider
      try {
        await this.subscribeProvider(provider);
      } catch ( err ) {
        console.error(`Error calling subscribeProvider - ${ err.message }`);
      }

      const web3 = initWeb3(window.web3.currentProvider)
      const accounts = await web3.eth.getAccounts();

      if (accounts.length) {
        const address = accounts[0];
        const networkId = await web3.eth.net.getId();
        const chainId = await web3.eth.chainId();
        const currentAccountTruncated = this.smartTrim(address, 16) + ' '

        try {
          await this.setState({
            web3,
            provider,
            connected: true,
            address,
            chainId,
            networkId,
            currentAccountTruncated
          });
        } catch ( err ) {
          console.error( `Error setting state in onConnect - ${ err.message }` );
        }
  
        try {
          await this.getAccountAssets();
        } catch ( err ) {
          console.error( `Error calling getAccountAssets - ${ err.message }` );
        }
      }
      await this.getHistory();
    } else {
      console.log( 'NO PROVIDER' );
    }

    let isOnSupportedNetwork;
    if (this.state.chainId && (this.state.chainId === '42' || this.state.chainId === 42)) {
      isOnSupportedNetwork = true
    } else {
      isOnSupportedNetwork = false
    }

    await this.setState({
      renderRoute: true,
      isOnSupportedNetwork
    });

    try {
      await this.getHistory()
    } catch (e) {
      console.error(`Error getting swaps for account`)
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updatePredicate);
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 1300 });
  }

  onConnect = async () => {
    let provider, hasProvider
    try {
      provider = await this.web3Modal.connect();
      hasProvider = true;
    } catch ( err ) {
      await this.resetApp()
      hasProvider = false;
    }

    if (hasProvider) {
      try {
        await this.subscribeProvider(provider);
      } catch ( err ) {
        console.error(`Error calling subscribeProvider - ${ err.message }`);
      }

      const web3 = initWeb3(provider);
      const accounts = await web3.eth.getAccounts();
      const address = accounts[0];
      const networkId = await web3.eth.net.getId();
      const chainId = await web3.eth.chainId();
      const currentAccountTruncated = this.smartTrim(address, 16) + ' '

      let isOnSupportedNetwork;
      if (chainId && (chainId === '42' || chainId === 42)) {
        isOnSupportedNetwork = true
      } else {
        isOnSupportedNetwork = false
      }

      try {
        await this.setState({
          web3,
          provider,
          connected: true,
          address,
          chainId,
          networkId,
          currentAccountTruncated,
          isOnSupportedNetwork
        });
      } catch ( err ) {
        console.error( `Error setting state in onConnect - ${ err.message }` );
      }

      try {
        await this.getHistory();
      } catch ( e ) {
        console.error( `Error getting account history in onConnect - ${e.message}` );
      }

      try {
        await this.getAccountAssets();
      } catch ( err ) {
        console.error( `Error calling getAccountAssets - ${ err.message }` );
      }
      
    }
  };

  subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }

    provider.autoRefreshOnNetworkChange = false

    // provider.on("close", () => this.resetApp());

    provider.on("accountsChanged", async (accounts) => {
      if ( accounts.length ) {
        const web3 = initWeb3(provider);
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        const networkId = await web3.eth.net.getId();
        const chainId = await web3.eth.chainId();
        const currentAccountTruncated = this.smartTrim(address, 16) + ' '
        let isOnSupportedNetwork;
        if (chainId && (chainId === '42' || chainId === 42)) {
          isOnSupportedNetwork = true
        } else {
          isOnSupportedNetwork = false
        }

        try {
          await this.setState({
            web3,
            provider,
            connected: true,
            address,
            chainId,
            networkId,
            currentAccountTruncated,
            isOnSupportedNetwork
          });
        } catch ( err ) {
          console.error( `Error setting state in accountsChanged listener - ${ err.message }` );
        }

        try {
          await this.getHistory();
        } catch ( e ) {
          console.error( `Error getting account history in accountsChanged listener - ${e.message}` );
        }


        await this.getAccountAssets();
      } else {
        this.resetApp();
      }
    });

    provider.on("chainChanged", async (chainId) => {
      const { web3 } = this.state;
      if (web3) {
        // window.location.reload();
        // const web3 = initWeb3(provider);
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];

        const networkId = await web3.eth.net.getId();
        const chainId = await web3.eth.chainId();

        const currentAccountTruncated = this.smartTrim(address, 16) + ' '
        let isOnSupportedNetwork;
        if (chainId && (chainId === '42' || chainId === 42)) {
          isOnSupportedNetwork = true
        } else {
          isOnSupportedNetwork = false
        }

        // await this.setState({ chainId, networkId });
        try {
          await this.setState({
            web3,
            provider,
            connected: true,
            address,
            chainId,
            networkId,
            currentAccountTruncated,
            isOnSupportedNetwork
          });
        } catch ( err ) {
          console.error( `Error setting state in chainChanged listener - ${ err.message }` );
        }
        await this.getAccountAssets();
        try {
          await this.getHistory();
        } catch ( e ) {
          console.error( `Error getting account history in accountsChanged listener - ${e.message}` );
        }
      }
    });

    // provider.on("networkChanged", async (networkId) => {
    //   const { web3 } = this.state;
    //   if (web3) {
    //     const chainId = await web3.eth.chainId();
    //     await this.setState({ chainId, networkId });
    //     await this.getAccountAssets();
    //   }
    // });

    provider.on("disconnect", async (error) => {
      this.resetApp()
      console.error(error);
    });
  };

  getNetwork = () =>  {
    return getChainData(this.state.chainId).network;
  }

  getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID
        }
      }
    };
    return providerOptions;
  };

  toggleModal = async () => {
    await this.setState({ showModal: !this.state.showModal });
  }

  getAccountAssets = async () => {
    const { address, chainId } = this.state;
    this.setState({ fetching: true });
    try {
      const assets = await apiGetAccountAssets(address, chainId);
      await this.setState({ fetching: false, assets });
    } catch (error) {
      console.error(error);
      await this.setState({ fetching: false });
    }
  };

  resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    await this.setState({ 
      fetching: false,
      address: "",
      web3: null,
      provider: null,
      connected: false,
      chainId: 1,
      networkId: 1,
      assets: [],
      showModal: false,
      pendingRequest: false,
      result: null
     });
  };

  smartTrim(string, maxLength) {
    if (!string) return string;
    if (maxLength < 1) return string;
    if (string.length <= maxLength) return string;
    if (maxLength === 1) return string.substring(0,1) + '...';

    const midpoint = Math.ceil(string.length / 2);
    const toremove = string.length - maxLength;
    const lstrip = Math.ceil(toremove/2);
    const rstrip = toremove - lstrip;
    return string.substring(0, midpoint-lstrip) + '...' + string.substring(midpoint+rstrip);
  }

  getHistory = async () => {
    if( this.state && this.state.address && this.state.isOnSupportedNetwork ) {
      // console.log( 'GETTING HISTORY' )
        // const web3 = this.context.web3
        const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_INFURA_ID))
        const abi = coreAbi['abi'];

        let swaps = [];
        for( let asset of this.state.greenwoodAssets) {
            const address = this.state.contractAddresses[asset.key];
            const instance = new web3.eth.Contract(abi, address);
            let swapNumbers, model;
            try {
                swapNumbers = await instance.methods.swapNumbers(this.state.address).call();
                swapNumbers = Number(swapNumbers)
            } catch ( e ) {
                console.error(`Error fetching swap numbers for ${ asset.display } - ${e.message}`)
            }

            try {
              const address = this.state.modelAddresses[asset.key];
              const abi = modelAbi['abi'];
              const instance = new web3.eth.Contract(abi, address);
              model = await instance.methods.getModel().call();
            } catch ( e ) {
                console.error(`Error fetching contract state for ${ asset.display } - ${e.message}`)
            }

            let borrowApy;
            try {
                // const endpoint = `https://api.compound.finance/api/v2/ctoken?addresses=${this.state.cTokenAddresses[this.state.chainId][asset.key]}&network=kovan`;
                // const result = await axios.get(endpoint);
                // newFloatIndex = Number(result.data.cToken[0].borrow_rate.value);
                const address = this.state.cTokenAddresses[this.state.chainId][asset.key]
                const instance = new web3.eth.Contract(cDai, address);
                const borrowRatePerBlock = await instance.methods.borrowRatePerBlock().call();
                const ethMantissa = 1e18;
                const blocksPerDay = 4 * 60 * 24;
                const daysPerYear = 365;
                borrowApy = (((Math.pow((borrowRatePerBlock / ethMantissa * blocksPerDay) + 1, daysPerYear - 1))) - 1) * 100;

                console.log( 'BORROW RATE: ', borrowApy );

            } catch (e) {
                console.error(`Error fetching borrow rate from Compound contract- ${e.message}`);
            }

            if ( swapNumbers && swapNumbers > 0 ) {
                let assetSwaps = [];
                await Promise.all (
                    [...Array(swapNumbers).keys()].map( async swapNumber => {
                        try {
                            const addressBytes = web3.utils.padLeft(web3.utils.toHex(this.state.address), 64)
                            const swapNumberBytes = web3.utils.padLeft(web3.utils.toHex(swapNumber), 64)
                            const swapKey = addressBytes.concat(swapNumberBytes.replace('0x',''));
                   
                            const swap = await instance.methods.getSwap(web3.utils.keccak256(swapKey)).call();
                            const swapType = await instance.methods.getSwapType (web3.utils.keccak256(swapKey)).call();

                            const initTime = parseInt(Number(swap.initTime) * this.state.contractShift);
                            let userCollateral = (Number(swap.userCollateral) * this.state.contractShift);
                            // const expiryTime = (((parseInt(Number(swap.initTime) * this.state.contractShift) + Number(this.state.swapDurationInSeconds)) - moment().unix()) / 60) > 0 ? (((parseInt(Number(swap.initTime) * this.state.contractShift) + Number(this.state.swapDurationInSeconds)) - moment().unix()) / 60).toFixed(2) : "Expired"
                            let expiryTime, liquidationTime;
                            if ( parseInt(Number(swap.initTime) * this.state.contractShift) + Number(this.state.swapDurationInSeconds) > moment().unix() ) {
                            //let duration = (parseInt(Number(swap.initTime) * this.state.contractShift) + Number(this.state.swapDurationInSeconds)) - moment().unix()
                            let duration = 83584
                              if (duration < 60) {
                                expiryTime = 'Less than one minute'
                              } else {

                                let dys = ~~(duration/86400)
                                let hrs = ~~(duration % 86400 / 3600);
                                let mins = ~~(duration % 3600 / 60);
                                let secs = ~~duration % 60;
                                let thisArray = [dys, hrs, mins, secs];
                                let i;
                                
                                expiryTime = "";
                                let dayText, hourText, minText, secText
                                for (i in thisArray){
                                  if (thisArray[i] > 0){
                                    if (i === "0"){
                                      dayText = thisArray[i] > 1 ? `${thisArray[i]} days ` : `${thisArray[i]} day `
                                      expiryTime += dayText
                                    }
                                    else if (i === "1"){
                                      hourText = thisArray[i] > 1 ? `${thisArray[i]} hours ` : `${thisArray[i]} hour `
                                      expiryTime += hourText
                                    }
                                    else if (i === "2"){
                                      minText = thisArray[i] > 1 ? `${thisArray[i]} minutes ` : `${thisArray[i]} minute `
                                      dayText ? expiryTime += "" : expiryTime += minText
                                    }
                                    else if (i === "3"){
                                      secText = thisArray[i] > 1 ? `${thisArray[i]} seconds` : `${thisArray[i]} second`
                                      dayText ? expiryTime += "" : expiryTime += secText
                                    }
                                  }
                                }

                              }

                            } else {
                              const startTime = (parseInt(Number(swap.initTime) * this.state.contractShift) + Number(this.state.swapDurationInSeconds))
                              const getLiquidationTime = startTime + 43200
                              const currentTime = moment().unix()
                              const duration = getLiquidationTime - currentTime

                              let dys = ~~(duration/86400)
                              let hrs = ~~(duration % 86400 / 3600);
                              let mins = ~~(duration % 3600 / 60);
                              let secs = ~~duration % 60;
                              let thisArray = [dys, hrs, mins, secs];
                              let i;
                              
                              liquidationTime = ""
                              let dayText, hourText, minText, secText
                              for (i in thisArray){
                                if (thisArray[i] > 0){
                                  if (i === "0"){
                                    dayText = thisArray[i] > 1 ? `${thisArray[i]} days ` : `${thisArray[i]} day `
                                    liquidationTime += dayText
                                  }
                                  else if (i === "1"){
                                    hourText = thisArray[i] > 1 ? `${thisArray[i]} hours ` : `${thisArray[i]} hour `
                                    liquidationTime += hourText
                                  }
                                  else if (i === "2"){
                                    minText = thisArray[i] > 1 ? `${thisArray[i]} minutes ` : `${thisArray[i]} minute `
                                    dayText ? liquidationTime += "" : liquidationTime += minText
                                  }
                                  else if (i === "3"){
                                    secText = thisArray[i] > 1 ? `${thisArray[i]} seconds` : `${thisArray[i]} second`
                                    dayText ? liquidationTime += "" : liquidationTime += secText
                                  }
                                }
                              }
                              
                              // console.log( 'END: ', parseInt(Number(swap.initTime) * this.state.contractShift) + Number(this.state.swapDurationInSeconds) )
                              // console.log( 'CURRENT: ', moment().unix())
                              // console.log( 'DIFF: ', parseInt(Number(swap.initTime) * this.state.contractShift) + Number(this.state.swapDurationInSeconds) - moment().unix())
                              expiryTime = 'Expired'
                            }
                            // const expiryTime = moment.unix(parseInt(Number(swap.initTime) * this.state.contractShift) + Number(this.state.swapDurationInSeconds)).fromNow();
                            const fixedLeg  = ((parseFloat(swap.notional) / this.state.assetMantissas[asset.key]) * (parseFloat(swap.swapRate) * this.state.contractShift) * (this.state.swapDurationInSeconds / 86400)) / 365
                            // const floatLeg = (parseFloat(swap.notional) / this.state.assetMantissas[asset.key]) * ((borrowApy / 100) / (parseFloat(swap.initIndex) * this.state.contractShift) - 1.0)
                            // const floatLeg = ((parseFloat(swap.notional) / this.context.assetMantissas[asset.key]) * newFloatIndex * (this.context.swapDurationInSeconds / 86400)) / 365
                            const floatLeg = ((parseFloat(swap.notional) / this.state.assetMantissas[asset.key]) * (borrowApy / 100) * (this.state.swapDurationInSeconds / 86400)) / 365

                            // console.log( 'RATES: : ', (parseFloat(swap.swapRate) * this.state.contractShift), borrowApy / 100 );
                            // console.log( 'FIXED: ', parseFloat(fixedLeg))
                            // console.log( 'FLOAT: ', parseFloat(floatLeg))
                            // console.log( 'SWAP TYPE: ', parseFloat(swap.notional) / this.state.assetMantissas[asset.key], borrowApy, (parseFloat(swap.initIndex) * this.state.contractShift), -1)
                            let currentProfit;

                            if ( swapType === 'pFix') {
                                const counterpartyCollateral = ((parseFloat(swap.notional) / parseFloat(this.state.assetMantissas[asset.key])) * (parseFloat(this.state.swapDurationInSeconds) / 86400) * ((parseFloat(model.maxPayoutRate) * this.state.contractShift))) / 365
                                if (parseFloat(floatLeg - fixedLeg) > counterpartyCollateral ) {
                                  // counterparty at full loss
                                  currentProfit = counterpartyCollateral.toFixed(8)
                                } else if ( ( userCollateral + parseFloat(floatLeg - fixedLeg)) < 0) {
                                  // trader is at full loss
                                  currentProfit = (userCollateral * -1).toFixed(8)
                                } else {
                                  // things are kosher
                                  currentProfit = parseFloat(floatLeg - fixedLeg).toFixed(8)
                                }
                        
                                console.log( 'CURRENT PROFIT: ', currentProfit )
                            } else {
                                const counterpartyCollateral =  ((parseFloat(swap.notional) / parseFloat(this.state.assetMantissas[asset.key])) * (parseFloat(this.state.swapDurationInSeconds) / 86400) * ((parseFloat(swap.swapRate) * this.state.contractShift))) / 365                                
                                // currentProfit = parseFloat(fixedLeg - floatLeg) > counterpartyCollateral ? counterpartyCollateral.toFixed(5) : parseFloat(fixedLeg - floatLeg) < userCollateral ? (userCollateral * -1).toFixed(5) : parseFloat(fixedLeg - floatLeg).toFixed(5)
                                if (parseFloat(fixedLeg - floatLeg) > counterpartyCollateral ) {
                                  // counterparty at full loss
                                  currentProfit = counterpartyCollateral.toFixed(8)
                                } else if ( ( userCollateral + parseFloat(fixedLeg - floatLeg)) < 0) {
                                  // trader is at full loss
                                  currentProfit = (userCollateral * -1).toFixed(8)
                                } else {
                                  // things are kosher
                                  currentProfit = parseFloat(fixedLeg - floatLeg).toFixed(8)
                                }
                            }

                            const data = {
                                swapType: swapType,
                                // notional: (Number(swap.notional) / this.context.assetMantissas[asset.display.toLowerCase()]).toFixed(2),
                                initTime,
                                userCollateral: `${(Number(swap.userCollateral) * this.state.contractShift).toFixed(8)} ${asset.display}`,
                                expiryTime,
                                currentProfit,
                                swapKey,
                                // swapRate: ((Number(swap.swapRate) * this.context.contractShift) * 100).toFixed(2),
                                // initIndex: (Number(swap.initIndex) * this.context.contractShift).toFixed(2),
                                asset: asset.display,
                                liquidationTime
                            };
                            if (swap.isClosed === false) {
                                assetSwaps.push(data);
                                console.log('SWAP: ', swap)
                                console.log( 'RATES: : ', (borrowApy / 100) / (parseFloat(swap.initIndex) * this.state.contractShift));
                                console.log( 'FIXED: ', parseFloat(fixedLeg))
                                console.log( 'ZERO FLOAT: ', parseFloat(floatLeg))
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


        this.setState({
            accountSwaps: swaps
        })
    } 
    // else {
    //   console.log( 'NOT UPDATING HISTORY' );
    //   console.log( this.state)
    //   console.log( this.state.address)
    //   console.log( this.state.isOnSupportedNetwork)
    // }
  }



  stateUpdate = (newState, cb) => {
    this.setState(newState, cb);
  }

  render() {
    const hist = createBrowserHistory();
    const {
      showModal,
      pendingRequest,
      result,
      renderRoute
    } = this.state;
    return (
      <AppContext.Provider value={this.state}>
        <div className="app-container">
          <BrowserRouter history={hist}>
            <Switch>
              { renderRoute ? <Route exact path="/" render={(props) => <LandingView {...props} />} /> : null}
              { renderRoute ? <Route path="/swap" render={(props) => <SwapView {...props} />} /> : null}
              { renderRoute ? <Route path="/pool" render={(props) => <PoolView {...props} />} /> : null}
              { renderRoute ? <Route path="/dashboard" render={(props) => <HistoryView {...props} />} /> : null}
              { renderRoute ? <Route path="/terms" render={(props) => <TermsView {...props} />} /> : null}
              { renderRoute ? <Route path="/privacy" render={(props) => <PrivacyView {...props} />} /> : null}
              <Redirect from="/*" to="/" />
            </Switch>
          </BrowserRouter>
        </div>

        <Modal show={showModal} toggleModal={this.toggleModal}>
          {pendingRequest ? (
            <SModalContainer>
              <SModalTitle>{"Pending Call Request"}</SModalTitle>
              <SContainer>
                <Loader />
                <SModalParagraph>
                  {"Approve or reject request using your wallet"}
                </SModalParagraph>
              </SContainer>
            </SModalContainer>
          ) : result ? (
            <SModalContainer>
              <SModalTitle>{"Call Request Approved"}</SModalTitle>
              <ModalResult>{result}</ModalResult>
            </SModalContainer>
          ) : (
            <SModalContainer>
              <SModalTitle>{"Call Request Rejected"}</SModalTitle>
            </SModalContainer>
          )}
        </Modal>
      </AppContext.Provider>
    );
  }
}

export default App;
