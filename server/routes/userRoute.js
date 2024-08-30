const express = require("express");
//const passport = require("passport");
const userController = require("../controllers/userController");
const { verify, verifyAdmin, isLoggedIn } = require("../auth");

const router = express.Router();

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details",verify, userController.getProfile); 

router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

router.patch('/update-password', verify, userController.updatePassword);

router.post("/check-email", userController.checkEmailExists);

router.post("/enroll", verify, userController.enroll);

router.get('/get-enrollments', verify, userController.getEnrollments);


/*
//Google Login
router.get('/google',
		passport.authenticate('google', {
			scope: ['email', 'profile'],
			prompt: "select_account"
		}	
	));


//Callback for Google OAuth authentication
router.get('/google/callback',
		passport.authenticate('google', {
			failureRedirect: '/users/failed',
		}),
		function (req, res) {
			res.redirect('/users/success')
		}
	);


//Route for failed Google Oauth 
router.get('/failed', (req, res) => {
	console.log('User is not authenticated');
	res.send("Failed")
})

//Route for success
router.get('/success', isLoggedIn, (req, res) => {
	console.log('You are logged in')
	console.log(req.user)
	res.send(`Welcome ${req.user.displayName}`)
})


//Google Logout
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			console.log("Error while destroying session:", err);
		} else {
			req.logout(() => {
				console.log('You are logged out');
				res.redirect('/')
			})
		}
	})
})


//Mini Activities
router.put('/profile', verify, userController.updateProfile);

*/

module.exports = router;