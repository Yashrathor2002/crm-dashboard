import Lead from "../models/Lead.js";
import User from "../models/User.js";

export const getStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: "new" });
    const wonLeads = await Lead.countDocuments({ status: "won" });
    const lostLeads = await Lead.countDocuments({ status: "lost" });
    const totalUsers = await User.countDocuments();

    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const leadsBySource = await Lead.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    const leadsOverTime = await Lead.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    res.json({
      totalLeads,
      newLeads,
      wonLeads,
      lostLeads,
      totalUsers,
      leadsByStatus,
      leadsBySource,
      leadsOverTime,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
