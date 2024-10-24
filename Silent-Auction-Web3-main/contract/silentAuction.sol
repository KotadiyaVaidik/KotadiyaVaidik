// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Silent {
    struct Product {
        address payable Owner;
        address highestBidder;
        uint256 basePrice;
        uint256 highestPrice;
        uint256 Time;
        uint256 Pid;
        string Name;
        uint256 creationTime;
        bool isAuctionOnGoing;
        bool success;
    }

    Product[] public products;
    uint256 public productCount = 0;

    modifier onTime(Product storage p) {
        require(block.timestamp < p.Time, "Auction has ended.");
        _;
    }

    modifier onlyOwner(Product storage p) {
        require(p.Owner == msg.sender, "Only the owner can perform this action.");
        _;
    }

    modifier paymentPerson(Product storage p) {
        require(p.highestBidder == msg.sender, "Only the winning bidder can make payment.");
        _;
    }

    event StartAuctionEvent(uint256 indexed productId, address onlyOwner, string name, uint256 basePrice);
    event EndAuctionEvent(uint256 indexed productId, address winner, uint256 finalPrice, bool success);

    function startAuction(string memory _name, uint256 _basePrice, uint256 _time) public {
        Product memory newProduct = Product({

            Owner: payable(msg.sender),
            Pid:productCount,
            highestBidder: msg.sender,
            basePrice: _basePrice,
            highestPrice: _basePrice,
            Time: block.timestamp + _time,
            Name: _name,
            creationTime: block.timestamp,
            isAuctionOnGoing: true,
            success: true
        });

        products.push(newProduct);
        emit StartAuctionEvent(productCount, msg.sender, _name, _basePrice);
        productCount += 1;
    }

    function bid(uint256 _itemNumber, uint256 _amount) public onTime(products[_itemNumber]) {
        require(msg.sender != products[_itemNumber].Owner, "Owner cannot bid.");
        Product storage x = products[_itemNumber];
        require(_amount > x.highestPrice, "Bid must be higher than current highest bid.");

        x.highestPrice = _amount;
        x.highestBidder = msg.sender;
    }

    function endAuction(uint256 _item) public onlyOwner(products[_item]) {
        Product storage x = products[_item];
        require(x.Time <= block.timestamp, "Auction is still ongoing.");
        x.isAuctionOnGoing = false;
        x.success = x.highestBidder != x.Owner;
        emit EndAuctionEvent(_item, x.highestBidder, x.highestPrice, x.success);
    }


    function getItems(uint256 _item) public view returns (string memory) {
        return products[_item].Name;
    }

    function getAllAuctions() public view returns (Product[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < products.length; i++) {
            if (products[i].isAuctionOnGoing) {
                count++;
            }
        }

        Product[] memory activeProducts = new Product[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < products.length; i++) {
            if (products[i].isAuctionOnGoing) {
                activeProducts[j] = products[i];
                j++;
            }
        }
        return products;
    }
}
