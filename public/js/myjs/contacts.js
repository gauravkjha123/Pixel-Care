var dataTable = $('.data-table').DataTable({
    'processing' : true,
    'serverSide' : true,
    'serverMethod' : 'get',
    'ordering':true,
    // 'select':true,
    // 'bFilter':false,
    // 'bInfo':false,
    // 'bPaginate':false,
    'start':2,
    'length':2,
    'ajax' : {
        'data':"json",
        'type':"get",
        'url' : '/admin/contacts'
    },
    'aaSorting' : [],
    columnDefs: [
        { "width": "5%", "targets": 0 },
        { "width": "15%", "targets": 1 },
        { "width": "15%", "targets": 2 },
        { "width": "5%", "targets": 3 },
        { "width": "25%", "targets": 4 },
        { "width": "10%", "targets": 5 },
        {
            targets: 0,
            checkboxes: {
                selectRow: true
            }
        },
        {
            orderable: false,
            targets: [0, 4]
        }
    ],
    select: {
        style: 'multi'
    },
    'columns' : [
        { data : 'id',orderable:false,searchable:false },
        { data : 'name' ,name:"name",orderable:true},
        { data : 'email' ,name:"email",orderable:true},
        { data : 'phone_number' ,name:"phone_number",orderable:true,render:function(data,type,row,meta){
            return '<a href="tel:'+row.phone_number+'">'+row.phone_number+'</a>';
        }
    },
    {
        data:'created_at',name:'created_at',orderable:true,searchable:true,render:function(data,type,row,meta){
            var date = row.created_at;
            var momentDate = moment(date).format('MMMM D YYYY h:mm:ss a')
            return momentDate;
        }
    },
    {
        targets: 1,
        data: "id",
        render: function (data, type, row, meta) {
            return (
                "<a href='javascript:void(0)' class='view btn btn-sm btn-success' data-id='" +
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

$(document).on('click','.view',function(){
    var id = $(this).data('id');
    
    $.ajax({
        type: "get",
        url: "/admin/contacts/"+id,
        success: function (response) {
            
            if(response.status == true){
                $("#description").text(response.data);
                $("#add_edit_modal").modal('show');
            }else{
                toastr.error(response.error,"Error!");
            }
        }
    });
});

$(document).on('click','.refresh',function(){
    $('.data-table').DataTable().ajax.reload();
});
