var image = '';
$("#date_of_birth").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange:"-100:-18",
    dateFormat:"yy-mm-dd",
    defaultDate:"-18y"
});
$("#date_of_birth").val("");

var dataTable = $('.data-table').DataTable({
    'processing' : true,
    'serverSide' : true,
    'serverMethod' : 'get',
    'ordering':true,
    'start':2,
    'length':2,
    'ajax' : {
        'data':"json",
        'type':"get",
        'url' : '/admin/users'
    },
    'aaSorting' : [],
    columnDefs: [
        { "width": "5%", "targets": 0 },
        { "width": "10%", "targets": 1 },
        { "width": "25%", "targets": 2 },
        { "width": "20%", "targets": 3 },
        { "width": "10%", "targets": 4 },
        { "width": "20%", "targets": 5 },
        {
            targets: 0,
            checkboxes: {
                selectRow: true
            }
        },
        {
            orderable: false,
            targets: [0, 5]
        }
    ],
    select: {
        style: 'multi'
    },
    'columns' : [
        { data : 'id',orderable:false,searchable:false },
        { data : 'image',orderable:false,searchable:false,render:function(data,type,row,meta){
            return '<img src='+row.image+' width="50px" height="50px" class="rounded-circle" onerror="this.src=`/images/userNotFound.jpg`;"></img>';
        }
        },
        { data : 'name', name:'first_name',orderable:true,
        render:function(data,type,row,meta){
            return row.first_name+ " "+ row.last_name
        }
    },
    { data : 'user_name' ,name:'user_name' ,orderable:true},
{ data : 'status',
render: function (data, type, row, meta) {
    var checked;
    if(row.status == '1'){
        checked = 'checked';
    }else{
        checked = '';
    }
    return (
        '<div class="text-center custom-control custom-switch custom-switch-off-white custom-switch-on-success">'+
        '<input '+checked+' type="checkbox" class="custom-control-input status-toggle status-change" value="'+row.status+'" data-id="'+row.id+'" id="status-'+row.id+'">'+
        '<label class="custom-control-label status-label" for="status-'+row.id+'"></label>'+
        '</div>'
        );
        
    },
    orderable:false
},

{
    targets: 1,
    data: "id",
    render: function (data, type, row, meta) {
        return (
            "<a href='javascript:void(0)' class='edit btn btn-sm btn-success' data-id='" +
            data + //id is passed to here
            "'>" +
            '<i class="fa-solid fa-pen-to-square"></i>' + //the name I want to pass to here.
            "</a> &nbsp; &nbsp;" +
            
            "<a href='javascript:void(0)' class='delete btn btn-sm btn-danger' data-id='" +
            data + //id is passed to here
            "'>" +
            '<i class="fa-solid fa-trash"></i>' + //the name I want to pass to here.
            "</a> &nbsp; &nbsp;"+
            
            "<a href='javascript:void(0)' class='view btn btn-sm btn-primary' data-id='" +
            data + //id is passed to here
            "'>" +
            '<i class="fa-solid fa-eye"></i>' + //the name I want to pass to here.
            "</a> &nbsp; &nbsp;"
            );
        },
        orderable:false
    },
]
});

$('.data-table').wrap('<div class="dataTables_scroll" />');

$(document).on('click','.create',function(){
    $("#add_edit_form")[0].reset();
    $("#id").val("");
    // $("#add_edit_form").validate().resetForm();
    $('.modal-title').text('Add User');
    $('#save').text('Add');
    $(".stores-div").css('display',"block");
    $(".roles").css('display',"block");
    let html = " <option disabled selected>-- Select Shop --</option>";
    $("#store_id").html(html)
    $('#add_edit_modal').modal('show');
    // validateForm();
})


$(document).on('change','#role',function(){
    
    var data = $(this).val();
    $.ajax({
        type: "post",
        url: "/admin/users/get-all-stores",
        data: {data},
        dataType: "json",
        success: function (response) {
            if(response.status == true){
                let html = " <option disabled selected>-- Select Shop --</option>"; 
                $.each(response.data, function(key, value) {   
                    html += "<option value='"+value.id+"'>"+value.name+"</option>"
                });
                $('#store_id').html(html);
            }else{
                toastr.error(response.message,'Error')
            }
        }
    });
});

$("#add_edit_modal").on('hidden.bs.modal',function(){
    $("#add_edit_form")[0].reset();
    $("#add_edit_form").validate().resetForm();
    $("#add_edit_form").find('.error').removeClass('error');
    $("#add_edit_form").find('.error-message').text("");
    $('#image-show').css("display","none");
    $('#image-show').attr('src',"");
    image = ''
}) 

