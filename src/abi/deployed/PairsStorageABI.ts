export const PairsStorageABI = [
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "FeeAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "FeeUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      }
    ],
    "name": "GroupAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "GroupUpdated",
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
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "from",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "to",
        "type": "string"
      }
    ],
    "name": "PairAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "PairUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "openFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "closeFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "oracleFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nftLimitOrderFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referralFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minLevPosDai",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseFeeRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "priceImpactExponent",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Fee",
        "name": "_fee",
        "type": "tuple"
      }
    ],
    "name": "addFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "job",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "minLeverage",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxLeverage",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxCollateralP",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Group",
        "name": "_group",
        "type": "tuple"
      }
    ],
    "name": "addGroup",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "from",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "to",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "feed1",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "feed2",
                "type": "address"
              },
              {
                "internalType": "enum PairsStorage.FeedCalculation",
                "name": "feedCalculation",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "maxDeviationP",
                "type": "uint256"
              }
            ],
            "internalType": "struct PairsStorage.Feed",
            "name": "feed",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "spreadP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "groupIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "feeIndex",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Pair",
        "name": "_pair",
        "type": "tuple"
      }
    ],
    "name": "addPair",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "from",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "to",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "feed1",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "feed2",
                "type": "address"
              },
              {
                "internalType": "enum PairsStorage.FeedCalculation",
                "name": "feedCalculation",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "maxDeviationP",
                "type": "uint256"
              }
            ],
            "internalType": "struct PairsStorage.Feed",
            "name": "feed",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "spreadP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "groupIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "feeIndex",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Pair[]",
        "name": "_pairs",
        "type": "tuple[]"
      }
    ],
    "name": "addPairs",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "currentOrderId",
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
    "name": "fees",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "openFeeP",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "closeFeeP",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "oracleFeeP",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "nftLimitOrderFeeP",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "referralFeeP",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minLevPosDai",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "baseFeeRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "priceImpactExponent",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "feesCount",
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
        "name": "_pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_long",
        "type": "bool"
      }
    ],
    "name": "groupCollateral",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "groupMaxCollateral",
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
    "name": "groups",
    "outputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "job",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "minLeverage",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxLeverage",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxCollateralP",
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
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "groupsCollaterals",
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
    "inputs": [],
    "name": "groupsCount",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "guaranteedSlEnabled",
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
        "name": "_currentOrderId",
        "type": "uint256"
      },
      {
        "internalType": "contract IStorage",
        "name": "_storageT",
        "type": "address"
      },
      {
        "internalType": "contract IKToken",
        "name": "_kToken",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "isPairListed",
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
    "inputs": [],
    "name": "kToken",
    "outputs": [
      {
        "internalType": "contract IKToken",
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
        "internalType": "uint256",
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairBaseFeeRate",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairCloseFeeP",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairFeed",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "feed1",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "feed2",
            "type": "address"
          },
          {
            "internalType": "enum PairsStorage.FeedCalculation",
            "name": "feedCalculation",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "maxDeviationP",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Feed",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairJob",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      },
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairMaxLeverage",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairMinLevPosDai",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairMinLeverage",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairNftLimitOrderFeeP",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairOpenFeeP",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairOracleFeeP",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairPriceImpactExponent",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairReferralFeeP",
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
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "pairSpreadP",
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
    "name": "pairs",
    "outputs": [
      {
        "internalType": "string",
        "name": "from",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "to",
        "type": "string"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "feed1",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "feed2",
            "type": "address"
          },
          {
            "internalType": "enum PairsStorage.FeedCalculation",
            "name": "feedCalculation",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "maxDeviationP",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Feed",
        "name": "feed",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "spreadP",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "groupIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "feeIndex",
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
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "pairsBackend",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "from",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "to",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "feed1",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "feed2",
                "type": "address"
              },
              {
                "internalType": "enum PairsStorage.FeedCalculation",
                "name": "feedCalculation",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "maxDeviationP",
                "type": "uint256"
              }
            ],
            "internalType": "struct PairsStorage.Feed",
            "name": "feed",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "spreadP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "groupIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "feeIndex",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Pair",
        "name": "",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "job",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "minLeverage",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxLeverage",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxCollateralP",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Group",
        "name": "",
        "type": "tuple"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "openFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "closeFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "oracleFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nftLimitOrderFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referralFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minLevPosDai",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseFeeRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "priceImpactExponent",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Fee",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pairsCount",
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
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "openFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "closeFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "oracleFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "nftLimitOrderFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "referralFeeP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "minLevPosDai",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseFeeRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "priceImpactExponent",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Fee",
        "name": "_fee",
        "type": "tuple"
      }
    ],
    "name": "updateFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_id",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "bytes32",
            "name": "job",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "minLeverage",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxLeverage",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "maxCollateralP",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Group",
        "name": "_group",
        "type": "tuple"
      }
    ],
    "name": "updateGroup",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_long",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "_increase",
        "type": "bool"
      }
    ],
    "name": "updateGroupCollateral",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_pairIndex",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "string",
            "name": "from",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "to",
            "type": "string"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "feed1",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "feed2",
                "type": "address"
              },
              {
                "internalType": "enum PairsStorage.FeedCalculation",
                "name": "feedCalculation",
                "type": "uint8"
              },
              {
                "internalType": "uint256",
                "name": "maxDeviationP",
                "type": "uint256"
              }
            ],
            "internalType": "struct PairsStorage.Feed",
            "name": "feed",
            "type": "tuple"
          },
          {
            "internalType": "uint256",
            "name": "spreadP",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "groupIndex",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "feeIndex",
            "type": "uint256"
          }
        ],
        "internalType": "struct PairsStorage.Pair",
        "name": "_pair",
        "type": "tuple"
      }
    ],
    "name": "updatePair",
    "outputs": [],
    "stateMutability": "nonpayable",
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
