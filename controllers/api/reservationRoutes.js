const express = require("express");
const router = express.Router();
const { Reservation, User } = require("../../models"); // Ensure paths match your models' locations

// Helper function to generate time slots for 3 days
const generateTimeSlots = () => {
  const slots = [];
  const timeOptions = ["5:00 PM", "7:00 PM", "9:00 PM"];
  const daysToAdd = 3;

  for (let i = 0; i < daysToAdd; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateString = date.toISOString().split("T")[0];
    timeOptions.forEach((time) => slots.push({ date: dateString, time }));
  }

  return slots;
};

// Endpoint to get available reservation slots
router.get("/available-slots", async (req, res) => {
  try {
    const requestedDate = req.query.date; // Expected format: 'YYYY-MM-DD'
    const generatedSlots = generateTimeSlots();

    // Filter slots for the requested date
    const availableSlotsForDate = generatedSlots.filter(
      (slot) => slot.date === requestedDate
    );
    res.json(availableSlotsForDate);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

function formatDateTime(date, time) {
  // Assuming time is in 'HH:MM AM/PM' format
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":");
  hours = modifier === "PM" ? parseInt(hours, 10) + 12 : hours; // Convert to 24-hour format

  // Combine date and time in YYYY-MM-DD HH:MM:SS format
  return `${date} ${hours}:${minutes}:00`;
}

// Endpoint to make a reservation
router.post("/make", async (req, res) => {

  try {
    const userId = req.session.user_id;
    console.log(userId, "USER ID***************************************");
    const { reservationDate, slotTime, guestCount, full_name } = req.body;

    // Format the datetime string for the database
    const dateTimeString = formatDateTime(reservationDate, slotTime);

    // Validate the dateTimeString
    if (isNaN(new Date(dateTimeString))) {
      return res.status(400).json({ error: "Invalid datetime value" });
    }

    const newReservation = await Reservation.create({
      date_created: dateTimeString,
      guest_counts: guestCount,
      user_id: userId,
      full_name,
    });

 

    return res.status(201).json(newReservation);
  } catch (error) {
    console.error("Reservation creation error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Endpoint to cancel a reservation
// /api/reservations/cancel
router.delete("/cancel/:reservationId", async (req, res) => {
  try {
    const { reservationId } = req.params;
    // Assuming that reservationId is enough to uniquely identify the reservation
    const result = await Reservation.destroy({
      where: { id: reservationId },
    });

    if (result > 0) {
      res.json({ message: "Reservation cancelled successfully." });
    } else {
      res.status(404).json({ error: "Reservation not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