$(document).on('change','#image', function(){
    const file = this.files[0];
    
    const FR = new FileReader();
    FR.addEventListener("load", function(evt) {
        FR.result;
    });     
    FR.readAsDataURL(this.files[0]);
    image = FR;
    
    const extensions = ['image/png','image/jpg','image/jpeg','image/gif'];
    if (file){
        if(extensions.includes(file.type)){
            let reader = new FileReader();
            reader.onload = function(event){
                $('#image-show').css("display","block");
                $('#image-show').attr('src', event.target.result);
            }
            reader.readAsDataURL(file);   
        }else{
            $('#image-show').css("display","none");
            $('#image-show').attr('src', "");            
        }
    }
});

$(document).on('click','.edit',function(){
    $("#add_edit_form").validate().resetForm();
    $("#add_edit_form")[0].reset();
    var id = $(this).data('id');
    
    $.ajax({
        type: "get",
        url: "/admin/users/"+id,
        success: function (response) {
            if(response.status == true){
                Object.keys(response.data).map(function(key) {
                    if (key != 'image') {
                        $(`#${key}`).val(response.data[key]);
                    }
                });
                $("#id").val(response.data.id);
                $('#image-show').css("display","block");
                $('#image-show').attr('src', response.data.image);
                $(".roles").hide();
                $('.modal-title').text('Edit User');
                $('#save').text('Save changes');
                $('#add_edit_modal').modal('show');
                $('#add_edit_modal').modal('show');    
                $('#add_edit_modal').modal('show');     
            }else{
                toastr.error('Something went wrong!','Error!');
            }
        }
    });
});


$("#add_edit_form").validate({
    rules:{
        first_name:{
            required:true,
            minlength:3,
            maxlength:20,
            pattern:/\D+/
        },
        last_name:{
            required:false,
            minlength:3,
            maxlength:20,
            pattern:/\D+/
        },
        role:{
            required:false
        },
        image:{
            extension:"png|jpg|jpeg|gif|webp"
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
                    if($("#id").val()){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            minlength:4,
            maxlength:50,
        },
        password_confirmation:{
            required:{
                depends:function(){
                    if($("#id").val()){
                        return false;
                    }
                    else{
                        return true;
                    }
                }
            },
            equalTo:"#password",
            minlength:4,
            maxlength:50,
        },
    },
    messages:{
        first_name:{
            required:"Please enter first name!",
            minlength:"Minimum 3 characters required!",
            maxlength:"First name cannot exceed 20 characters!",
            pattern:"Please enter first name in alphabets and spaces only!"
        },
        last_name:{
            required:"Please enter last name!",
            minlength:"Minimum 3 Characters required!",
            maxlength:"Last name cannot exceed 20 characters!",
            pattern:"Please enter last name in alphabets and spaces only!"
        },
        department:{
            required:"Please enter department!",
            minlength:"Minimum 3 characters required!",
            maxlength:" Department cannot exceed 20 characters!",
            pattern:"Please enter department in alphabets and spaces only!"
        },
        user_name:{
            required:"Please enter username",
            user_name:"User name should be in proper format!",
            minlength:"Minimum 4 characters required!",
            maxlength:"User name cannot exceed 20 characters!",
            remote:"This username already exists!"
        },
        phone_number:{
            required:"Please enter phone number",
            phone_number:"Phone number should be in proper format!",
            maxlength:"Phone number cannot exceed 20 characters!",
            pattern:"Please enter valid phone number!"
        },
        password:{
            required:"Please enter password!",
        },
        password_confirmation:{
            required:"Please enter confirmed password!",
            equalTo:"Password is not matched!"
        },
        image:{
            extension:"Only jpg, jpeg, png and gif Formats are supported!"
        }
    },
    
    success: function (label, element) {
        $("#" + element.name + "-error").empty();
    },

    errorPlacement:function(error,element){
         $("#"+element.attr('name')+"-error").html(error.html());
    },

    submitHandler:function(form,e){
        e.preventDefault();
        var formData = new FormData(form);
        formData.set('image',image.result)
        $.ajax({
            type: "POST",
            enctype: 'multipart/form-data',
            url: "/admin/user/update",
            data:formData,
            dataType:'json',
            cache:false,
            contentType:false,
            processData:false,
            success: function (response) {
                if(response.status == true){
                    $("#add_edit_modal").modal("hide");
                    toastr.success(response.message,"Success!");
                    $('.data-table').DataTable().ajax.reload();
                }else{
                    if(response.message){
                        toastr.error(response.message,"Error!")                        
                    }else{
                        toastr.error(response.error,"Error!")                        
                    }
                }                   
            },
            error:function(error){
                toastr.error(error?.responseText,"Error!")                        
            }
        });
    }
});


$("#add_edit_modal").on('hidden.bs.modal',function(){
    $("#add_edit_form")[0].reset();
    $("#add_edit_form").validate().resetForm();
    $("#add_edit_form").find('.error').removeClass('error');
    $("#add_edit_form").find('.error-message').text("");
    $('#image-show').css("display","none");
    $('#image-show').attr('src',"");
}); 

$(document).on('click','.delete',function(){
    var id = $(this).data('id');
    
    Swal.fire({
        title: 'Are you sure want to Delete these record?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
        if (result.value == true) {
            $.ajax({
                type: "delete",
                url: "/admin/users/"+id,
                success: function (response) {
                    if(response.status == true){
                        $('.data-table').DataTable().ajax.reload(null,false);
                        toastr.success('Data deleted successfully!','Success!')
                    }else{
                        toastr.error(response.error,'Error!');
                    }
                }
            });
        }
    });
});

$(document).on('click','.refresh',function(){
    $('.data-table').DataTable().ajax.reload(null,false);
})

$('#frm-example').on('submit', function(e) {
    e.preventDefault();
    var rows_selected = dataTable.column(0).checkboxes.selected();
    console.log(rows_selected);
    if (rows_selected.length > 0) {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure want to delete multiple users?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value == true) {
                var selected_rows_array = [];
                $.each(rows_selected, function(index, rowId) {
                    selected_rows_array.push(rowId);
                });
                // var _token = $("input[name=_token]").val();
                e.preventDefault();
                $.ajax({
                    type: 'POST',
                    data: {
                        ids: selected_rows_array,
                    },
                    url:"/admin/users/multiple-delete",
                    
                    beforeSend: function() {
                        $('#multiple_user_delete_loader').show();
                        $("#multiple_delete_btn").prop('disabled', true);
                    },
                    success: function(response) {
                        $('.data-table').DataTable().ajax.reload();
                        toastr.success(response.message,"Success!")
                        $('#multiple_user_delete_loader').hide();
                        if (response.status) {
                            table.columns().checkboxes.deselect(true);
                            toastr.success(response.message);
                            $('.data-table').DataTable().ajax.reload();
                        } else {
                            toastr.error(response.message);
                        }
                    },
                    error: function() {
                        $('#multiple_user_delete_loader').hide();
                        $("#multiple_delete_btn").prop('disabled', false);
                        toastr.error('Please Reload Page.');
                    }
                });
            } else {
                return false;
            }
        });
    } else {
        toastr.error('Please select atleast any one row');
        e.preventDefault();
    }
});

