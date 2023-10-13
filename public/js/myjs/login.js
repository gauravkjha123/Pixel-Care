$("#loginForm").validate({
    rules:{
        user_name:{
            required:true,
            minlength:4,
            maxlength:20,
        },
        password:{
            required:true,
            minlength:4,
            maxlength:50,
        }
    },
    messages:{

        user_name:{
            required:"Enter username!",
            maxlength:"User name cannot exceed more than 20 characters!",
            remote:"User name already exists!"
        },
        password:{
            required:"Enter password!",
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
            $.ajax({
                type: "post",
                url: "/login",
                data:formData,
                cache:false,
                processData:false,
                contentType:false,
                beforeSend: function(){
                    $('.load-gif').show();
                }, 
                success: function (res) {
                    toastr.success("Login Successful","Success!");
                    document.getElementById("user_name").value = "";
                    document.getElementById("pass").value = "";
                    if (res.role==1) {
                        return window.location.replace("/admin/dashboard");    
                    }
                    window.location.replace(`/api/profile/${res.id}`);            
                },
                error:function(error){
                    var err = JSON.parse(error.responseText)
                    $('.load-gif').hide();
                    toastr.error(err.error,"Error!")
                }
            });
    }
})