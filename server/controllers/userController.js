const bcrypt = require('bcrypt');

const User = require("../models/User");

const auth = require("../auth");
const { errorHandler } = auth;


module.exports.registerUser = async (req, res) => {
    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(409).send({ 
                error: 'Email already in use' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(req.body.email)) {
            return res.status(400).send({ 
                error: 'Email format is invalid' 
            });
        }

        // Validate mobile number length
        if (req.body.mobileNo.length !== 11) {
            return res.status(400).send({ 
                error: 'Mobile number is invalid' 
            });
        }

        // Validate password length
        if (req.body.password.length < 8) {
            return res.status(400).send({ 
                error: 'Password must be at least 8 characters long' 
            });
        }

        // If all validations pass, create a new user
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            mobileNo: req.body.mobileNo,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        const result = await newUser.save();
        return res.status(201).send({
            message: 'Registered Successfully',
        });

    } catch (error) {
        return errorHandler(error, req, res);
    }
};


module.exports.loginUser = async (req, res) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(req.body.email)) {
        return res.status(400).send({error: 'Email format is invalid'});
    }

    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send({error: 'No email found'});

        } else {
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

            if (isPasswordCorrect) {
                return res.status(200).send({access : auth.createAccessToken(user)})
            } else {
                return res.status(401).send({ error: 'Email and password do not match' });
            }
        }

    } catch (err) {
        return errorHandler (err, req, res);
    }
}


module.exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id,['-id']);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        } else {
            user.password = undefined;
            return res.status(200).send({ user: user });
        }
    }
    catch (error) {
        return errorHandler(error, req, res);
    }
}

module.exports.setAsAdmin = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId,['-id']);

        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }

        user.isAdmin = true;
        await user.save();
        user.password = undefined;
        res.status(200).send({ updatedUser : user});
    } catch (error) {
        res.status(500).send({ error: 'Failed in Find', details: error.message });
    }
};

module.exports.updatePassword = async (req, res) => {
    try {
      const { newPassword } = req.body;
      const { id } = req.user; 
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(id, { password: hashedPassword });
  
      res.status(200).send({ message: 'Password reset successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  };


module.exports.checkEmailExists = (req, res) => {

    if(req.body.email.includes("@")){
        return User.find({ email : req.body.email })
        .then(result => {

            // if there is a duplicate email (email exists)
            if (result.length > 0) {
                return res.status(409).send({message: "Duplicate email found"});
            } else { // if there is no duplicate email
                return res.status(404).send({message: "No duplicate email found"});
            };
        })
        .catch(error => errorHandler(error, req, res));
    }
    else{
        res.status(400).send({message: "Invalid email format"}); // false - Invalid email
    }
};





module.exports.enroll = (req, res) => {

    // user's id from the decoded token after verify()
    console.log("user token's id")
    console.log(req.user.id);

    // enrolled courses of the user from the request body
    console.log(req.body.enrolledCourses);

    if(req.user.isAdmin){
        return res.status(403).send({ message: 'Admin is forbidden' });
    }

    let newEnrollment = new Enrollment({
        userId: req.user.id,
        enrolledCourses: req.body.enrolledCourses,
        totalPrice: req.body.totalPrice
    });


    return newEnrollment.save().then(enrolled =>{
        return res.status(201).send({
            success: true,
            message: 'Enrolled successfully'
        });
    })
    .catch(error => errorHandler(error, req, res));

}

//[SECTION] Activity: Get enrollments
/*
    Steps:
    1. Use the mongoose method "find" to retrieve all enrollments for the logged in user
    2. If no enrollments are found, return a 404 error. Else return a 200 status and the enrollment record
*/
module.exports.getEnrollments = (req, res) => {
    return Enrollment.find({userId : req.user.id})
        .then(enrollments => {
            if (enrollments.length > 0) {
                return res.status(200).send(enrollments);
            }
            return res.status(404).send({
                message: 'No enrolled courses'
            });
        })
        .catch(error => errorHandler(error, req, res));
};

module.exports.updatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports.updateProfile = async (req, res) => {
  try {
    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Retrieve the updated profile information from the request body
    const { firstName, lastName, mobileNo } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
}



