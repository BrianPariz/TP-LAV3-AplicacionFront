var Final;
(function (Final) {
    var Login = /** @class */ (function () {
        function Login() {
        }
        Login.UserJson = function (type, pass) {
            var user = $("#inputUser").val();
            var json;
            if (pass) {
                var password = $("#inputPassword").val();
                json = { type: type, user: user, password: password };
            }
            else {
                json = { type: type, user: user };
            }
            return json;
        };
        Login.IngresarDatos = function () {
            var objetJson = Login.UserJson("", true);
            Login.InicioCarga();
            $.ajax({
                url: "http://localhost:3000/login",
                data: objetJson,
                type: "POST",
                success: Login.ValidarUsuario,
                error: function (result) {
                    alert("Error:" + result);
                }
            });
        };
        Login.ValidarUsuario = function (respuesta) {
            if (respuesta.type == "User" || respuesta.type == "Admin") {
                var objetJson = Login.UserJson(respuesta.type, false);
                localStorage.setItem("login", JSON.stringify(objetJson));
                Login.TraerVideojuegos();
                Final.Genericos.CambiarPantalla();
            }
            else {
                Login.UserError();
                Login.FinCarga();
            }
        };
        Login.TraerVideojuegos = function () {
            $.ajax({
                url: "http://localhost:3000/videojuegos",
                success: function (result) {
                    localStorage.setItem("videojuegos", JSON.stringify(result));
                },
                error: function (result) {
                    alert("Error:" + result);
                }
            });
        };
        Login.UserError = function () {
            $("#inputUser").addClass("is-invalid");
            $("#inputPassword").addClass("is-invalid");
            $("#error").slideDown("slow");
        };
        Login.InicioCarga = function () {
            $(".divLoad").show();
            $("#inputUser").prop('disabled', true);
            $("#inputPassword").prop('disabled', true);
            $("#btnIngresar").prop('disabled', true);
        };
        Login.FinCarga = function () {
            $(".divLoad").hide();
            $("#inputUser").prop('disabled', false);
            $("#inputPassword").prop('disabled', false);
            $("#btnIngresar").prop('disabled', false);
        };
        return Login;
    }());
    Final.Login = Login;
})(Final || (Final = {}));
