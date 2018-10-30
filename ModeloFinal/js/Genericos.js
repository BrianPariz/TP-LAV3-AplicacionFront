var Final;
(function (Final) {
    var Genericos = /** @class */ (function () {
        function Genericos() {
        }
        Genericos.EnterPress = function (e, funcion) {
            var tecla;
            if (document.all)
                tecla = e.keyCode;
            else
                tecla = e.which;
            if (tecla == 13)
                funcion();
        };
        Genericos.CambiarPantalla = function () {
            var index = window.location.pathname.indexOf("/index.html");
            window.location.href = index != -1 ? "./login.html" : "./index.html";
        };
        Genericos.Time = function (funcion, id) {
            $("#spin").modal("show");
            setTimeout(funcion, 1500, id);
        };
        Genericos.Salir = function () {
            if (confirm("¿Seguro que desea cerrar sesión?")) {
                Genericos.Time(Genericos.CambiarPantalla);
                localStorage.clear();
            }
            $("#spin").modal("hide");
        };
        Genericos.Perfil = function () {
            var perfil = JSON.parse(localStorage.getItem('login'));
            return perfil.type == "Admin" ? "A" : "U";
        };
        Genericos.NuevoId = function (lista) {
            var maxId = 1;
            maxId += lista.length > 0 ? lista.
                map(function (item) { return item.getId(); })
                .reduce(function (idA, idB) { return (idA > idB ? idA : idB); }) : 0;
            return maxId;
        };
        return Genericos;
    }());
    Final.Genericos = Genericos;
})(Final || (Final = {}));
