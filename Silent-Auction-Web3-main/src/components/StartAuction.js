import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { Button, Form, Modal } from 'react-bootstrap';
import { parseEther } from 'ethers';
const StartAuction = () => {
    const { contract, account } = useContext(Web3Context);
    const [show, setShow] = useState(false);
    const [name, setName] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [time, setTime] = useState("");

    const handleStartAuction = async () => {
        if (name && basePrice && time) {
            try {
                const tx = await contract.startAuction(name, parseEther(basePrice),parseInt(time));
                await tx.wait();
                alert("Auction started successfully!");
                await fetchOngoingAuctions();
                setShow(false);
                window.location.reload();
            } catch (error) {
                console.error("Failed to start auction:", error);
            }
        }
    };

    return (
        <>
            <Button variant="success" onClick={() => setShow(true)}>Auction Now</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Start New Auction</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Base Price (ETH)</Form.Label>
                            <Form.Control type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Auction Duration (Seconds)</Form.Label>
                            <Form.Control type="number" value={time} onChange={(e) => setTime(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
                    <Button variant="primary" onClick={handleStartAuction}>Start Auction</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default StartAuction;
