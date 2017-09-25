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
        console.log("Load "+id);
        $scope.CurrentCategory=$scope.categoryWiseMap[id];
   }
    
    
    $scope.incQuantity=function(index){
        $scope.CurrentCategory[index].quantity++;
    }
    
    $scope.decQuantity=function(index,id){
        $scope.CurrentCategory[index].quantity=($scope.CurrentCategory[index].quantity>0?--$scope.CurrentCategory[index].quantity:0);
        if($scope.CurrentCategory[index].quantity==0){
            $scope.cartList=$scope.cartList.filter(function(el){
                return el.title!=$scope.CurrentCategory[index].title;
            });
            console.log($scope.cartList)
            document.getElementById(id).checked=false;
        }
    }
    
    $scope.cutomise=function(index){
        $scope.currentItemCustomisation=$scope.CurrentCategory[index];
        $scope.customMenuOpen=true;   
    }
    
//    $scope.currentItemCustomisation=$scope.CurrentCategory[0];
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
        $scope.cartList.splice(index,1);
    }
    
    $scope.placeOrder=function(){
        if($scope.cartList.length>0){
        swal({
                title:"Place Order ?",
                type: "info",
                showCancelButton: true,
                closeOnConfirm: true
            }, function (isConfirm) {
                if (!isConfirm) return;
                $.ajax({
                    url: "http://35.154/h",
                    type: "POST",
                    dataType: 'json',
                    data:$scope.cartList,
                    success: function () {
                        swal({
                            title:"Order Placed",
                            showConfirmButton:true
                        });
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr);
                        swal("Error in Placing Order!", "Please try again", "error");
                    }
                });
            });
        }
        else{
            swal("Don't Fool Me","Add Something In Cart To Order","info");
        }
    }
    
    $scope.getCategoryList=function(){
        var promise=orderFactory.categoryList();
        promise.then(function(data){
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
            for(var i=1;i<=$scope.categoriesLength;i++){
                $scope.categoryWiseMap[i]=(function(){ 
                    return data.filter(function(obj)
                    {{return i==obj.default}
                });
                })();
            }
            console.log($scope.categoryWiseMap)
        $scope.loadCategory(1);
        },
        function(er){
            swal("Error","Could Not Get Products","error");
        }
    );
    }
    
});
