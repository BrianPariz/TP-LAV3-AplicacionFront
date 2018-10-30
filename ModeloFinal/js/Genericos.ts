namespace Final {
    export class Genericos {

        public static EnterPress(e, funcion) {

            let tecla;

            if (document.all)
                tecla = e.keyCode;
            else
                tecla = e.which;

            if (tecla == 13)
                funcion();
        }

        public static CambiarPantalla() {
            var index = window.location.pathname.indexOf("/index.html");
            window.location.href = index != -1 ? "./login.html" : "./index.html";
        }

        public static Time(funcion, id?) {
            $("#spin").modal("show");
            setTimeout(funcion, 1500, id);
        }

        public static Salir(){
            if(confirm("¿Seguro que desea cerrar sesión?")) {
                Genericos.Time(Genericos.CambiarPantalla);
                localStorage.clear();
            }

            $("#spin").modal("hide");
        }

        public static Perfil(){
            let perfil = JSON.parse(localStorage.getItem('login'));
            return perfil.type == "Admin" ? "A" : "U";
        }

        public static NuevoId(lista) {
            let maxId = 1;

            maxId += lista.length > 0 ? lista.
            map((item: Final.Videojuego) => item.getId())
            .reduce((idA, idB) => (idA > idB ? idA : idB)) : 0;

            return maxId;
        }
    }
}
