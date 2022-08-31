import path from 'path';
import fs from 'fs';
//@ts-ignore
import * as solc from 'solc';

const inboxPath = path.resolve(__dirname, 'contract', 'raffle.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

const input = {
    language: 'Solidity',
    sources: {
        'raffle.sol': {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*'],
            },
        },
    },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
    'raffle.sol'
].Raffle;

export const { abi, evm } = compiled;
