const Bus = require("../models/busschema");

function to24Hour(time12h = "") {
  if (!time12h) return "";
  if (!/AM|PM/i.test(time12h)) return time12h;
  const [time, modifier] = time12h.split(" ");
  let [hours, minutes] = time.split(":");
  if (hours === "12") hours = "00";
  if (modifier.toUpperCase() === "PM") hours = String(parseInt(hours, 10) + 12);
  return `${hours.padStart(2, "0")}:${minutes}`;
}

exports.getAdmin = (req, res) => res.render("adminForm");

exports.createBus = async (req, res) => {
  try {
    const busData = { ...req.body };
    busData.departureTime = to24Hour(busData.departureTime);
    busData.arrivalTime = to24Hour(busData.arrivalTime);
    await Bus.create(busData);
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error adding bus: " + err.message);
  }
};

exports.editBus = async (req, res) => {
  const bus = await Bus.findById(req.params.id);
  res.render("editBus", { bus });
};

exports.updateBus = async (req, res) => {
  await Bus.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/");
};

exports.deleteBus = async (req, res) => {
  await Bus.findByIdAndDelete(req.params.id);
  res.redirect("/");
};
