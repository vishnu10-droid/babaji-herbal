import Contact from "../model/contact.model.js";

// ========================================
// CREATE CONTACT
// POST /api/contact
// ========================================

export const createContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    // Create contact
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contact,
    });
  } catch (error) {
    console.log("Create contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send your message",
      error: error.message,
    });
  }
};



export const getContact = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({
      name: 1,
    });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get contact messages",
      error: error.message,
    });
  }
};