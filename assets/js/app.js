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
        if(x!=undefined){
        x=JSON.stringify(x);
        x=x.replace('{',"");
        x=x.replace('}',"");
        x=x.replace(']',"");
        x=x.replace('[',"");
        x=x.replace(/","/g,' , ');
        x=x.replace(/":"/g,' : ');
        x=x.replace(/"/g,"");}
        return x;
    };
});
$(document).ready(function(){
   $('#search').on('shown.bs.modal', function () {
    $('#search_b').focus();    
}); 
    function manageDim(){
    $(".cart_box , .categories").css("height",$(window).height()-53+"px");
    $(".item_box").css("height",$(window).height()-53+"px");
    $(".modal-dialog").css("width","800px");
     $(".modal-dialog").css("margin","10px auto");
//    $(".item_row .name").css("width",$(".items").width()-185+"px");
//    $(".item_box").css("width",$(".items").width()-216+"px");
//    $(".cart_header h4").css("width",$(".cart").width()-90+"px");
    }
    manageDim();
    $(window).on("resize",manageDim);
});


//comments , ui , search , 