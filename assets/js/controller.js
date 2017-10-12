app.controller("orderCtrl",function($scope,orderFactory){
    $scope.customMenuOpen=false;
    $scope.toggleCustomisationMenu=function(){
        $scope.customMenuOpen=!$scope.customMenuOpen;
    }
    $scope.CurrentCategory=[];
    
    $scope.loadCategory=function(id,navId){
        $scope.activeCategoryId=id;
        $(".nav li a.active").removeClass("active");
        $("#"+navId).addClass("active");
        $scope.CurrentCategory=$scope.categoryWiseMap[id];
   }

    $scope.search={title:""};
    
    $scope.incQuantity=function(obj){
        var objectInCartList=$scope.cartList.filter(function(elem){
            return elem.title==obj.title;
        }).length>0?true:false;
        if(!objectInCartList)
        {
        obj.quantity=1;
        $scope.cartList.unshift(obj);
        }
        else
        obj.quantity++;    
    }
    
    $scope.addWithVariation=function(obj){
        
    }
    
    
    $scope.decQuantity=function(obj,id){
        obj.quantity=(obj.quantity>0?--obj.quantity:0);
        if(obj.quantity==0){
            $scope.cartList=$scope.cartList.filter(function(el){
                return el.title!=obj.title;
            });
            if(document.getElementById(id)!=null)
            document.getElementById(id).checked=false;
        }
    }
    
    function getUserId(){ 
        var userid=localStorage.getItem('username')
                if(userid==undefined||userid==null)
                {
                    location.href=window.origin+"/";
                }
                else 
                return userid;
    };
    
    
    $scope.userid=getUserId();
    
    
    
    $scope.cutomise=function(obj){
        if(obj.quantity==undefined||obj.quantity==0)
        {obj.quantity=1;
        $scope.cartList.unshift(obj);
        }
        $scope.currentItemCustomisation=obj;
        $scope.customMenuOpen=true;   
    }
    
    $scope.logout=function(){
        localStorage.clear();
        location.href=location.origin+"/";
//       location.href='http://35.154.144.146';

    }
    
    $scope.calcVariationsPrice=function(obj){
        var sum=0;
        for(var i=0;i<obj.customization.length;i++){
         var current=obj.customization[i].options;
            if(current instanceof Array){
                for(var j=0;j<current.length;j++){
                    
                }
            }
        var ListObj=obj.customization_type.filter(function(obj){
            return false;
        });    
            
        }
    }
    
    
    $scope.currentItemCustomisation={};
    $scope.cartList=[];
    
    $scope.manageAdd=function(obj,id){
        if(obj.quantity==undefined||obj.quantity==0){
            $scope.addToCart(obj,id);
        }
        else{
            $scope.decQuantity(obj,id);
        }
    }
    
    
    $scope.addToCart=function(obj,id){
        obj.quantity=1;
        $scope.currentItemCustomisation=obj;
        var checked=document.getElementById(id).checked;
        if(checked==false||checked==undefined){
        $scope.cartList.unshift(obj);
        document.getElementById(id).checked=true;
        }
        
        else if(checked==true){
        $scope.cartList=$scope.cartList.filter(function(el){
            return el.title !==obj.title;
        });
        document.getElementById(id).checked=false;
        }
        $scope.customMenuOpen=false;
    }
    
    $scope.removeFromCart=function(index){
        $scope.cartList[index].quantity=0;
        $scope.cartList.splice(index,1);
    }
    
    
    var TableList=function(){
        var promise=orderFactory.getAllTables();
        promise.then(function(data){
            $scope.table_list= data;
        },function(){
            swal("Error","Couldn't Get Table List","error")
        });
    };
    TableList();
    
    function getTable(){
        var x=$(".table_btn:checked").val();
        if(x>0){
            return x;
        }
        else{
            swal("Select Table Number","Select a table to proceed for order","info");
            $("#selectedOrderTable").focus();
            return 0;
        }
    }
    
    
    function getCartItemsByKB(){
        
        var obj={
            "kitchen":$scope.cartList.filter(function(obj){
                return obj.default==27;
            }),
            "bar":$scope.cartList.filter(function(obj){
                return obj.default==28;
            })
        };
        return obj;
    }
    
    $scope.swapTable=function(){
        if($scope.old_table==undefined&&$scope.changed_table==undefined){
            swal("Select Tables","Please select Both Tables to Swap them.","info");
        }
        else{
        swal({
           title:'Table Swapped !',
            text:'Table Swapped From '+$scope.old_table+' To '+$scope.changed_table,
            type:"success"
        });
        }
    }
    
    
    
    $scope.placeOrder=function(){
        if(getTable()==0)
        {return 0;}
        console.log($scope.cartList);
        var obj={
            user:localStorage.getItem("userid").toString(),
            items_json:JSON.stringify(getCartItemsByKB()),
            table:getTable().toString(),
            comments:$scope.comments
        };
        console.log(obj);
        if($scope.cartList.length>0){
            var $btn = $(".order").button('loading');
         $.ajax({
                 url: location.origin+'/api/orders/create/',
//                 url: 'http://35.154.144.146/api/orders/create/',
                 method:'POST',
                 headers:{'Authorization': 'Basic '+localStorage.getItem('token')},
                 data:obj,
                 success:function(data){
                
                $btn.button('reset')         
                        swal({
                            title:"Order Placed",
                            text:"Reset Current Order",
                            confirmButtonText:"RESET ?",
                            showConfirmButton:true
                        },function(isconfirm){
//                            location.reload();
                            reset();
                        });
                     
                    $("#myModal2").modal('hide');
                    $btn.button('reset');
                    },
                    error:function(){
                    $("#myModal2").modal('hide');    
                     $btn.button('reset');
                        swal("Error in Placing Order!", "Please try again", "error");
//                        reset();
                    }
            });                              
        }
        else{
            swal("Don't Fool Me","Add Something In Cart To Order","info");
        }
    }
    
    $scope.getCategoryList=function(){
        var promise=orderFactory.categoryList();
        promise.then(function(data){
            $("row.categories preloader").hide(50);
            data=data.filter(function(obj){
                return !(obj.title.toLowerCase()=="kitchen"||obj.title.toLowerCase()=="bar");
            });
            $scope.categoryList=data;
            $scope.firstCatid=data[0].id;
            $scope.categoriesLength=data.length;
            $scope.categoryMapGenerator();
        },function(er){
            swal("Error","Coudn't get category List","error");
        });
    }
    
    
    function reset(){
        $scope.currentItemCustomisation={};
        $scope.cartList=[];
        $scope.search={title:""};
       $scope.CurrentCategory=[];
        $("preloader").show();
        TableList();
        $scope.getCategoryList();
        $scope.userid=getUserId();
    }
    
    
    $scope.categoryMapGenerator=function(){
        var promise=orderFactory.getAllProducts();
        $scope.categoryWiseMap={}; 
        var objectsWithMultipleCat=[];
        promise.then(function(data){
            $scope.productList=data;
//            console.log(data);
            for(var i=1;i<=50;i++){
                $scope.categoryWiseMap[i]=(function(){
                    {return data.filter(function(obj)
                    {   if(obj.category.length>1){
                        objectsWithMultipleCat.unshift(obj);
                        return false;
                        }
                     else
                        return i==obj.category[0];
                });
                }})();
            }
            for(var j=0;j<objectsWithMultipleCat.length;j++){
                var obj=objectsWithMultipleCat[j];
                for(var k=0;k<obj.category.length;k++){
                    var cat=obj.category[k];
                    $scope.categoryWiseMap[cat].unshift(obj);
                }
            }
            console.log($scope.categoryWiseMap);
            $("preloader").hide(50);
        $scope.loadCategory($scope.firstCatid,'0cat');
        },
        function(er){
            swal("Error","Could Not Get Products","error");
        }
    );
    }
    
});
