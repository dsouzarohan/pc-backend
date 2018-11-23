const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  

  const tokenHeader = req.get('X-Authorization')
  

 try{

   const token = tokenHeader.split(' ')[1];
   const decodedToken = jwt.verify(token, "MYSECRETTHATWILLBECHANGEDSOON");

   
   

   if(!decodedToken){
     res.status(401).json({
       message: "You are unauthorized to access this resource"
     });
   } else {
     req.userData = { email: decodedToken.email, userID: decodedToken.userID };
     next();
   }

 } catch(error){
   res.json({
     error
   })
 }
};