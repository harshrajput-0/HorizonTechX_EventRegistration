import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { Event } from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";

//
//
// ------------------------------------------------------------------------------------
// ==| CREATE REGISTERATION |==========================================================
// ------------------------------------------------------------------------------------
export const createRegistration = asyncHandler(async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  // Count confirmed registrations for this event
  const confirmedCount = await Registration.countDocuments({
    event: eventId,
    status: "confirmed",
  });

  if (confirmedCount >= event.capacity) {
    throw new ApiError(400, "This event is already full");
  }

  // Check any existing registration
  const existingRegration = await Registration.findOne({
    user: userId,
    event: eventId,
  });
  

  // Check for existing registration and reactivate previously cancelled registrations
  if (existingRegration) {
    if (existingRegration.status === "confirmed") {
      throw new ApiError(409, "This user is already registered for this event");
    } else {
      existingRegration.status = "confirmed";
      await existingRegration.save();
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            existingRegration,
            "Registration reactivated successfully",
          ),
        );
    }
  }

  const registration = await Registration.create({
    user: userId,
    event: eventId,
  });

  res
    .status(201)
    .json(
      new ApiResponse(201, registration, "Registration created successfully"),
    );
});

//
//
// -------------------------------------------------------------------------------------
// ==| REGISTERATION BY USER |==========================================================
// -------------------------------------------------------------------------------------
export const getRegistrationsByUser = asyncHandler(async (req, res) => {
  const registrations = await Registration.find({
    user: req.params.userId,
  }).populate("event");

  res
    .status(200)
    .json(
      new ApiResponse(200, registrations, "Registrations fetched successfully"),
    );
});

//
//
// ------------------------------------------------------------------------------------
// ==| CANVEL REGISTERATION |==========================================================
// ------------------------------------------------------------------------------------
export const cancelRegistration = asyncHandler(async (req, res) => {
  const registration = await Registration.findById(req.params.id);

  if (!registration) {
    throw new ApiError(404, "Registration not found");
  }

  registration.status = "cancelled";
  await registration.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, registration, "Registration cancelled successfully"),
    );
});
