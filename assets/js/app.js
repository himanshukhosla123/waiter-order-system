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


$(document).ready(function(){
    $(".fullHeight").height($(window).height());
    
    $(".add_btn").click(function(){
        $(this).parents("label").click();
    });
});