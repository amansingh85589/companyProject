const Organization = require('../models/organizationModel');

// ---------------------------------------------
// CREATE ORGANIZATION
// SuperAdmin only
// ---------------------------------------------
exports.createOrg = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Organization name is required' });
    }

    const existingOrg = await Organization.findOne({ name });
    if (existingOrg) {
      return res.status(409).json({ message: 'Organization already exists' });
    }

    const org = await Organization.create({ name });

    res.status(201).json({
      message: 'Organization created successfully',
      organization: org
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------
// LIST ORGANIZATIONS
// SuperAdmin only — full list, protected
// ---------------------------------------------
exports.listOrgs = async (req, res) => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    res.status(200).json({ organizations: orgs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ---------------------------------------------
// LIST ORGANIZATIONS (PUBLIC)
// No auth — used to populate the org dropdown on Admin/User signup forms.
// Only exposes _id and name, nothing sensitive.
// ---------------------------------------------
exports.listOrgsPublic = async (req, res) => {
  try {
    const orgs = await Organization.find().select('_id name').sort({ name: 1 });
    res.status(200).json({ organizations: orgs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
