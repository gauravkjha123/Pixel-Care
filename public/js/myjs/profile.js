var image = ''
var flag = 0;
function loadMime(file,callback) {
    
    //List of known mimes
    var mimes = [
        {
            mime: 'image/jpeg',
            pattern: [0xFF, 0xD8, 0xFF],
            mask: [0xFF, 0xFF, 0xFF],
        },
        {
            mime: 'image/png',
            pattern: [0x89, 0x50, 0x4E, 0x47],
            mask: [0xFF, 0xFF, 0xFF, 0xFF],
        }
        // you can expand this list @see https://mimesniff.spec.whatwg.org/#matching-an-image-type-pattern
    ];
    
    function check(bytes, mime) {
        for (var i = 0, l = mime.mask.length; i < l; ++i) {
            if ((bytes[i] & mime.mask[i]) - mime.pattern[i] !== 0) {
                return false;
            }
        }
        return true;
    }
    
    var blob = file.slice(0, 4); //read the first 4 bytes of the file
    
    var reader = new FileReader();
    reader.onloadend = function(e) {
        if (e.target.readyState === FileReader.DONE) {
            var bytes = new Uint8Array(e.target.result);
            
            for (var i=0, l = mimes.length; i<l; ++i) {
                // if (check(bytes, mimes[i])) console.log("Mime: " + mimes[i].mime + " <br> Browser:" + file.type);
                if (check(bytes, mimes[i])){
                    flag = 1;
                    return callback(flag);
                };
            }
            flag = 2;
            return callback(flag);
        }
    };
    reader.readAsArrayBuffer(blob);
}

function load_preview_image(input) {
    
    if (input.files && input.files[0]) {
        loadMime(input.files[0],function(myFlag){
        
        });
        
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#preview_div").css('display','block');
            $('#image_preview').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        $("#preview_div").hide();
    }
    
    const file = input.files[0];
    const FR = new FileReader();
    FR.addEventListener("load", function(evt) {
        FR.result;
    });     
    FR.readAsDataURL(input.files[0]);
    image = FR;
    console.log(image.result,'BASE64');
}

$("#profile_frm").validate({
    rules:{
        first_name:{
            required:true,
            pattern:/\D+/,
            minlength:3,
            maxlength:20,
            
        },
        last_name:{
            required:true,
            pattern:/\D+/,
            minlength:3,
            maxlength:20,
        },
        phone_number:{
            required:true,
            maxlength:20,
            pattern:/^\d{10}$/
        },
        department:{
            required:false,
            minlength:3,
            maxlength:20,
            pattern:/\D+/
        }, 
        user_name:{
            required:true,
            minlength:4,
            maxlength:20,
            remote:{
                url:"/admin/users/check-duplicate-user_name",
                type:"post",
                data:{
                    id:function(){
                        return $("#id").val();
                    }
                }
            }
        },
        password:{
            required:{
                depends:function(){
                    if($("#password").val() == undefined || $("#id").val() == null || $("#id").val() == ""){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            },
            minlength:4,
            maxlength:50,
            equalTo:"#password"
            
        },
        password_confirmation:{
            required:{
                depends:function(){
                    if($("#password").val() == undefined || $("#id").val() == null || $("#id").val() == ""){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            },
            minlength:4,
            maxlength:50,
            equalTo:"#password"
            
        },
    },
    messages:{
        first_name:{
            required:"Please enter first name!",
            minlength:"Atleast 3 characters are required!",
            maxlength:"First name cannot exceed 20 characters!",
            pattern:"First name should have alphabets and spaces only!"
        },
        last_name:{
            required:"Please enter last lame!",
            minlength:"Atleast 3 characters are required!",
            maxlength:"Last name cannot exceed 20 characters!",
            pattern:"Last name should have alphabets and spaces only!"
        },
        user_name:{
            required:"Please enter username!",
            user_name:"Enter user Name in proper format",
            minlength:"Atleast 4 Characters are required!",
            maxlength:"User name cannot exceed more than 20 characters!",
            remote:"User name already exists!"
        },
        department:{
            required:"Please enter department!",
            minlength:"Minimum 3 characters required!",
            maxlength:"Department cannot exceed 20 characters!",
            pattern:"Please enter department in alphabets and spaces only!"
        },
        phone_number:{
            required:"Please enter phone number!",
            phone_number:"Phone number should be in proper format!",
            maxlength:"Phone number cannot exceed 20 characters!",
            pattern:"Please enter valid phone number!"
        },
        password:{
            required:"Please enter password!",
        },
        password_confirmation:{
            required:"Please enter Confirm Password!",
            equalTo:"Password is not matched!"
            
        },
        image:{
            extension:"Only jpg,jpeg,png,gif formats are supported!"
        }
    },
    success: function (label, element) {
        $("#" + element.name + "-error").empty();
    },

    errorPlacement:function(error,element){
        $("#"+element.attr('name')+"-error").html(error.html());
    },
    success:function(label){
        
    },
    submitHandler:function(form,e){
        e.preventDefault();
        var formData = new FormData(form);
        if(image != ''){
            formData.append('image',image.result);
        }
        if(flag != 2){
            $.ajax({
                type: "post",
                url: "/admin/profile",
                data:formData,
                cache:false,
                processData:false,
                contentType:false,
                beforeSend: function(){
                    $('.load-gif').show();
                }, 
                success: function (response) {
                    if(response.status == true){
                        toastr.success(response.message,"Updated!") 
                        $('.load-gif').hide();                           
                    }else{
                        $('.load-gif').hide();
                        toastr.error(response.message,"Error!")
                    }              
                },
                error:function(error){
                    var err = JSON.parse(error.responseText)
                    $('.load-gif').hide();
                    toastr.error(err.error,"Error!")
                }
            });
        }else{
            toastr.error("In-valid file","Error!");
        }
    }
})