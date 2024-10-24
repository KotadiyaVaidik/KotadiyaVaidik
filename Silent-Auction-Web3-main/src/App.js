import React, { useState, useContext, useEffect } from 'react';
import AuctionBox from './components/AuctionBox';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Web3Context } from './context/Web3Context';
import { parseEther } from 'ethers';

const App = () => {
    const { contract, ongoingAuctions } = useContext(Web3Context);
    const [newAuction, setNewAuction] = useState({ name: '', basePrice: '', time: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAuction({ ...newAuction, [name]: value });
    };

    const startAuction = async () => {
        try {
            const { name, basePrice, time } = newAuction;
            const tx = await contract.startAuction(
                name,
                parseEther(basePrice),
                parseInt(time)
            );
            await tx.wait();
            alert("Auction started successfully!");
            setNewAuction({ name: '', basePrice: '', time: '' });
            // No need to fetch ongoing auctions here as it's handled in Web3Provider
        } catch (error) {
            console.error("Failed to start auction:", error);
        }
    };

    return (
        <Container>
            <Row className="mt-4">
                <Col>
                    <h2>Start a New Auction</h2>
                    <Form>
                        <Form.Group controlId="auctionName">
                            <Form.Label>Auction Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newAuction.name}
                                onChange={handleInputChange}
                                placeholder="Enter auction name"
                            />
                        </Form.Group>

                        <Form.Group controlId="basePrice" className="mt-3">
                            <Form.Label>Base Price (in ETH)</Form.Label>
                            <Form.Control
                                type="text"
                                name="basePrice"
                                value={newAuction.basePrice}
                                onChange={handleInputChange}
                                placeholder="Enter base price"
                            />
                        </Form.Group>

                        <Form.Group controlId="time" className="mt-3">
                            <Form.Label>Duration (in seconds)</Form.Label>
                            <Form.Control
                                type="text"
                                name="time"
                                value={newAuction.time}
                                onChange={handleInputChange}
                                placeholder="Enter duration time"
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            className="mt-3"
                            onClick={startAuction}
                        >
                            Start Auction
                        </Button>
                    </Form>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <h2>Ongoing Auctions</h2>
                    <div className="d-flex flex-wrap">
                        {ongoingAuctions.map((auction, index) => (
                            <AuctionBox key={index} product={auction} />
                        ))}
                    </div>
                </Col>
        </Row>
        </Container>
    );
};

export default App;
