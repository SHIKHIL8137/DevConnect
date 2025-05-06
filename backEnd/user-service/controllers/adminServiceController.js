import User from "../model/userModel.js"

export const dashboardDetails = async (req, res) => {
  try {

    const countByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    const recentFreelancers = await User.find({ role: "freelancer" })
      .sort({ createdAt: -1 })
      .limit(5);

    const recentClients = await User.find({ role: "client" })
      .sort({ createdAt: -1 })
      .limit(5);

      const data = {
        countByRole,
        recentFreelancers,
        recentClients
      }

    res.status(200).json({
      status: true,
      data
    });

  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};


export const getFreelancersData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search || "";
    
    const searchFilter = {
      role: "freelancer",
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { skills: { $regex: searchQuery, $options: "i" } } 
      ]
    };

    const freelancersData = await User.find(searchFilter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalFreelancers = await User.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalFreelancers / limit);
const data ={
  currentPage: page,
  totalPages,
  totalFreelancers,
  freelancers: freelancersData
}
    res.status(200).json({
     data
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const getClientsData = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const searchQuery = req.query.search || "";
    
    const searchFilter = {
      role: "client",
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
        { position: { $regex: searchQuery, $options: "i" } } 
      ]
    };

    const clientsData = await User.find(searchFilter).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalClients = await User.countDocuments(searchFilter);
    const totalPages = Math.ceil(totalClients / limit);
const data ={
  currentPage: page,
  totalPages,
  totalClients,
  clients: clientsData
}
    res.status(200).json({
     data
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};


export const updateBlockStatus = async (req, res) => {
  try {
    const  userId  = req.query.userId;
    console.log(userId)
    if (!userId) {
      return res.status(400).json({ status: false, message: "User ID is missing" });
    }
   
    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { block: !user.block },
      { new: true }
    );

    return res.status(200).json({
      status: true,
      message: `User has been ${updatedUser.block ? "blocked" : "unblocked"}`,
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Server Error", error: error.message });
  }
};
