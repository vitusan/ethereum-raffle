//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Raffle {
    address public manager;
    address payable[] public players;

    constructor() {
        manager = msg.sender;
    }

    function pseudoRandom() private view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encode(block.difficulty, block.timestamp, players)
                )
            );
    }

    function getPrize() public view returns (uint256) {
        return address(this).balance;
    }

    function enter() public payable {
        for (uint256 i = 0; i < players.length; i++)
            require(
                msg.sender != players[i],
                "409: the player has already registered to the lottery."
            );

        require(
            msg.value == 0.01 ether,
            "402: Not enough cash money provided."
        );

        players.push(payable(msg.sender));
    }

    function pickWinner() public isOwner {
        uint256 index = pseudoRandom() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    function getPlayers()
        public
        view
        returns (address payable[] memory, uint256)
    {
        return (players, players.length);
    }

    modifier isOwner() {
        require(msg.sender == manager);
        _;
    }
    
}
