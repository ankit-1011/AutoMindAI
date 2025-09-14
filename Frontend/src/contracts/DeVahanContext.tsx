import{ createContext, useState, useEffect, ReactNode, useContext } from 'react';
import Web3Modal from 'web3modal';
import { BrowserProvider, Contract, Log} from 'ethers';
import ABI from "./DeVahanABI.json";
import { CONTRACT_ADDRESS } from "./contractAddress";

interface NFTContextType {
  currentAccount: string;
  error: string | null;
  connectWallet: () => Promise<void>;
  mintVehicle: (_owner:string, _vin:string,_make:string,_model:string,_year:number,_purchasePrice:number,_initialMileage:number,_imageURI:string) => Promise<string>; // Returns tx hash
  // transferNFT: (tokenId: number, price: bigint, balance: bigint) => Promise<string>; // Returns tx hash
  // getUserNFT:(address: string)=>Promise<number[]>
}

export const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const NFTProvider = ({ children }: { children: ReactNode }) => {
  const [currentAccount, setCurrentAccount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);

  // Initialize Web3Modal once
  useEffect(() => {
    const modal = new Web3Modal({
      cacheProvider: true, // Optional - enables wallet connection persistence
      providerOptions: {} // Add wallet providers here if needed
    });
    setWeb3Modal(modal);
    checkIfWalletConnected();
  }, []);

  const connectWallet = async () => {
    try {
      if (!web3Modal) throw new Error("Web3Modal not initialized");
      
      const instance = await web3Modal.connect();
      const provider = new BrowserProvider(instance);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      setCurrentAccount(accounts[0]);
      setError(null);

      // Subscribe to accounts change
      instance.on("accountsChanged", (accounts: string[]) => {
        setCurrentAccount(accounts[0] || '');
      });
      
      return accounts[0];
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      throw err;
    }
  };

  const checkIfWalletConnected = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask');
        return false;
      }
      
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error checking wallet:', err);
      return false;
    }
  };

  const getContract = async () => {
    if (!web3Modal) throw new Error("Web3Modal not initialized");
    console.log('checkpoint 1')
    const instance = await web3Modal.connect();
    const provider = new BrowserProvider(instance);
    console.log('checkpoint 2')
    const signer = await provider.getSigner();
    return new Contract(CONTRACT_ADDRESS, ABI.abi , signer);
  };

  const mintVehicle = async (_owner:string, _vin:string,_make:string,_model:string,_year:number,_purchasePrice:number,_initialMileage:number,_imageURI:string): Promise<string> => {
    try {
      console.log("checkpoint1")
      const contract = await getContract();
      console.log(contract);
      const tx = await contract.mintVehicle(_owner, _vin,_make,_model,_year,_purchasePrice,_initialMileage,_imageURI);
      const receipt = await tx.wait();
      console.log(receipt);
      console.log("miniting completed");

      // const mintedEventLog = receipt.logs.find(
      //       (log: Log) => {
      //           try {
      //               // This checks if the log can be parsed and is the correct event
      //               return contract.interface.parseLog(log)?.name === 'NFT_Minted';
      //           } catch {
      //               // Ignore logs that can't be parsed by this interface
      //               return false;
      //           }
      //       }
      //   );

      //   if (mintedEventLog) {
      //       const parsedLog = contract.interface.parseLog(mintedEventLog);

      //       // ✅ Add this check to ensure parsedLog is not null
      //       if (parsedLog) {
      //           const tokenId: bigint = parsedLog.args.tokenId;
      //           console.log("Minted token ID:", tokenId.toString());
      //           return tokenId.toString();
      //       }
      //   }

      //   // This part runs if the event was not found or couldn't be parsed
      //   console.warn("NFT_Minted event not found in logs.");
        return tx.hash;

      
    } catch (err) {
      console.error('Minting failed:', err);
      setError(err instanceof Error ? err.message : 'Minting failed');
      throw err;
    }
  };

// const transferNFT = async (
//   tokenId: number,
//   price: bigint,
//   balance: bigint
// ): Promise<string> => {
//   try {
//     const contract = await getContract();
//     const tx = await contract.NFT_transfer(tokenId, price, {
//       value: balance,
//     });
//     await tx.wait();
//     return tx.hash;
//   } catch (err) {
//     console.error("Transfer failed:", err);
//     setError(err instanceof Error ? err.message : "Transfer failed");
//     throw err;
//   }
// };

// const getUserNFT = async (address: string): Promise<number[]> => {
//   try {
//     const contract = await getContract();
//     console.log('checkpoint 2');
    
//     const result: bigint[] = await contract.getUserNFTs(address);
//     console.log('User NFTs:', result);

//     // Convert BigInt to Number
//     const nftArray = result.map(nft => Number(nft));
//     console.log("Final token IDs:", nftArray);
//     return nftArray;

//   } catch (error) {
//     console.error("Error fetching user NFTs:", error);
//     setError("Failed to get NFTs");
//     return [];
//   }
// };


  return (
    <NFTContext.Provider value={{
      currentAccount,
      error,
      connectWallet,
      mintVehicle,
      // transferNFT,
      // getUserNFT
    }}>
      {children}
    </NFTContext.Provider>
  );
};

export const useNFT = () => {
  const context = useContext(NFTContext);
  if (!context) throw new Error('useNFT must be used within an NFTProvider');
  return context;
};