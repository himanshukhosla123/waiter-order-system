const app=angular.module("order",[]);
app.directive("item",function(){
    return {
        
    };
});

app.directive("sum",function(){
	return {
		controller:"orderCtrl",
		link:function(scope,element,attrs){
			var total = parseInt(attrs.firstno)+ parseInt(attrs.secondno);
			element[0].innerHTML = "<h1>Sum of FirstNo "+attrs.firstno+" Second No "+attrs.secondno+" Sum is "+total+"</h1>";
		},
		restrict:"E"
	}
});

app.directive("preloader",function(){
             return{ template:"<div style='text-align:center;'><i class='fa fa-spin fa-spinner'></i></div>",
              restrict:"E"  
              }});

app.filter('formatChoice',function(){
    return function(x){
        x=JSON.stringify(x);
        x=x.replace('{',"");
        x=x.replace('}',"");
        x=x.replace(/","/g,' , ');
        x=x.replace(/":"/g,' : ');
        x=x.replace(/"/g,"");
        return x;
    };
});
$(document).ready(function(){
    $(".fullHeight").height($(window).height());
    
});