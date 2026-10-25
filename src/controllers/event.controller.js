import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import { Event } from "../models/event.model.js";
import { Registration } from "../models/registration.model.js";
import { cloudinary } from "../configs/cloudinary.js";

//
//
// ----------------------------------------------------------------------------
// ==| CREATE EVENT |==========================================================
// -----------------------------------------------------------------------------
export const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, capacity } = req.body;

  if (
    [title, description, date, location].some(
      (field) => !field || field.trim() === "",
    )
  ) {
    throw new ApiError(
      400,
      "Title, description, date and location are required",
    );
  }
  if (!capacity || isNaN(capacity) || Number(capacity) < 1) {
    throw new ApiError(400, "Capacity must be a positive number");
  }

  let thumbnail = req.body.thumbnail || "";
  // In testing if create event is giving 
  // Error:EISDIR: illegal operation on a directory, read
  // Then consider sending no thumbnail fron frontend or Postman 

  // Upload thumbnail
  if (req.file) {
    thumbnail = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "event-system-uploads" },
        (error, result) => {
          if (error) reject(new ApiError(500, "Image upload failed"));
          else resolve(result.secure_url);
        },
      );
      uploadStream.end(req.file.buffer);
    });
  }

  const event = await Event.create({
    title,
    description,
    date,
    location,
    capacity,
    thumbnail,
    organizer: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, event, "Event created successfully"));
});

//
//
// ----------------------------------------------------------------------------
// ==| UPDATE EVENT |==========================================================
// -----------------------------------------------------------------------------
export const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (
    event.organizer.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You can only edit events you created");
  }

  const { title, description, date, location, capacity } = req.body;
  let thumbnail = req.body.thumbnail;

  // Upload thumbnail
  if (req.file) {
    thumbnail = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "event-system-uploads" },
        (error, result) => {
          if (error) reject(new ApiError(500, "Image upload failed"));
          else resolve(result.secure_url);
        },
      );
      uploadStream.end(req.file.buffer);
    });
  }

  const updates = {
    title,
    description,
    date,
    location,
    capacity,
    thumbnail,
  };

  // Update only the provided fields
  Object.keys(updates).forEach((key) => {
    if (updates[key] !== undefined) {
      event[key] = updates[key];
    }
  });

  const updatedEvent = await event.save();
  res
    .status(200)
    .json(new ApiResponse(200, updatedEvent, "Event updated successfully"));
});

//
//
// ----------------------------------------------------------------------------
// ==| DELETE EVENT |==========================================================
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  if (
    event.organizer.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    throw new ApiError(403, "You can only delete events you created");
  }

  await event.deleteOne();
  res
    .status(200)
    .json(new ApiResponse(200, null, "Event deleted successfully"));
});

//
//
// ----------------------------------------------------------------------------
// ==| GET MY EVENT |==========================================================
export const getMyEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({ organizer: req.user._id });

  res.status(200).json(new ApiResponse(200, events, "Events fetched"));
});

//
//
// -----------------------------------------------------------------------------
// ==| GET ALL EVENT |==========================================================
export const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Event.find();

  res.status(200).json(new ApiResponse(200, events, "All events fetched!"));
});

//
//
// -------------------------------------------------------------------------------
// ==| GET EVENT BY ID |==========================================================
export const getEventById = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id).populate(
    "organizer",
    "name email avatar phone",
  );

  if (!event) {
    throw new ApiError(404, "No event found");
  }

  const confirmedCount = await Registration.countDocuments({
    event: event._id,
    status: "confirmed",
  });

  const eventData = {
    ...event.toObject(),
    spotsLeft: event.capacity - confirmedCount,
  };

  res
    .status(200)
    .json(new ApiResponse(200, eventData, "Event fetched successfully"));
});
