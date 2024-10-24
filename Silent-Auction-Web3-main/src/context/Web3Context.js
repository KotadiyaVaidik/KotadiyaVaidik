import React, { createContext, useEffect, useState } from 'react';
import { ethers , formatEther } from 'ethers'; 
import SilentABI from '../abi/SilentABI.json';

export const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [ongoingAuctions, setOngoingAuctions] = useState([]);
    const CONTRACT_ADDRESS = "0xe2266c99D593DEada0E37ecaafB906A8e20f7b53"; // Aontrect adresse

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                try {
                    const prov = new ethers.BrowserProvider(window.ethereum);
                    setProvider(prov);
    
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const accounts = await prov.listAccounts();
                    setAccount(accounts[0].address);
    
                    const sign = await prov.getSigner();
                    setSigner(sign);
    
                    const cont = new ethers.Contract(CONTRACT_ADDRESS, SilentABI, sign);
                    setContract(cont);
                } catch (error) {
                    console.error("Failed to initialize Web3:", error);
                }
            } else {
                console.error("Ethereum object not found, install MetaMask.");
            }
        };
        init();
    
        if (contract) {
            fetchOngoingAuctions();
        }
    }, [contract]);

    const fetchOngoingAuctions = async () => {
        if (!contract) {
            console.error("Contract is not initialized.");
            return;
        }
    
        try {
            const activeAuctions = await contract.getAllAuctions();
            console.log("Active Auctions:", activeAuctions);
    
            const formattedAuctions = activeAuctions.map((auction) => ({
                Owner: auction.Owner,
                highestBidder: auction.highestBidder,
                basePrice: auction.basePrice && auction.basePrice.toString() !== '0' 
                    ? formatEther(auction.basePrice) // Use ethers.utils
                    : "0", // Return "0" instead of "0.0"
                highestPrice: auction.highestPrice && auction.highestPrice.toString() !== '0' 
                    ? formatEther(auction.highestPrice) // Use ethers.utils
                    : "0", // Return "0" 
                Name: auction.Name,
                Time: auction.Time.toString(),
                creationTime: auction.creationTime.toString(),
                isAuctionOnGoing: auction.isAuctionOnGoing,
                success: auction.success,
                Pid:auction.Pid,
                highestBidder:auction.highestBidder
            }));
    
            console.log("Formatted Active Auctions:", formattedAuctions);
            setOngoingAuctions(formattedAuctions);
        } catch (error) {
            console.error("Error fetching ongoing auctions:", error);
        }
    };

    return (
        <Web3Context.Provider value={{ provider, signer, contract, account, ongoingAuctions, fetchOngoingAuctions }}>
            {children}
        </Web3Context.Provider>
    );
};