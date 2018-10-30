namespace Final {
    export class Login {

        public static UserJson(type, pass) {
            let user = $("#inputUser").val();
            let json;

            if(pass) {
                let password = $("#inputPassword").val();
                json = { type: type, user: user, password: password};
            }
            else {
                json = { type: type, user: user};
            }

            return json;
        }

        public static IngresarDatos() {
            let objetJson  = Login.UserJson("", true);
            Login.InicioCarga();

            $.ajax({
                url:"http://localhost:3000/login",
                data: objetJson,
                type: "POST",
                success: Login.ValidarUsuario,
                error: function(result) {
                    alert("Error:" + result);
                }
            });
        }

        public static ValidarUsuario(respuesta) {
            if (respuesta.type == "User" || respuesta.type == "Admin") {
                let objetJson = Login.UserJson(respuesta.type, false);
                localStorage.setItem("login", JSON.stringify(objetJson));
                Login.TraerVideojuegos();
                Genericos.CambiarPantalla();
            }
            else {
                Login.UserError();
                Login.FinCarga();
            }
        }

        public static TraerVideojuegos(){

            $.ajax ({ 
                url:"http://localhost:3000/videojuegos",
                success: function(result) {
                    localStorage.setItem("videojuegos", JSON.stringify(result));
                },
                error: function(result) {
                    alert("Error:" + result);
                }
            });
        }

        public static UserError() {
            $("#inputUser").addClass("is-invalid");
            $("#inputPassword").addClass("is-invalid");
            $("#error").slideDown("slow");
        }

        public static InicioCarga() {
            $(".divLoad").show();
            $("#inputUser").prop('disabled', true);
            $("#inputPassword").prop('disabled', true);
            $("#btnIngresar").prop('disabled', true);            
        }

        public static FinCarga() {
            $(".divLoad").hide();
            $("#inputUser").prop('disabled', false);
            $("#inputPassword").prop('disabled', false);
            $("#btnIngresar").prop('disabled', false); 
        }
    }
}