const model = {
  "contractName": "v0.1.1_model",
  "abi": [
    {
      "outputs": [],
      "inputs": [
        {
          "type": "address",
          "name": "_admin_addr"
        },
        {
          "type": "int128",
          "name": "_y_offset"
        },
        {
          "type": "int128",
          "name": "_slope_factor"
        },
        {
          "type": "int128",
          "name": "_rate_factor_sensitivity"
        },
        {
          "type": "int128",
          "name": "_fee_base"
        },
        {
          "type": "int128",
          "name": "_fee_sensitivity"
        },
        {
          "type": "int128",
          "name": "_range"
        },
        {
          "type": "int128",
          "name": "_utilization_inflection"
        },
        {
          "type": "int128",
          "name": "_utilization_multiplier"
        },
        {
          "type": "int128",
          "name": "_min_payout_rate"
        },
        {
          "type": "int128",
          "name": "_max_payout_rate"
        },
        {
          "type": "bool",
          "name": "_is_paused"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "name": "getModel",
      "outputs": [
        {
          "type": "tuple",
          "name": "",
          "components": [
            {
              "type": "int128",
              "name": "yOffset"
            },
            {
              "type": "int128",
              "name": "slopeFactor"
            },
            {
              "type": "int128",
              "name": "rateFactorSensitivity"
            },
            {
              "type": "int128",
              "name": "feeBase"
            },
            {
              "type": "int128",
              "name": "feeSensitivity"
            },
            {
              "type": "int128",
              "name": "rateRange"
            },
            {
              "type": "int128",
              "name": "utilizationInflection"
            },
            {
              "type": "int128",
              "name": "utilizationMultiplier"
            },
            {
              "type": "int128",
              "name": "minPayoutRate"
            },
            {
              "type": "int128",
              "name": "maxPayoutRate"
            },
            {
              "type": "bool",
              "name": "isPaused"
            }
          ]
        }
      ],
      "inputs": [],
      "stateMutability": "view",
      "type": "function",
      "gas": 10537,
      "constant": true
    },
    {
      "name": "setModel",
      "outputs": [],
      "inputs": [
        {
          "type": "int128",
          "name": "_y_offset"
        },
        {
          "type": "int128",
          "name": "_slope_factor"
        },
        {
          "type": "int128",
          "name": "_rate_factor_sensitivity"
        },
        {
          "type": "int128",
          "name": "_fee_base"
        },
        {
          "type": "int128",
          "name": "_fee_sensitivity"
        },
        {
          "type": "int128",
          "name": "_range"
        },
        {
          "type": "int128",
          "name": "_utilization_inflection"
        },
        {
          "type": "int128",
          "name": "_utilization_multiplier"
        },
        {
          "type": "int128",
          "name": "_min_payout_rate"
        },
        {
          "type": "int128",
          "name": "_max_payout_rate"
        },
        {
          "type": "bool",
          "name": "_is_paused"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function",
      "gas": 387264
    }
  ],
  "bytecode": "0x740100000000000000000000000000000000000000006020526f7fffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff8000000000000000000000000000000060605274012a05f1fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffed5fa0e000000000000000000000000000000000060a0526101806106f96101403934156100a257600080fd5b60206106f960c03960c05160205181106100bb57600080fd5b50606051602060206106f90160c03960c051806040519013156100dd57600080fd5b80919012156100eb57600080fd5b50606051602060406106f90160c03960c0518060405190131561010d57600080fd5b809190121561011b57600080fd5b50606051602060606106f90160c03960c0518060405190131561013d57600080fd5b809190121561014b57600080fd5b50606051602060806106f90160c03960c0518060405190131561016d57600080fd5b809190121561017b57600080fd5b50606051602060a06106f90160c03960c0518060405190131561019d57600080fd5b80919012156101ab57600080fd5b50606051602060c06106f90160c03960c051806040519013156101cd57600080fd5b80919012156101db57600080fd5b50606051602060e06106f90160c03960c051806040519013156101fd57600080fd5b809190121561020b57600080fd5b5060605160206101006106f90160c03960c0518060405190131561022e57600080fd5b809190121561023c57600080fd5b5060605160206101206106f90160c03960c0518060405190131561025f57600080fd5b809190121561026d57600080fd5b5060605160206101406106f90160c03960c0518060405190131561029057600080fd5b809190121561029e57600080fd5b5060206101606106f90160c03960c051600281106102bb57600080fd5b506101405160005561016051600155610180516002556101a0516003556101c0516004556101e0516005556102005160065561022051600755610240516008556102605160095561028051600a556102a051600b556106e156600436101561000d576103c6565b600035601c52740100000000000000000000000000000000000000006020526f7fffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff8000000000000000000000000000000060605274012a05f1fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffed5fa0e000000000000000000000000000000000060a05263a0bfa1e060005114156101d15734156100ba57600080fd5b61016036610140376001546101405260025461016052600354610180526004546101a0526005546101c0526006546101e052600754610200526008546102205260095461024052600a5461026052600b54610280526102a08080806101405181525050602081019050808061016051815250506020810190508080610180518152505060208101905080806101a0518152505060208101905080806101c0518152505060208101905080806101e0518152505060208101905080806102005181525050602081019050808061022051815250506020810190508080610240518152505060208101905080806102605181525050602081019050808061028051815250506101609050905060c05260c0516102a0f350005b6391e1424a60005114156103c55734156101ea57600080fd5b6060516004358060405190131561020057600080fd5b809190121561020e57600080fd5b506060516024358060405190131561022557600080fd5b809190121561023357600080fd5b506060516044358060405190131561024a57600080fd5b809190121561025857600080fd5b506060516064358060405190131561026f57600080fd5b809190121561027d57600080fd5b506060516084358060405190131561029457600080fd5b80919012156102a257600080fd5b5060605160a435806040519013156102b957600080fd5b80919012156102c757600080fd5b5060605160c435806040519013156102de57600080fd5b80919012156102ec57600080fd5b5060605160e4358060405190131561030357600080fd5b809190121561031157600080fd5b50606051610104358060405190131561032957600080fd5b809190121561033757600080fd5b50606051610124358060405190131561034f57600080fd5b809190121561035d57600080fd5b50610144356002811061036f57600080fd5b50600054331461037e57600080fd5b60043560015560243560025560443560035560643560045560843560055560a43560065560c43560075560e4356008556101043560095561012435600a5561014435600b55005b5b60006000fd5b6103156106e1036103156000396103156106e1036000f3",
  "deployedBytecode": "0x600436101561000d576103c6565b600035601c52740100000000000000000000000000000000000000006020526f7fffffffffffffffffffffffffffffff6040527fffffffffffffffffffffffffffffffff8000000000000000000000000000000060605274012a05f1fffffffffffffffffffffffffdabf41c006080527ffffffffffffffffffffffffed5fa0e000000000000000000000000000000000060a05263a0bfa1e060005114156101d15734156100ba57600080fd5b61016036610140376001546101405260025461016052600354610180526004546101a0526005546101c0526006546101e052600754610200526008546102205260095461024052600a5461026052600b54610280526102a08080806101405181525050602081019050808061016051815250506020810190508080610180518152505060208101905080806101a0518152505060208101905080806101c0518152505060208101905080806101e0518152505060208101905080806102005181525050602081019050808061022051815250506020810190508080610240518152505060208101905080806102605181525050602081019050808061028051815250506101609050905060c05260c0516102a0f350005b6391e1424a60005114156103c55734156101ea57600080fd5b6060516004358060405190131561020057600080fd5b809190121561020e57600080fd5b506060516024358060405190131561022557600080fd5b809190121561023357600080fd5b506060516044358060405190131561024a57600080fd5b809190121561025857600080fd5b506060516064358060405190131561026f57600080fd5b809190121561027d57600080fd5b506060516084358060405190131561029457600080fd5b80919012156102a257600080fd5b5060605160a435806040519013156102b957600080fd5b80919012156102c757600080fd5b5060605160c435806040519013156102de57600080fd5b80919012156102ec57600080fd5b5060605160e4358060405190131561030357600080fd5b809190121561031157600080fd5b50606051610104358060405190131561032957600080fd5b809190121561033757600080fd5b50606051610124358060405190131561034f57600080fd5b809190121561035d57600080fd5b50610144356002811061036f57600080fd5b50600054331461037e57600080fd5b60043560015560243560025560443560035560643560045560843560055560a43560065560c43560075560e4356008556101043560095561012435600a5561014435600b55005b5b60006000fd",
  "source": "# (c) 2020 Greenwood\n# @title Greenwood Model\n# @author Brandon McFarland\n# @notice An interest rate model storage contract for the Greenwood protocol\n\nstruct modelStruct:\n    yOffset: int128\n    slopeFactor:int128\n    rateFactorSensitivity: int128\n    feeBase: int128\n    feeSensitivity: int128\n    rateRange: int128\n    utilizationInflection: int128\n    utilizationMultiplier: int128\n    minPayoutRate: int128\n    maxPayoutRate:int128\n    isPaused: bool\n\nadmin: address\nyOffset: int128\nslopeFactor: int128\nrateFactorSensitivity: int128\nfeeBase: int128\nfeeSensitivity: int128\nrateRange: int128\nutilizationInflection: int128\nutilizationMultiplier: int128\nminPayoutRate: int128\nmaxPayoutRate: int128\nisPaused: bool\n\n@external\ndef __init__(_admin_addr:address, _y_offset: int128, _slope_factor:int128, _rate_factor_sensitivity: int128, _fee_base: int128, _fee_sensitivity: int128, _range: int128, _utilization_inflection: int128, _utilization_multiplier: int128, _min_payout_rate: int128, _max_payout_rate:int128, _is_paused: bool):\n    self.admin = _admin_addr\n    self.yOffset = _y_offset\n    self.slopeFactor = _slope_factor\n    self.rateFactorSensitivity = _rate_factor_sensitivity\n    self.feeBase = _fee_base\n    self.feeSensitivity = _fee_sensitivity\n    self.rateRange = _range\n    self.utilizationInflection = _utilization_inflection\n    self.utilizationMultiplier = _utilization_multiplier\n    self.minPayoutRate = _min_payout_rate\n    self.maxPayoutRate = _max_payout_rate\n    self.isPaused = _is_paused\n\n@external\n@view\ndef getModel() -> modelStruct:\n    currentModel: modelStruct = empty(modelStruct)\n    currentModel.yOffset = self.yOffset\n    currentModel.slopeFactor = self.slopeFactor\n    currentModel.rateFactorSensitivity = self.rateFactorSensitivity\n    currentModel.feeBase = self.feeBase\n    currentModel.feeSensitivity = self.feeSensitivity\n    currentModel.rateRange = self.rateRange\n    currentModel.utilizationInflection = self.utilizationInflection\n    currentModel.utilizationMultiplier = self.utilizationMultiplier\n    currentModel.minPayoutRate = self.minPayoutRate\n    currentModel.maxPayoutRate = self.maxPayoutRate\n    currentModel.isPaused = self.isPaused\n\n    return currentModel\n\n@external\ndef setModel( _y_offset: int128, _slope_factor:int128, _rate_factor_sensitivity: int128, _fee_base: int128, _fee_sensitivity: int128, _range: int128, _utilization_inflection: int128, _utilization_multiplier: int128, _min_payout_rate: int128, _max_payout_rate:int128, _is_paused: bool):\n    assert msg.sender == self.admin\n    self.yOffset = _y_offset\n    self.slopeFactor = _slope_factor\n    self.rateFactorSensitivity = _rate_factor_sensitivity\n    self.feeBase = _fee_base\n    self.feeSensitivity = _fee_sensitivity\n    self.rateRange = _range\n    self.utilizationInflection = _utilization_inflection\n    self.utilizationMultiplier = _utilization_multiplier\n    self.minPayoutRate = _min_payout_rate\n    self.maxPayoutRate = _max_payout_rate\n    self.isPaused = _is_paused",
  "sourcePath": "/Users/brandonmcfaraland/Desktop/protocol/dev_protocol_contracts/contracts/v0.1.1_model.vy",
  "compiler": {
    "name": "vyper",
    "version": "0.2.3+commit.006968f"
  },
  "networks": {
    "42": {
      "events": {},
      "links": {},
      "address": "0x08a0aA55Af5176AEa86223c46d0A9eeeb05ADe97",
      "transactionHash": "0x3113612962e6e3615c195e0c3a42dd363f64c0a5b9fef4265c00f42640402799"
    }
  },
  "schemaVersion": "3.2.0",
  "updatedAt": "2020-10-13T21:39:04.476Z",
  "networkType": "ethereum"
}
  
  module.exports = model;