$(document).on('change','.status-toggle',function(){
    var id = $(this).data('id');
    
    Swal.fire({
        title: 'Are you sure want to change this status?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Change it!'
    }).then((result) => {
        if (result.value == true) {
            $.ajax({
                type: "patch",
                url: "/admin/users/change-status/"+id,
                success: function (response) {
                    if(response.status == true){
                        $('.data-table').DataTable().ajax.reload();
                        toastr.success(response.message,'Success!');
                    }else{
                        toastr.error(response.message,'Error!');
                    }
                },
                error:function(error){
                    toastr.error(err.errors,'Error!');
                }
            });
        }else{
            // console.log('checkbox ',($(this).is(':checked') == true) ? 'false' : 'true');
            $(this).prop('checked',($(this).is(':checked') == true) ? false : true);
        }
    });
});

function loadFallbackImage(image) {
    image.src=""
    image.src="/images/userNotFound.jpg"
}

$(document).on('click','.view',function(){

    var id = $(this).data('id');
    
    $.ajax({
        type: "get",
        url: "/admin/users/"+id,
        success: function (response) {
            if(response.status == true){    
                $("#view_image_preview").attr('src',response.data.image);
                $("#user_name").text(response.data.first_name);
               
                $("#view_user_name").text(response.data.user_name);
                if(response.data.department){
                    $("#view_department").text(response.data.department);
                }else{
                    $("#view_department").text('-');
                }
                if(response.data.password ){
                    $("#view_password").text(response.data.password);
                }else{
                    $("#view_password").text('-');
                }
                if(response.data.phone_number){
                    $("#view_phone_number").text(response.data.phone_number);
                }else{
                    $("#view_phone_number").text('-');
                }
                $("#view_created_at").text(moment(response.data.created_at).format('MMMM Do YYYY'));
                // $("#view_status").text(response.data.status);
                if(response.data.status == 1){
                    $("#view_status").html('<span class="badge badge-success">Active</span>');
                }else if(response.data.status == 0){
                    $("#view_status").html('<span class="badge badge-danger">In-Active</span>');
                }else{
                    $("#view_status").html('<span class="badge badge-secondary">Pending</span>');
                }
                $('.modal-title').text('View User');
                $("#view_user_modal").modal('show');
            }else{
                toastr.error('Something went wrong!','Error!');
            }            
        }
    });
    
    
});