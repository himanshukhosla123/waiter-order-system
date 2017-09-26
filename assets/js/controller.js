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
    $scope.userid=localStorage.getItem('userid');
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
    
    $scope.placeOrder=function(){
        console.log($scope.cartList);
        if($scope.cartList.length>0){
        
            swal({
                title: "Place Order ?",
                text: "Please Confirm before ordering",
                type: "info",
                showCancelButton:true,
                closeOnConfirm:false,
                showLoaderOnConfirm:true
                }, function () {
                $.ajax({
//                    url:location.protocol+"//"+location.hostname+'/api/order/',
                    url: "http://35.154/order",
                    type: "POST",
                    dataType: 'json',
                    showLoaderOnConfirm: true,
                    data:{orders:$scope.cartList},
                    success: function () {
                        swal({
                            title:"Order Placed",
                            text:"Reset Current Order",
                            confirmButtonText: "RESET ?",
                            showConfirmButton:true
                        });
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        console.log(xhr);
                        swal("Error in Placing Order!", "Please try again", "error");
                    }});
                });
        }
        else{
            swal("Don't Fool Me","Add Something In Cart To Order","info");
        }
    }
    
    $scope.getCategoryList=function(){
        var promise=orderFactory.categoryList();
        promise.then(function(data){
            $("row.categories preloader").hide();
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
            $("preloader").hide();
        $scope.loadCategory(1);
        },
        function(er){
            swal("Error","Could Not Get Products","error");
        }
    );
    }
    
});
