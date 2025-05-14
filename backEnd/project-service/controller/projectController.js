import { projectAppliedUser } from '../api/userApi.js';
import {Project} from '../model/projectModel.js'
export const addProject = async(req,res)=>{
  try {
    const {
      title,
      description,
      features = '',
      preferences = '',
      timeline,
      budget,
      referralLink = '',
    } = req.body;

     if (!title || !description || !timeline || !budget) {
      return res.status(400).json({status:false, message: 'Missing required fields' });
    }
     if (!title || !description || !timeline || !budget) {
      return res.status(400).json({status:false, message: 'Missing required fields' });
    }
const {userId }=req.user;

 const attachments = req.files?.map(file => file.path) || [];

  console.log('Received attachments:', attachments);
    console.log('Received body:', req.body);

    const newProject = new Project({
      title,
      description,
      features,
      preferences,
      timeline,
      budget,
      referralLink,
      attachments,
      appliedUsers: [],
      completionStatus: 'open', 
      clientId:userId,
      freelancerId: '' ,
    });

    await newProject.save();

    res.status(200).json({
      status:true,
      message: 'Project created successfully',
      project: newProject
    });
    
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const getProjectOfUser = async(req,res)=>{
  try {
    const {userId}=req.user;
    const projectData = await Project.find({ clientId: userId }).sort({ createdAt: -1 });

    let project = projectData ? projectData : [];

    res.status(200).json({status:true,project})
  } catch (error) {
    console.log(error)
     res.status(500).json({ message: 'Server error' });
  }
}

export const projectDetails = async(req,res)=>{
  try {
    const {id} = req.query;
    const {userId,userName} = req.user;
    const project = await Project.findById(id);
    const projectData = project ? project : []
     const appliedUser  = project.appliedUsers.find(
      (user) => user.freelancerId === userId
    );
    const appliedUsers = project.appliedUsers
     const hasApplied = appliedUser ? true : false;
    res.status(200).json({projectData,hasApplied,appliedUser,appliedUsers});
  } catch (error) {
    console.log(error)
     res.status(500).json({ message: 'Server error' });
  }
}

export const freelancerHome = async(req,res)=>{
  try {
    const {
      search = "",
      category,
      minBudget,
      maxBudget,
      page = 1,
      limit = 10,
      sortBy,
      sortOrder,
       duration,
    } = req.query;
    const query = { completionStatus: "open" }; 
    const durationMap = {
      "Less than 1 month": { $lt: 30 },
      "1-3 months": { $gte: 30, $lte: 90 },
      "3-6 months": { $gt: 90, $lte: 180 },
      "6+ months": { $gt: 180 },
    };
if (duration && durationMap[duration]) {
      query.timeline = durationMap[duration];
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      const categoryArray = category.split(",");
      query.category = { $in: categoryArray };
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = parseFloat(minBudget);
      if (maxBudget) query.budget.$lte = parseFloat(maxBudget);
    }
    const sortOptions = {};
    if (sortBy === "createdAt") {
      sortOptions.createdAt = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "title") {
      sortOptions.title = sortOrder === "desc" ? -1 : 1;
    } else if (sortBy === "budget") {
      sortOptions.budget = sortOrder === "desc" ? -1 : 1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await Project.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(query);

    res.status(200).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: projects,
    });
  } catch (error) {
    console.error("Error in freelancerHomeData:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const applyToProject = async (req, res) => {
  try {
    const { projectId } = req.body; 
    const {userId:freelancerId,userName:freelancerName}= req.user;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const alreadyApplied = project.appliedUsers.some(
      (app) => app.freelancerId.toString() === freelancerId.toString()
    );
    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this project" });
    }

    project.appliedUsers.push({
      freelancerId,
      freelancerName,
      status: "applied",
      appliedAt: new Date(),
    });
    const formData ={
       projectId
    }
    const token = req.cookies?.token
    console.log('formddata',token)
    await projectAppliedUser(formData,token);
    await project.save();   
    res.status(200).json({ message: "Application submitted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
