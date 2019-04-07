var myapp = angular.module('homepage',[]);
myapp.run(function ($http) {
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    $http.defaults.headers.post['dataType'] = 'json'
});


myapp.controller('homeController',function($scope,$http){
    var config = {
        headers : {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
    }

    $scope.sendDetails = function() {
        console.log(typeof(document.getElementById('lat').value));
        var lat = document.getElementById('lat').value;
        var long = document.getElementById('long').value;

        console.log(lat);
        if(lat == "" || isNaN(lat) || long ==""|| isNaN(long))
        {
            alert("Either latitude or longitude field is empty or entered wrong values");
            return ;
        }

        if(lat>90 || lat<-90 || long>180 || long<-180)
        {
            alert("values entered are not in the correct range");
            return
        }
        var lat_long=lat+","+long;
        var name, address, miles , values;
        $scope.row=[];
        console.log(typeof(lat));
        $http.get('https://rxsavings.herokuapp.com/getData?keywords='+lat_long).then(function(d)
            {
                console.log("entered");
                if(d.data.length === 0)
                {
                    alert("There no closest pharmacies less than 5 miles near to the location given by the user");
                    return;
                }

                table.style.visibility= "visible";
                var length = d.data.length;
                for (var i=0; i<length;i++)
                {
                    values=d.data[i];
                    name=values[0];
                    address=values[1];
                    miles =values[2];
                    $scope.row.push(name +"&&"+address+"^^"+miles);
                }

            },function(err)
            {
                console.log(err);
            }
        )
    };
});


