app.controller("orderCtrl",function($scope,orderFactory){
    $scope.customMenuOpen=false;
    $scope.quantity=1;
    $scope.toggleCustomisationMenu=function(){
        $scope.customMenuOpen=!$scope.customMenuOpen;
    }
    
    $scope.CurrentCategory=[{
    item: "Mexican treasure",
        customization:{dip:["Chicken","Cheese","Paneer"],
                        size:["small","large"],
                        crust:["pan","thin"]}
}, {
    item: "Veggie Crunch",
    customization:{dip:["Veggie","dips2","dips3"],
                    size:["small","large"],
                        crust:["pan","thin"]}
}, {
    item: "Mango Jalepano",
    customization:{dip:["Lamb","dipa2","dipa3"],
                    size:["small","large"],
                        crust:["pan","thin"]}
}, {
    item: "Chilli paneer pizza",
    customization:{dip:["Paneer","dip2","dip3"],
                    size:["small","large"],
                        crust:["pan","thin","3rd one"]}
}];
    
    $scope.loadCategory=function(slug_name){
        $scope.activeCategory=slug_name;
        var promise=orderFactory.getCategoryItems($scope.activeCategory);;
        promise.then(function(data){
            $scope.CurrentCategory=data;
        },function(er){
            $scope.error=er;
        });
    }
    
    $scope.incQuantity=function(){
        $scope.quantity++;
    }
    $scope.decQuantity=function(){
        $scope.quantity--;
    }
    $scope.cutomise=function(index){
        $scope.currentItemCustomisation=$scope.CurrentCategory[index];
        $scope.customMenuOpen=true;   
    }
    
//    $scope.currentItemCustomisation=$scope.CurrentCategory[0];
    $scope.cartList=[{
    item: "Rasgulla",
        customization:{dip:["dip1","dip2","dip3"],
                        size:["small","large"],
                        pan:["pan1","pan3","pan2"]}
    }];
    
    $scope.addToCart=function(id,index,placeboolean){
        $scope.customMenuOpen=false;
        var checked=document.getElementById(id).checked;
        if(checked===placeboolean)
        $scope.cartList.push($scope.CurrentCategory[index]);
        else
        $scope.cartList=$scope.cartList.filter(function(el) {
            return el.item !==$scope.CurrentCategory[index].item ;
        });
    }
    $scope.removeFromCart=function(index){
        $scope.cartList.splice(index,1);
    }
    
    $scope.placeOrder=function(){
//        swal("Here's a message!");
        if(confirm("Place Order ?")==true)
        {
            setTimeout(()=>alert("Order Placed"),2000);
        }
    }
    
    $scope.getCategoryList=function(){
        var promise=orderFactory.categoryList();
        promise.then(function(data){
            $scope.categoryList=data;
        },function(er){
            $scope.error=er;
        });
    }
});