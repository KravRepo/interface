export const PriceAggregator_ImplementationABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
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
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "a",
        "type": "address"
      }
    ],
    "name": "AddressUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkCancelled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkFulfilled",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "id",
        "type": "bytes32"
      }
    ],
    "name": "ChainlinkRequested",
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
        "internalType": "address",
        "name": "a",
        "type": "address"
      }
    ],
    "name": "NodeAdded",
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
        "internalType": "address",
        "name": "oldNode",
        "type": "address"
      }
    ],
    "name": "NodeRemoved",
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
        "internalType": "address",
        "name": "oldNode",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newNode",
        "type": "address"
      }
    ],
    "name": "NodeReplaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "NumberUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "request",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "node",
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
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "referencePrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "linkFee",
        "type": "uint256"
      }
    ],
    "name": "PriceReceived",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_a",
        "type": "address"
      }
    ],
    "name": "addNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "claimBackLink",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "_requestId",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "_price",
        "type": "uint256"
      }
    ],
    "name": "fulfill",
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
        "internalType": "enum PriceAggregator.OrderType",
        "name": "_orderType",
        "type": "uint8"
      }
    ],
    "name": "getPrice",
    "outputs": [
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
        "internalType": "contract IStorage",
        "name": "_storageT",
        "type": "address"
      },
      {
        "internalType": "contract IPairsStorage",
        "name": "_pairsStorage",
        "type": "address"
      },
      {
        "internalType": "contract ITriggerInfo",
        "name": "_triggerInfo",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "_nodes",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "_linkAddress",
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
    "name": "linkFee",
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
    "inputs": [],
    "name": "minAnswers",
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
    "name": "nodes",
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
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_pairIndex",
        "type": "uint256"
      }
    ],
    "name": "openFeeP",
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
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "name": "orderIdByRequest",
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
    "name": "orders",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "pairIndex",
        "type": "uint256"
      },
      {
        "internalType": "enum PriceAggregator.OrderType",
        "name": "orderType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "linkFee",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "initiated",
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
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "ordersAnswers",
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
    "name": "pairsStorage",
    "outputs": [
      {
        "internalType": "contract IPairsStorage",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "pendingSlOrders",
    "outputs": [
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
        "name": "buy",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "newSl",
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
    "name": "removeNode",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_a",
        "type": "address"
      }
    ],
    "name": "replaceNode",
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
        "internalType": "uint256",
        "name": "orderId",
        "type": "uint256"
      },
      {
        "components": [
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
            "name": "buy",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "newSl",
            "type": "uint256"
          }
        ],
        "internalType": "struct PriceAggregator.PendingSl",
        "name": "p",
        "type": "tuple"
      }
    ],
    "name": "storePendingSlOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "triggerInfo",
    "outputs": [
      {
        "internalType": "contract ITriggerInfo",
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
        "name": "orderId",
        "type": "uint256"
      }
    ],
    "name": "unregisterPendingSlOrder",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_minAnswers",
        "type": "uint256"
      }
    ],
    "name": "updateMinAnswers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
