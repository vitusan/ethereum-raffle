import * as dotenv from 'dotenv';
dotenv.config();
import HDWalletProvider from '@truffle/hdwallet-provider';
import Web3 from 'web3';

import { abi, evm } from './compile';

const provider = new HDWalletProvider(
    process.env.ACCOUNT_MNEMONIC as string,
    process.env.NODE_ENDPOINT,
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ gas: 1000000, from: accounts[0] });

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
};

deploy();
