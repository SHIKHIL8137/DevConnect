
export const validateProfileForm = (formData) => {
  const errors = {};

  if (!formData.userName || !formData.userName.trim()) {
    errors.userName = "Username is required";
  } else if (formData.userName.trim().length < 3) {
    errors.userName = "Username must be at least 3 characters";
  }

  if (!formData.position || !formData.position.trim()) {
    errors.position = "position is required";
  } else if (formData.position.trim().length < 3) {
    errors.position = "position must be at least 3 characters";
  }

 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }


  const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/;
  if (formData.phoneNumber && !phoneRegex.test(formData.phoneNumber)) {
    errors.phoneNumber = "Please enter a valid phone number";
  }


  if (typeof formData.skills === 'string') {
    const skillsArray = formData.skills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (skillsArray.length === 0) {
      errors.skills = "Please enter at least one skill";
    }
  } else if (!Array.isArray(formData.skills) || formData.skills.length === 0) {
    errors.skills = "Please enter at least one skill";
  }

  if (!formData.about || !formData.about.trim()) {
    errors.about = "Please tell us about yourself";
  } else if (formData.about.trim().length < 20) {
    errors.about = "About section should be at least 20 characters";
  }


  if (formData.pricePerHour && isNaN(Number(formData.pricePerHour))) {
    errors.pricePerHour = "Price must be numeric";
  }

  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

  if (formData.gitHub && !urlRegex.test(formData.gitHub)) {
    errors.gitHub = "Please enter a valid GitHub URL";
  }
  if (formData.linkedIn && !urlRegex.test(formData.linkedIn)) {
    errors.linkedIn = "Please enter a valid LinkedIn URL";
  }
  if (formData.twitter && !urlRegex.test(formData.twitter)) {
    errors.twitter = "Please enter a valid Twitter URL";
  }
  if (formData.web && !urlRegex.test(formData.web)) {
    errors.web = "Please enter a valid website URL";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};

export const formatProfileData = (formData) => {
  const formatted = { ...formData };

  formatted.phoneNumber =
  formData.phoneNumber && formData.phoneNumber.toString().trim()
    ? Number(formData.phoneNumber.toString().replace(/[\s\-()]/g, ''))
    : null;

  formatted.pricePerHour = formData.pricePerHour
    ? parseFloat(formData.pricePerHour.toString().replace(/[$\s]/g, ''))
    : null;

  if (typeof formData.skills === 'string') {
    formatted.skills = formData.skills.trim()
      ? formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      : [];
  }

  ['gitHub', 'linkedIn', 'twitter', 'web'].forEach(site => {
    if (formatted[site] && !formatted[site].match(/^https?:\/\//)) {
      formatted[site] = `https://${formatted[site]}`;
    }
  });

  return formatted;
};
