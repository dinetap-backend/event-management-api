const { Event, User } = require("../models");
const { Op } = require("sequelize");

exports.createEvent = async (req, res) => {
  const { title, dateTime, location, capacity } = req.body;

  if (capacity < 1 || capacity > 1000) {
    return res.status(400).json({ error: "Capacity must be between 1 and 1000" });
  }

  const event = await Event.create({ title, dateTime, location, capacity });
  res.status(201).json({ eventId: event.id });
};

exports.getEventDetails = async (req, res) => {
  const event = await Event.findByPk(req.params.id, {
    include: [{ model: User, attributes: ["id", "name", "email"] }],
  });

  if (!event) return res.status(404).json({ error: "Event not found" });

  res.json(event);
};

exports.registerUser = async (req, res) => {
  const { id: eventId } = req.params;
  const { userId } = req.body;

  const event = await Event.findByPk(eventId, { include: User });
  if (!event) return res.status(404).json({ error: "Event not found" });

  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const isPast = new Date(event.dateTime) < new Date();
  if (isPast) return res.status(400).json({ error: "Cannot register for past event" });

  const alreadyRegistered = await event.hasUser(user);
  if (alreadyRegistered) return res.status(400).json({ error: "User already registered" });

  const registrations = await event.countUsers();
  if (registrations >= event.capacity) return res.status(400).json({ error: "Event is full" });

  await event.addUser(user);
  res.status(200).json({ message: "User registered successfully" });
};

exports.cancelRegistration = async (req, res) => {
  const { id: eventId, userId } = req.params;

  const event = await Event.findByPk(eventId);
  const user = await User.findByPk(userId);

  if (!event || !user) return res.status(404).json({ error: "Event or user not found" });

  const isRegistered = await event.hasUser(user);
  if (!isRegistered) return res.status(400).json({ error: "User not registered" });

  await event.removeUser(user);
  res.status(200).json({ message: "Registration cancelled" });
};

exports.listUpcomingEvents = async (req, res) => {
  const now = new Date();
  const events = await Event.findAll({
    where: { dateTime: { [Op.gt]: now } },
  });

  events.sort((a, b) => {
    if (new Date(a.dateTime) - new Date(b.dateTime) !== 0) {
      return new Date(a.dateTime) - new Date(b.dateTime);
    }
    return a.location.localeCompare(b.location);
  });

  res.json(events);
};

exports.eventStats = async (req, res) => {
  const event = await Event.findByPk(req.params.id, { include: User });

  if (!event) return res.status(404).json({ error: "Event not found" });

  const totalRegistrations = event.Users.length;
  const remainingCapacity = event.capacity - totalRegistrations;
  const percentUsed = ((totalRegistrations / event.capacity) * 100).toFixed(2);

  res.json({
    totalRegistrations,
    remainingCapacity,
    percentUsed: `${percentUsed}%`,
  });
};
