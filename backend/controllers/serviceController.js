const Service = require("../models/Service");

// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();

    res.json(services);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get service by id
exports.getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service)
      return res.status(404).json({
        message: "Service not found",
      });

    res.json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create service
exports.createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);

    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(service);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);

    res.json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};