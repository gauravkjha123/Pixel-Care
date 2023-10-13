const User = require('../../models').User;
const fs = require('fs');
const path = require('path');
const {userValidation} = require('../../validations/api/userValidation');
const bcrypt = require('bcryptjs');

const edit = async(req,res)=>{
    
    var user = await User.findOne({where:{id:req.user_id},attributes:{exclude:['password']}});
    if(user == null){
        return res.status(400).json({status:false,message:'User not found!'});
    }
    return res.status(200).json({status:true,message:'User Profile Details',data:user});
}

const update = async(req,res)=>{
    
    const id = req.user_id;
    // const id = 1250;
    
    const result = userValidation(req.body);
    if(result.error){
        return res.status(422).json({status:false,message:result.error.message});
    }
    
    const {
        image
    } = req.body
    
    if(image){
        
        var dir = './storage/images/users'
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }  
        
        var getUserImage = await User.findOne({where:{id},
            attributes:['id','image'],
            raw:true
        });
        if(getUserImage == null){
            return res.status(400).json({status:false,message:'User not found!'});
        }
        //remove existing image code
        if(id != '' && image != undefined && image != ''){
            if(getUserImage.image != null){
                fs.unlinkSync(process.cwd()+"/storage/images/users/"+getUserImage.image);
                await User.update({image:null},{where:{id}});
            }
        }
        
        //Image Upload
        if(image){
            var imageType = image.substring(
                image.indexOf("/") + 1, 
                image.lastIndexOf(";")
                );
                
                var imageName = Date.now().toString()+"."+imageType;
                
                var base64Data = req.body.image.replace(/^data:image\/[a-z]+;base64,/, "");
                await fs.writeFile(path.join(__dirname,'../../storage/images/users',imageName), base64Data, 'base64', function(err) {
                    console.log(err,'image');
                });
                req.body.image = imageName;
            }
        }
        const updateUser = await User.update(req.body,{where:{id}});
        const getUser = await User.scope('removePassword').findOne({where:{id}});
        return res.status(200).json({status:true,data:getUser,message:"Profile updated successfully!"});
    }
    
    module.exports = {edit,update}