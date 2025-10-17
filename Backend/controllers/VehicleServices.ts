import { Request, Response } from "express";
import VehicleService from "../models/VehicleService";

export const addServices = async (req: Request, res: Response) => {
  const { vehicleId, serviceHash } = req.body;

  if (!vehicleId || !serviceHash)
    return res.status(400).json({ error: "Missing vehicleId or hash" });

  try {
    const vehicle = await VehicleService.findOne({ vehicleId });
    if (vehicle) {
      vehicle.serviceHashes.push(serviceHash);
      await vehicle.save();
    } else {
      await VehicleService.create({ vehicleId, serviceHashes: [serviceHash] });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ error: "Failed to save" });
  }
}