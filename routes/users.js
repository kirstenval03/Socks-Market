var express = require('express');
var router = express.Router();
const User = require("../models/User");
const isAuthenticated = require('../middleware/isAuthenticated');
const isProfileOwner = require('../middleware/isProfileOwner');

/* GET users */

//SEE USER DETAIL 

router.get('/user-detail/userId', (req, res, next) =>  {
  
  const { userId } = req.params

  User.findById(userId)
  .then((foundUser)  => {
    res.json(foundUser)
  })

  .catch((err) => {
    console.log(err)
    next(err)
  })
});


//DELETE PROFILE 

router.get('/delete/:userId', isAuthenticated, isProfileOwner, (req, res, next) => {

  const { userId } = req.params

    User.findByIdAndDelete(userId)
      .then((deletedUser) => {

        Sock.deleteMany({
          owner: deletedUser._id
        })
          .then((deletedSocks) => {
            console.log("Deleted socks", deletedSocks)
            res.json(deletedUser)
          })
          .catch((err) => {
            console.log(err)
            next(err)
          }) 
          
      })
      .catch((err) => {
        console.log(err)
        next(err)
      })

})

//UPDATE PROFILE
router.post('/user-update/:userId', isAuthenticated, isProfileOwner, (req, res, next) => {

  const { userId } = req.params

  const { email, password, fullName, location, username } = req.body

  User.findByIdAndUpdate(
    userId,
    {
      email,
      password,
      fullName,
      location,
      username
    },
    { new: true }
  )
  .then((updatedUser) => {
    res.json(updatedUser)
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })

})

module.exports = router;
