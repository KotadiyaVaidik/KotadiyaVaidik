import React, { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../context/Web3Context';
import { Card, Button } from 'react-bootstrap';
import { parseEther, formatEther } from 'ethers';

const AuctionBox = ({ product }) => {
    const { contract, account } = useContext(Web3Context);
    const [isAuctionEnded, setIsAuctionEnded] = useState(false);
    const [winner, setWinner] = useState('');
    const [finalPrice, setFinalPrice] = useState(0);

    useEffect(() => {
        const checkAuctionStatus = async () => {
            if (!product.isAuctionOnGoing) {
                setIsAuctionEnded(true);
                setWinner(product.highestBidder);
                setFinalPrice(product.highestPrice);
            }
        };
        checkAuctionStatus();
    }, [product]);

    const placeBid = async () => {
        const bidAmount = prompt("Enter your bid amount in ETH");
        if (bidAmount && parseFloat(bidAmount) > 0) {
            try {
                const tx = await contract.bid(product.Pid, parseEther(bidAmount));
                await tx.wait();
                alert("Bid placed successfully!");
            } catch (error) {
                console.error("Bid failed:", error);
                alert("Failed to place bid. Please try again.");
            }
        } else {
            alert("Invalid bid amount. Please enter a positive number.");
        }
    };

    const endAuction = async () => {
        try {
            const tx = await contract.endAuction(product.Pid);
            await tx.wait();
            alert("Auction ended successfully!");
            setIsAuctionEnded(true);
            setWinner(product.highestBidder);
            setFinalPrice(product.highestPrice);
        } catch (error) {
            console.error("Failed to end auction:", error);
            alert("Failed to end auction. Please try again.");
        }
    };

    const formattedBasePrice = product.basePrice && product.basePrice.toString() !== '0' 
        ? parseInt(product.basePrice) 
        : "0"; 

    const formattedHighestPrice = product.highestPrice && product.highestPrice.toString() !== '0' 
        ? parseInt(product.highestPrice) 
        : "0"; 

    return (
        <Card style={{ width: '18rem', margin: '1rem' }}>
            <Card.Body>
                <Card.Title>{product.Name}</Card.Title>
                <Card.Text>
                    Base Price: {formattedBasePrice} ETH <br />
                    Highest Bid: {formattedHighestPrice} ETH <br />
                    {isAuctionEnded ? (
                        <>
                            <strong>Auction Ended</strong><br />
                            Winner: {winner} <br />
                            Final Price: {finalPrice} ETH <br />
                        </>
                    ) : (
                        <>
                            Highest Bidder: {product.highestBidder} <br />
                        </>
                    )}
                </Card.Text>
                {!isAuctionEnded ? (
                    <>
                        <Button variant="primary" onClick={placeBid}>Bid Now</Button>
                        <Button variant="danger" onClick={endAuction}>End Auction</Button>
                    </>
                ) : null}
            </Card.Body>
        </Card>
    );
};

export default AuctionBox;
