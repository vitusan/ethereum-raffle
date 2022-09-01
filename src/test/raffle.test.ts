import assert from 'assert';
import ganache from 'ganache';
import Web3 from 'web3';
const web3 = new Web3(ganache.provider() as any);
import { abi, evm } from '../compile';
import { Contract } from "web3-eth-contract";

process.env.TS_NODE_PROJECT = './tsconfig.json';
require('ts-mocha');
import Mocha from 'mocha';

let lottery: Contract;
let accounts: string[];

Mocha.beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(abi)
        .deploy({ data: evm.bytecode.object })
        .send({ from: accounts[0], gas: 1_000_000 });
});

Mocha.describe('Lottery Contract', () => {
    it('deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('allows one to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.01', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[0], players[0][0]);
        assert.equal(1, players[1]);
    });

    it('allows multiple accounts to enter', async () => {
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.01', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.01', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[3],
            value: web3.utils.toWei('0.01', 'ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });

        assert.equal(accounts[1], players[0][0]);
        assert.equal(accounts[2], players[0][1]);
        assert.equal(accounts[3], players[0][2]);
        assert.equal(3, players[1]);
    });

    it('do not allow same account to enter twice', async () => {
        await lottery.methods.enter().send({
            from: accounts[4],
            value: web3.utils.toWei('0.01', 'ether')
        });

        try {
            await lottery.methods.enter().send({
                from: accounts[4],
                value: web3.utils.toWei('0.01', 'ether')
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('do not allow incorrect entry ticket value', async () => {
        try {
            await lottery.methods.enter().send({
                from: accounts[5],
                value: web3.utils.toWei('0.1', 'ether')
            });
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('gets prize', async () => {
        const prize = await lottery.methods.getPrize().send({
            from: accounts[0]
        });
        assert(prize);
    });

    it('gets participants', async () => {
        const participants = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        assert(participants);
    });

    it('only admin picks a winner', async () => {
        try {
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
        } finally {
            await lottery.methods.enter().send({
                from: accounts[1],
                value: web3.utils.toWei('0.01', 'ether')
            });
            await lottery.methods.pickWinner().send({
                from: accounts[0]
            });
            const participants = await lottery.methods.getPlayers().call({
                from: accounts[0]
            });
            assert.equal(participants[0], 0);
        }
    });

});
