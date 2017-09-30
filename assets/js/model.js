const getHeaders=function(){
      return {
        'Authorization': 'Basic '+localStorage.getItem('token')
    };  
    }
app.factory("orderFactory",function($q,$http){
    var obj={
        
    categoryList:function(){
    	 var pr=$q.defer();
         $http({
        	 method:"get",
//        	 url:location.origin+'/api/categories/',
             url:'http://35.154.144.146/api/categories/',
             headers:getHeaders()
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
//        	 url:location.origin+'/api/products/',
             url:'http://35.154.144.146/api/products/',
             headers:getHeaders()
         }
         ).then(function(data){
             pr.resolve(data.data);
         },function(er){
             pr.reject(er);
         });
         return pr.promise;
    },placeOrder:function(obj){
        var pr=$q.defer();
         $http({
        	 method:"POST",
//        	 url:location.origin+'/api/orders/create',
             url:'http://35.154.144.146/api/orders/create',
             headers:getHeaders(),
             params:obj
         }
         ).then(function(data){
             pr.resolve(data.data);
             console.log(data);
         },function(er){
             pr.reject(er);
         });
         return pr.promise;
    },
    getAllTables:function(){
        var pr=$q.defer();
         $http({
        	 method:"get",
//        	 url:location.origin+'/api/tables/',
             url:'http://35.154.144.146/api/tables/',
             headers:getHeaders()
         }
         ).then(function(data){
             pr.resolve(data.data);
         },function(er){
             pr.reject(er);
         });
         return pr.promise;
    },
    getVariations:function(){
        var pr=$q.defer();
         $http({
        	 method:"get",
//        	 url:location.origin+'/api/variaiton-addons/',
             url:'http://35.154.144.146/api/variaiton-addons/',
             headers:getHeaders()
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