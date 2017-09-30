app.controller("orderCtrl",function($scope,orderFactory){
    $scope.customMenuOpen=false;
    $scope.toggleCustomisationMenu=function(){
        $scope.customMenuOpen=!$scope.customMenuOpen;
    }
    
    $scope.CurrentCategory=[{
    title: "Mexican treasure",
        customization:{patty:["Grilled Chicken","Fried Chickem","veggie","Paneer","Lamb"],
                        topping:["onino","grilles onion","bell peppers","tomatoes","lettuice","jalapeno","cucumber"],
                        sauce:["peri-peri maya","mint mayo","BBQ","pesto maya","garlic mayo"],
                        side:["potato wedges","fries","masala fries","house salad"]}
}];
    
    
    $scope.CurrentCategory=[];
    
    $scope.loadCategory=function(id){
        $scope.activeCategoryId=id;
        $(".nav li a.active").removeClass("active");
        $($(".nav li a")[id-1]).addClass("active");
        $scope.CurrentCategory=$scope.categoryWiseMap[id];
   }
    
    
    $scope.incQuantity=function(index){
        if(arguments.length==0){
            $scope.currentItemCustomisation.quantity++;
        }
        else
        $scope.CurrentCategory[index].quantity++;
    }
    
    $scope.decQuantity=function(index,id){
        if(arguments.length==0){
            $scope.currentItemCustomisation.quantity=$scope.currentItemCustomisation.quantity>0?--$scope.currentItemCustomisation.quantity:0;
        }
        else{
        $scope.CurrentCategory[index].quantity=($scope.CurrentCategory[index].quantity>0?--$scope.CurrentCategory[index].quantity:0);
        if($scope.CurrentCategory[index].quantity==0){
            $scope.cartList=$scope.cartList.filter(function(el){
                return el.title!=$scope.CurrentCategory[index].title;
            });
            document.getElementById(id).checked=false;
        }}
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
    
    $scope.cutomise=function(index){
        $scope.currentItemCustomisation=$scope.cartList[index];
        $scope.currentItemCustomisation.customization={
                       patty:["Grilled Chicken","Fried Chickem","veggie","Paneer","Lamb"],
                        topping:["onino","grilles onion","bell peppers","tomatoes","lettuice","jalapeno","cucumber"],
                        sauce:["peri-peri maya","mint mayo","BBQ","pesto maya","garlic mayo"],
                        side:["potato wedges","fries","masala fries","house salad"]
        };
        
        $scope.customMenuOpen=true;   
    }
    
    $scope.logout=function(){
        localStorage.clear();
        location.href=location.origin+'/index.html';
//       location.href='http://35.154.144.146';

    }
    
    $scope.currentItemCustomisation={};
    $scope.cartList=[];
    
    $scope.addToCart=function(id,index){
        $scope.customMenuOpen=false;        
        $scope.CurrentCategory[index].quantity=1;
        var checked=document.getElementById(id).checked;
        if(checked==false||checked==undefined){
        $scope.cartList.push($scope.CurrentCategory[index]);
        document.getElementById(id).checked=true;
        }
        else if(checked==true){
        $scope.cartList=$scope.cartList.filter(function(el){
            return el.title !==$scope.CurrentCategory[index].title;
        });
        document.getElementById(id).checked=false;
        }
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
    
    var AddOnList=function(){
        var promise=orderFactory.getVariations();
        promise.then(function(data){
            $scope.addOnsList=data;
        },function(){
            swal("Error","Couldn't Get Variations List","error");
        });
    };
    TableList();
    AddOnList();
    
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
            items:JSON.stringify($scope.cartList.slice()),
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
        },function(er){
            swal("Error","Coudn't get category List","error");
        });
    }
    
    
    $scope.categoryMapGenerator=function(){
        var promise=orderFactory.getAllProducts();
        $scope.categoryWiseMap={}; 
        promise.then(function(data){
            $scope.productList=data;
            console.log(data);
            for(var i=1;i<=$scope.categoriesLength;i++){
                $scope.categoryWiseMap[i]=(function(){ 
                    return data.filter(function(obj)
                    {{return i==obj.default}
                });
                })();
            }
            $("preloader").hide(50);
        $scope.loadCategory(1);
        },
        function(er){
            swal("Error","Could Not Get Products","error");
        }
    );
    }
    
});
