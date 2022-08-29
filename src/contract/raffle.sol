//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Raffle {

    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0.01 ether, 'Not enough cash money provided.');
        players.push(msg.sender);
    }

}
