import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const DealerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  Dealer_ID:{type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Encrypt password before save
DealerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
DealerSchema.methods.matchPassword = async function (enteredPassword :string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Dealer = mongoose.model("Dealer", DealerSchema);
export default Dealer;
