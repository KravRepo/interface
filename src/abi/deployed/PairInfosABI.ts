export const PairInfosABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "BeaconInvalidImplementation",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "implementation",
        "type": "address"
      }
    ],
    "name": "Upgraded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "implementation",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newImplementation",
        "type": "address"
      }
    ],
    "name": "upgradeTo",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "InvalidInitialization",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NotInitializing",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "x",
        "type": "int256"
      }
    ],
    "name": "PRBMathSD59x18__Exp2InputTooBig",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "x",
        "type": "int256"
      }
    ],
    "name": "PRBMathSD59x18__FromIntOverflow",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "x",
        "type": "int256"
      }
    ],
    "name": "PRBMathSD59x18__FromIntUnderflow",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "x",
        "type": "int256"
      }
    ],
    "name": "PRBMathSD59x18__LogInputTooSmall",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "PRBMathSD59x18__MulInputTooSmall",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "rAbs",
        "type": "uint256"
      }
    ],
    "name": "PRBMathSD59x18__MulOverflow",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "prod1",
        "type": "uint256"
      }
    ],
    "name": "PRBMath__MulDivFixedPointOverflow",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "valueLong",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "valueShort",
        "type": "int256"
      }
    ],
    "name": "AccFundingFeesStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "AccRolloverFeesStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "long",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "collateral",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "percentProfit",
        "type": "int256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rolloverFees",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "fundingFees",
        "type": "int256"
      }
    ],
    "name": "FeesCharged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "FundingFeePerBlockPUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint64",
        "name": "version",
        "type": "uint64"
      }
    ],
    "name": "Initialized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "label",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Log",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "value",
        "type": "address"
      }
    ],
    "name": "ManagerUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "MaxNegativePnlOnOpenPUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "valueAbove",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "valueBelow",
        "type": "uint256"
      }
    ],
    "name": "OnePercentDepthUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "onePercentDepthAbove",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "onePercentDepthBelow",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rolloverFeePerBlockP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fundingFeePerBlockP",
            "type": "uint256"
          }
        ],
        "indexed": false,
        "internalType": "struct PairInfos.PairParams",
        "name": "value",
        "type": "tuple"
      }
    ],
    "name": "PairParamsUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "RolloverFeePerBlockPUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rollover",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int256",
        "name": "funding",
        "type": "int256"
      }
    ],
    "name": "TradeInitialAccFeesStored",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getAccFundingFeesLong",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getAccFundingFeesShort",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getAccFundingFeesUpdateBlock",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getAccRolloverFees",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getAccRolloverFeesUpdateBlock",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getFundingFeePerBlockP",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getOnePercentDepthAbove",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getOnePercentDepthBelow",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "indices",
        "type": "uint256[]"
      }
    ],
    "name": "getPairInfos",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "onePercentDepthAbove",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "onePercentDepthBelow",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rolloverFeePerBlockP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fundingFeePerBlockP",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairInfos.PairParams[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "accPerCollateral",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "lastUpdateBlock",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairInfos.PairRolloverFees[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "components": [
          {
            "internalType": "int256",
            "name": "accPerOiLong",
            "type": "int256"
          },
          {
            "internalType": "int256",
            "name": "accPerOiShort",
            "type": "int256"
          },
          {
            "internalType": "uint256",
            "name": "lastUpdateBlock",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairInfos.PairFundingFees[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getPendingAccFundingFees",
    "outputs": [
      {
        "internalType": "int256",
        "name": "valueLong",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "valueShort",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getPendingAccRolloverFees",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      }
    ],
    "name": "getRolloverFeePerBlockP",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "long",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "collateral",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      }
    ],
    "name": "getTradeFundingFee",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "int256",
        "name": "accFundingFeesPerOi",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "endAccFundingFeesPerOi",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "collateral",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      }
    ],
    "name": "getTradeFundingFeePure",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getTradeInitialAccFundingFeesPerOi",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getTradeInitialAccRolloverFeesPerCollateral",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "openPrice",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "long",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "collateral",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      }
    ],
    "name": "getTradeLiquidationPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "openPrice",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "long",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "collateral",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rolloverFee",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "fundingFee",
        "type": "int256"
      }
    ],
    "name": "getTradeLiquidationPricePure",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "getTradeOpenedAfterUpdate",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "openPrice",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "long",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "openInterest",
        "type": "uint256"
      }
    ],
    "name": "getTradePriceImpact",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "priceImpactP",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "priceAfterImpact",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "collateral",
        "type": "uint256"
      }
    ],
    "name": "getTradeRolloverFee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "accRolloverFeesPerCollateral",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "endAccRolloverFeesPerCollateral",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "collateral",
        "type": "uint256"
      }
    ],
    "name": "getTradeRolloverFeePure",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "long",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "collateral",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "leverage",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "percentProfit",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "closingFee",
        "type": "uint256"
      }
    ],
    "name": "getTradeValue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "collateral",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "percentProfit",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "rolloverFee",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "fundingFee",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "closingFee",
        "type": "uint256"
      }
    ],
    "name": "getTradeValuePure",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "contract IStorage",
        "name": "_storageT",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "manager",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxNegativePnlOnOpenP",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pairFundingFees",
    "outputs": [
      {
        "internalType": "int256",
        "name": "accPerOiLong",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "accPerOiShort",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdateBlock",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pairParams",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "onePercentDepthAbove",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "onePercentDepthBelow",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rolloverFeePerBlockP",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "fundingFeePerBlockP",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pairRolloverFees",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "accPerCollateral",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastUpdateBlock",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "setFundingFeePerBlockP",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "indices",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "values",
        "type": "uint256[]"
      }
    ],
    "name": "setFundingFeePerBlockPArray",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_manager",
        "type": "address"
      }
    ],
    "name": "setManager",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "setMaxNegativePnlOnOpenP",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "valueAbove",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "valueBelow",
        "type": "uint256"
      }
    ],
    "name": "setOnePercentDepth",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "indices",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "valuesAbove",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "valuesBelow",
        "type": "uint256[]"
      }
    ],
    "name": "setOnePercentDepthArray",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "onePercentDepthAbove",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "onePercentDepthBelow",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rolloverFeePerBlockP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fundingFeePerBlockP",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairInfos.PairParams",
        "name": "value",
        "type": "tuple"
      }
    ],
    "name": "setPairParams",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "indices",
        "type": "uint256[]"
      },
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "onePercentDepthAbove",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "onePercentDepthBelow",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rolloverFeePerBlockP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "fundingFeePerBlockP",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairInfos.PairParams[]",
        "name": "values",
        "type": "tuple[]"
      }
    ],
    "name": "setPairParamsArray",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "setRolloverFeePerBlockP",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "indices",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "values",
        "type": "uint256[]"
      }
    ],
    "name": "setRolloverFeePerBlockPArray",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "storageT",
    "outputs": [
      {
        "internalType": "contract IStorage",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "trader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "long",
        "type": "bool"
      }
    ],
    "name": "storeTradeInitialAccFees",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "tradeInitialAccFees",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "rollover",
        "type": "uint256"
      },
      {
        "internalType": "int256",
        "name": "funding",
        "type": "int256"
      },
      {
        "internalType": "bool",
        "name": "openedAfterUpdate",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "implementation_",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  }
];
