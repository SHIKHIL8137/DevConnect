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

    console.log(req.body)
     if (!title || !description || !timeline || !budget) {
      return res.status(400).json({status:false, message: 'Missing required fields' });
    }
     if (!title || !description || !timeline || !budget) {
      return res.status(400).json({status:false, message: 'Missing required fields' });
    }
const {userId }=req.user;

 const attachments = req.files?.map(file => file.path) || [];

 console.log(attachments)

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