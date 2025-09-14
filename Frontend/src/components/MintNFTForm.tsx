import React, { useState, useContext } from 'react';
import { X, Check } from 'lucide-react';
import { LoadingState } from './LoadingState';
import { NFTContext } from "../contracts/DeVahanContext";


interface MintNFTFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const MintNFTForm: React.FC<MintNFTFormProps> = ({ isOpen, onClose }) => {
  // --- 1. All hooks must be called at the top level ---
  const nftContext = useContext(NFTContext);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formData, setFormData] = useState({
    _owner: '',
    _vin: '',
    _make: '',
    _model: '',
    _year: new Date().getFullYear(), // Default to current year
    _purchasePrice: 0,
    _initialMileage: 0,
  });
  // 2. File inputs need their own state
  const [imageFile, setImageFile] = useState<File | null>(null);

  // --- 3. Early returns must come AFTER all hooks ---
  if (!isOpen) return null;
  if (!nftContext) {
    // A better UI would be to show this inside the modal
    return <div className="text-white">Error: NFT Context not available.</div>;
  }
  
  const { mintVehicle } = nftContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };
  
  // 3. Separate handler for the file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 4. Set loading state BEFORE the async operation
    setFormState('loading');

    // try {
    //   // In a real app, you would upload the imageFile to IPFS/Cloudinary first
    //   // to get a URI. For now, we'll use a placeholder.
    //   const imageURI = "ipfs://placeholder_for_uploaded_image";

    //   console.log("Minting with data:", { ...formData, imageURI });

    //   let MediaURL;
    //     if(!imageURI){
    //         console.log('media is not inserted')
    //         return;
    //     }
    //     console.log(imageURI);
    //     const formData1 = new FormData();
    //     formData1.append("file",imageURI);
    //     formData1.append("upload_preset", "NFT_Marketplace");
    //     console.log(formData1);

    //     const res = await fetch("https://api.cloudinary.com/v1_1/dbvezos5j/image/upload", {
    //       method: "POST",
    //       body: formData1
    //     });
        
    //     const data = await res.json();
    //     console.log(data);
        
    //         MediaURL = data.data.secure_url;
    //         console.log("Cloudinary response:", data.data);


    //   // Call the minting function from the context
    //   const tx = await mintVehicle(
    //     formData._owner,
    //     formData._vin,
    //     formData._make,
    //     formData._model,
    //     formData._year,
    //     formData._purchasePrice,
    //     formData._initialMileage,
    //     MediaURL
    //   );

    //   // await tx.wait(); // Wait for the transaction to be mined

    //   setFormState('success');

    //   setTimeout(() => {
    //     setFormState('idle');
    //     onClose(); // Close the modal
    //   }, 3000);

    // } catch (error) {
    //   console.error("Minting failed:", error);
    //   // Let the user know something went wrong
    //   alert("Minting failed. Check the console for details.");
    //   setFormState('idle'); // Reset form on error
    // }


    try {
      // Placeholder - should be a File object or a valid URL
    
      console.log("Minting with data:", { ...formData});
    
      // const formData1 = new FormData();
      // formData1.append("file", imageURI);
      // formData1.append("upload_preset", "NFT_Marketplace");
    
      // const res = await fetch("https://api.cloudinary.com/v1_1/dbvezos5j/image/upload", {
      //   method: "POST",
      //   body: formData1,
      // });
    
      // const data = await res.json();
      // console.log("Cloudinary response:", data);
    
      // const MediaURL = data.secure_url; // ✅ Correct
      // console.log("Uploaded image URL:", MediaURL);


      if (!imageFile) {
        console.log("No file selected");
        return;
      }
      
      const formData1 = new FormData();
      formData1.append("file", imageFile); // ✅ real file object
      console.log(imageFile);
      formData1.append("upload_preset", "NFT_Marketplace");
      
      const res = await fetch("https://api.cloudinary.com/v1_1/dbvezos5j/image/upload", {
        method: "POST",
        body: formData1,
      });
      
      const data = await res.json();
      console.log("Cloudinary response:", data);
      
      const MediaURL = data.secure_url; // ✅ correct URL
      
      console.log(MediaURL)
      // Call the minting function
      const tx = await mintVehicle(
        formData._owner,
        formData._vin,
        formData._make,
        formData._model,
        formData._year,
        formData._purchasePrice,
        formData._initialMileage,
        MediaURL
      );
    
      setFormState("success");
    
      setTimeout(() => {
        setFormState("idle");
        onClose();
      }, 3000);
    
    } catch (error) {
      console.error("Minting failed:", error);
      alert("Minting failed. Check the console for details.");
      setFormState("idle");
    }
    
  };

  return (
    <div className="absolute overflow-y-scroll inset-0 bg-black/70 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-primary-light top-20 rounded-lg p-6 w-full max-w-md relative border border-metallic/30 shadow-[0_0_15px_rgba(255,215,0,0.1)]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-metallic hover:text-white disabled:opacity-50"
          disabled={formState === 'loading'}
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gold">Mint Vehicle NFT</h2>
          <p className="text-metallic">Create a new digital ownership certificate</p>
        </div>

        {formState === 'idle' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* --- 5. Corrected input names to match state --- */}
            <div>
              <label className="block text-sm font-medium text-metallic mb-1">Customer Wallet Address</label>
              <input type="text" name="_owner" required onChange={handleChange} className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-white" placeholder="0x..." />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-metallic mb-1">Vehicle VIN</label>
              <input type="text" name="_vin" required onChange={handleChange} className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-white" placeholder="Enter vehicle's VIN" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-metallic mb-1">Make (e.g., Toyota)</label>
              <input type="text" name="_make" required onChange={handleChange} className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-white" placeholder="Enter vehicle make" />
            </div>

            <div>
              <label className="block text-sm font-medium text-metallic mb-1">Model (e.g., Camry)</label>
              <input type="text" name="_model" required onChange={handleChange} className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-white" placeholder="Enter vehicle model" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-metallic mb-1">Year</label>
              <input type="number" name="_year" required onChange={handleChange} className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-white" placeholder="e.g., 2021" />
            </div>

            <div>
              <label className="block text-sm font-medium text-metallic mb-1">Purchase Price ($)</label>
              <input type="number" name="_purchasePrice" required onChange={handleChange} className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-white" placeholder="e.g., 25000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-metallic mb-1">Initial Mileage</label>
              <input type="number" name="_initialMileage" required onChange={handleChange} className="w-full px-3 py-2 bg-primary border border-metallic/20 rounded-lg focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30 text-white" placeholder="e.g., 15000" />
            </div>

            <div>
              <label className="block text-sm font-medium text-metallic mb-1">Vehicle Image</label>
              <input type="file" name="image" required onChange={handleFileChange} className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-primary hover:file:bg-gold/90" />
            </div>
            
            <button type="submit" className="w-full py-3 mt-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-green text-primary font-bold hover:opacity-90 transition-all transform hover:scale-[1.01] active:scale-[0.99]">
              Mint Now
            </button>
          </form>
        )}
        
        {formState === 'loading' && <LoadingState message="Minting vehicle NFT... Please wait for transaction confirmation." />}
        
      </div>
    </div>
  );
};

export default MintNFTForm;