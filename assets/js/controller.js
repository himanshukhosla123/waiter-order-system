app.controller("orderCtrl",function($scope){
    $scope.customMenuOpen=true;
    $scope.quantity=1;
    $scope.toggleCustomisationMenu=function(){
        $scope.customMenuOpen=!$scope.customMenuOpen;
    }
    $scope.CurrentCategory=[{item:"hii hiihii hiihii hii hii hii hii hii hiihii hii hii"},{item:"hii hiihii hiihii hii hii hii hii hii hiihii hii hiihii hiihii hiihii hii hii hii hii hii hiihii hii hii"},{item:"h4ii"},{item:"hii22"}];
    $scope.loadCategory=function(obj){
        console.log(obj);
    }
    $scope.incQuantity=function(){
        $scope.quantity++;
    }
    $scope.decQuantity=function(){
        $scope.quantity--;
    }
});