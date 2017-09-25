app.factory("orderFactory",function($q,$http){
    var obj={
     
     orderList:function(orders){
    	 var pr=$q.defer();
         $http({
        	 method:"get",
        	 url:location.protocol+"//"+location.hostname+"/order",
        	 params:{ dto_obj:orders }              
         }
         ).then(function(data){
             pr.resolve(data.data);
         },function(er){
             pr.reject(er);
         });
         return pr.promise;
     },
    categoryList:function(){
    	 var pr=$q.defer();
         $http({
        	 method:"get",
//        	 url:location.protocol+"//"+location.hostname+'/api/category/',
             url:'http://35.154.144.146/api/category/'
         }
         ).then(function(data){
             pr.resolve(data.data);
         },function(er){
             pr.reject(er);
         });
         return pr.promise;
     },
     getAllProducts:function(){
        var pr=$q.defer();
         $http({
        	 method:"get",
//        	 url:location.protocol+"//"+location.hostname+'/api/product/',
             url:'http://35.154.144.146/api/product/'
         }
         ).then(function(data){
             pr.resolve(data.data);
         },function(er){
             pr.reject(er);
         });
         return pr.promise;
    }    
 };
    return obj;
});