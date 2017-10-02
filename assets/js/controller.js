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
    $scope.emptySearchCheck=function(){        
        return $scope.search.title.length>0?true:false;        
    }
    
    $scope.incQuantity=function(obj){
        var objectInCartList=$scope.cartList.filter(function(elem){
            return elem.title==obj.title;
        }).length>0?true:false;
        if(!objectInCartList)
        {obj.quantity=1;
        $scope.cartList.push(obj);
        }
        else
        obj.quantity++;
            
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
    
    $scope.userid=(function(){ 
        var userid=localStorage.getItem('userid')
                if(userid==undefined||userid==null)
                {
                    location.href=window.origin+"/index.html";
                }
                else 
                return userid;
    })();
    
    $scope.cutomise=function(obj){
        $scope.currentItemCustomisation=obj;
        $scope.customMenuOpen=true;   
    }
    
    $scope.logout=function(){
        localStorage.clear();
        location.href=location.origin+'/index.html';
//       location.href='http://35.154.144.146';

    }
    
    $scope.currentItemCustomisation={};
    $scope.cartList=[];
    
    $scope.addToCart=function(obj,id){
        obj.quantity=1;
        var checked=document.getElementById(id).checked;
        if(checked==false||checked==undefined){
        $scope.cartList.push(obj);
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
    
    $scope.makeMultiple=function(length,name){
        if(length>1)
        $("select[name="+name+"]").prop("multiple","multiple");
        else
        $("select[name="+name+"]").prop("multiple","");
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
        var x=document.getElementById("selectedOrderTable").value;
        if(x>0){return x;}
        else{
            swal("Select Table Number","Select a table to proceed for order","info");
            $("#selectedOrderTable").focus();
            return 0;
        }
    }
    $scope.placeOrder=function(){
        if(getTable()==0)
        {return 0;}
        
        var obj={
//            items:JSON.stringify($scope.cartList.slice()),
            items:$scope.cartList.slice(),
            table:getTable().toString() // string kr de saare
        };
        console.log(obj);
        if($scope.cartList.length>0){
            swal({
                title: "Place Order at Table "+getTable()+" ?",
                text: "Please Confirm before ordering",
                type: "info",
                showCancelButton:true,
                closeOnConfirm:false,
                showLoaderOnConfirm:true
                }, function(isconfirm){
                if(!isconfirm)
                    return ;
                else
                {
                    $.ajax({
                 url: 'http://35.154.144.146/api/orders/create',
                 method:'POST',
                 headers:{'Authorization': 'Basic '+localStorage.getItem('token')},
                 data:obj,
                 success:function(data){
                        swal({
                            title:"Order Placed",
                            text:"Reset Current Order",
                            confirmButtonText:"RESET ?",
                            showConfirmButton:true
                        },function(isconfirm){
                            location.reload();
                        });
                    },
                    error:function(){
                        swal("Error in Placing Order!", "Please try again", "error");
                    }
            });      
                } });               
        }
        else{
            swal("Don't Fool Me","Add Something In Cart To Order","info");
        }
    }
    
    $scope.getCategoryList=function(){
        var promise=orderFactory.categoryList();
        promise.then(function(data){
            $("row.categories preloader").hide(50);
            $scope.categoryList=data;
            $scope.categoriesLength=data.length;
            $scope.categoryMapGenerator();
            setTimeout(manageNavWidth,100);
        },function(er){
            swal("Error","Coudn't get category List","error");
        });
    }
    
    
    function manageNavWidth(){
        var sum=0;
        var list=$(".nav li");
        for(var i=0;i<list.length;i++){
            sum+=$(list[i]).width();
        }
        $(".row.nav-container").width(sum);
    }
    
    $scope.categoryMapGenerator=function(){
        var promise=orderFactory.getAllProducts();
        $scope.categoryWiseMap={}; 
        promise.then(function(data){
            $scope.productList=data;
//            console.log(data);
            for(var i=1;i<=$scope.categoriesLength;i++){
                $scope.categoryWiseMap[i]=(function(){ 
                    return data.filter(function(obj)
                    {{return i==obj.default}
                });
                })();
            }
            $("preloader").hide(50);
        $scope.loadCategory(1,'0cat');
        },
        function(er){
            swal("Error","Could Not Get Products","error");
        }
    );
    }
    
});
