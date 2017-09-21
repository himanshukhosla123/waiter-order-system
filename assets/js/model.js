app.factory("orderFactory",function($q,$http){
    var obj={
     
     getCategoryItems:function(slug_name){
         var pr=$q.defer();
         $http({
            url:'http://35.154.144.146/api/category/'+slug_name,
        	method:"get"
         }).then(function(data){
             pr.resolve(data.data);
         },function(er){
             pr.reject(er);
         });
         return pr.promise;
     },
     
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
        	 url:'http://35.154.144.146/api/category/'
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