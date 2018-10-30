var express =require("express");
var cors = require("cors");
var corsOptions = {origin:"*",optionSucessStatus:200};
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(cors(corsOptions));

var videojuegos = [{"id":1,"disponible":true,"precio":"1010","juego":"The Elder Scrolls V: Skyrim","consola":"Switch","compania":"Bethesda"},
{"id":2,"disponible":false,"precio":"1129","juego":"Mario Tennis Aces","consola":"Switch","compania":"Nintendo"},
{"id":3,"disponible":true,"precio":"1268","juego":"God of War 4","consola":"PS4","compania":"Santa Monica Studio"},
{"id":4,"disponible":true,"precio":"785","juego":"Mario Kart 8 Deluxe","consola":"Switch","compania":"Nintendo"},
{"id":5,"disponible":false,"precio":"1324","juego":"Grand Theft Auto V","consola":"PS4","compania":"Rockstar Games"},
{"id":6,"disponible":true,"precio":"2962","juego":"The Legend of Zelda: Breath of the Wild","consola":"Switch","compania":"Nintendo"},
{"id":7,"disponible":true,"precio":"2803","juego":"Fifa 2018","consola":"Xbox","compania":"Electronic Arts"},
{"id":8,"disponible":true,"precio":"1324","juego":"Grand Theft Auto V","consola":"Xbox","compania":"Rockstar Games"},
{"id":9,"disponible":false,"precio":"1220","juego":"Crash Bandicoot Remastered Collection","consola":"PS4","compania":"Naughty Dog"},
{"id":10,"disponible":true,"precio":"1075","juego":"Marvel vs. Capcom: Infinite","consola":"PS4","compania":"Capcom"},
{"id":11,"disponible":false,"precio":"2958","juego":"Uncharted 4: A Thief's End","consola":"PS4","compania":"Naughty Dog"},
{"id":12,"disponible":false,"precio":"640","juego":"Crash Bandicoot Remastered Collection","consola":"Switch","compania":"Naughty Dog"},
{"id":13,"disponible":true,"precio":"2936","juego":"Fallout 4","consola":"PS4","compania":"Bethesda"},
{"id":14,"disponible":false,"precio":"2125","juego":"Assassin's Creed Odyssey","consola":"PS4","compania":"Ubisoft"},
{"id":15,"disponible":false,"precio":"867","juego":"The Elder Scrolls V: Skyrim","consola":"Xbox","compania":"Bethesda"},
{"id":16,"disponible":false,"precio":"1054","juego":"Fallout 4","consola":"Xbox","compania":"Bethesda"},
{"id":17,"disponible":true,"precio":"660","juego":"The Last of US","consola":"Switch","compania":"Naughty Dog"},
{"id":18,"disponible":false,"precio":"1053","juego":"Hyrule Warriors","consola":"Switch","compania":"Nintendo"},
{"id":19,"disponible":true,"precio":"2125","juego":"Assassin's Creed Odyssey","Xbox":"Switch","compania":"Ubisoft"},
{"id":20,"disponible":true,"precio":"616","juego":"Crash Bandicoot Remastered Collection","consola":"Xbox","compania":"Naughty Dog"}];

app.get("/videojuegos",function(req,res){
    
    res.send(videojuegos);
});
app.post("/login",function(req,res){
    setTimeout(function(){
        console.log("Llego al servidor "+JSON.stringify(req.body));
        
       
        if(req.body.user!=undefined && req.body.password!=undefined){
            if(req.body.user==="usuario"&&req.body.password==="1234"){
                console.log("Sale del servidor "+"{'type': 'User'}")
                res.send({'type': 'User'});    
            }else if(req.body.user==="admin"&&req.body.password==="1234"){
                console.log("Sale del servidor "+"{'type': 'Admin'}")
                res.send({'type': 'Admin'});    
            }else{
                console.log("Sale del servidor "+"{'type': 'error'}")
                res.send({'type': 'error'});
            }
            return;
        }
        console.log("Sale del servidor "+"{'type': 'error'}")
        res.send({'type': 'error'});
    },2000);
    
});

app.post("/nuevoJuego",function(req,res){
    setTimeout(function(){
        console.log("Llego al servidor"+JSON.stringify(req.body));
       
        if((req.body.id!= undefined&&req.body.id!= "") &&(req.body.juego!= undefined&&req.body.juego!= "") &&(req.body.consola!= undefined&&req.body.consola!= "") &&  (req.body.compania!= undefined&&req.body.compania!= "") && (req.body.precio!= undefined&&req.body.precio!= "") && (req.body.disponible!= undefined&&req.body.disponible!= "")){
            
			for(var i =0;i<videojuegos.length;i++){
				if(videojuegos[i].id == req.body.id){
					console.log("Sale del servidor "+"{'type': 'error','message':'Id repetido'}")
					res.send({'type': 'error','message':'Id repetido'});
					
					return;
				}
			}
			
			req.body.id = Number(req.body.id);
			req.body.disponible = Boolean(req.body.disponible);
			videojuegos.push(req.body);

			res.send({'type': 'ok'});
			console.log("Sale del servidor "+"{'type': 'ok'}")
			return;
        }
        console.log("Sale del servidor "+"{'respuesta': 'error'}")
        res.send({'respuesta': 'error'});
    },2000);
});

app.post("/editarJuego",function(req,res){
    setTimeout(function(){
        console.log("Llego al servidor "+JSON.stringify(req.body));
       
        if((req.body.id!= undefined&&req.body.id!= "") &&(req.body.juego!= undefined&&req.body.juego!= "") &&(req.body.consola!= undefined&&req.body.consola!= "") &&  (req.body.compania!= undefined&&req.body.compania!= "") && (req.body.precio!= undefined&&req.body.precio!= "") && (req.body.disponible!= undefined&&req.body.disponible!= "")){
            
			for(var i =0;i<videojuegos.length;i++){
				if(videojuegos[i].id == req.body.id){
					videojuegos[i].juego = req.body.juego;
					videojuegos[i].consola = req.body.consola;
					videojuegos[i].compania = req.body.compania;
					videojuegos[i].disponible = Boolean(req.body.disponible);
					videojuegos[i].precio = req.body.precio;
					res.send({'type': 'ok'});
					console.log("Sale del servidor "+"{'type': 'ok'}")
					return;
				}
			}
                res.send({'type': 'error','message':'No existe el juego que se quiere modificar'});
				console.log("Sale del servidor "+"{'type': 'error','message':'No existe el juego que se quiere modificar'}")
            return;
        }else{
			console.log("Sale del servidor "+"{'type': 'error','message':'Faltan datos'}")
			res.send({'type': 'error','message':'Faltan datos'});	
		}
        
    },2000);
    
});

app.post("/eliminarJuego",function(req,res){
    setTimeout(function(){
        console.log("Llego al servidor "+JSON.stringify(req.body));
       
        if(req.body.id!=undefined ){
           
			for(var i =0;i<videojuegos.length;i++){
				if(videojuegos[i].id == req.body.id){
					videojuegos.splice(i, 1);
					res.send({'type': 'ok'});
					console.log("Sale del servidor "+"{'type': 'ok'}")
					return;
					
				}
			}
                res.send({'type': 'error','message':'No existe el juego que se quiere eliminar'});
				console.log("Sale del servidor "+"{'type': 'error','message':'No existe el juego que se quiere eliminar'}")
            return;
        }else{
			console.log("Sale del servidor "+"{'type': 'error','message':'Faltan datos'}")
			res.send({'type': 'error','message':'Faltan datos'});	
		}
        
    },2000);
    
});

app.listen(3000,function(){
    console.log("Api en el puerto 3000");
});