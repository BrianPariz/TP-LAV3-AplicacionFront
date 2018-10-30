var Final;
(function (Final) {
    var Funciones = /** @class */ (function () {
        function Funciones() {
        }
        Funciones.Onload = function () {
            localStorage.setItem("idModificado", "-1");
            if (Final.Genericos.Perfil() == "A") {
                $('#sidebar').toggleClass('active');
                $('#sidebar').show();
                $('#sidebarCollapse').on('click', function () {
                    $('#sidebar').toggleClass('active');
                    Funciones.CambiarIconoToggle();
                });
            }
            else {
                var compras = Funciones.TraerListaLS("compras");
                compras.length > 0 ? Funciones.CargarCompras(compras) : $("#bodyTablaCompra").append("<tr><td colspan='3' class='text-center'>El carrito está vacío</td></tr>");
                $("#strCant").text(" " + compras.length);
                $('#btnCompras').show();
                $('#aside').hide();
            }
            $('.flt').change(function () {
                Funciones.FiltrarJuegos(event);
            });
            $('.chk').on('click', function () {
                var videojuegos = Funciones.TraerListaLS("videojuegos");
                Funciones.CargarLista(videojuegos);
                Funciones.FiltrarJuegos(event);
            });
            var videojuegos = Funciones.TraerListaLS("videojuegos");
            Funciones.CargarLista(videojuegos);
            $("#spin").modal("hide");
        };
        Funciones.TraerListaLS = function (key) {
            return Final.Videojuego.Parse(JSON.parse(localStorage.getItem(key)));
        };
        Funciones.GuardarListaLS = function (videojuegos, key) {
            localStorage.setItem(key, JSON.stringify(videojuegos));
        };
        Funciones.ObtenerCabeceras = function () {
            var cabeceras = [];
            $('#chkConsola').is(':checked') ? cabeceras.push("Consola") : null;
            $('#chkCompania').is(':checked') ? cabeceras.push("Compañía") : null;
            $('#chkPrecio').is(':checked') ? cabeceras.push("Precio") : null;
            $('#chkDisponible').is(':checked') ? cabeceras.push("Stock") : null;
            return cabeceras;
        };
        Funciones.CargarCabeceras = function () {
            var cabeceras = Funciones.ObtenerCabeceras();
            var columnas = "<th>Juego</th>";
            cabeceras.forEach(function (elemento) {
                columnas += "<th>" + elemento + "</th>";
            });
            columnas += Final.Genericos.Perfil() == "U" ? "<th>Comprar</th>" : "<th>Borrar</th>";
            $("#headTabla").append("<tr>" + columnas + "</tr>");
        };
        Funciones.CargarLista = function (result) {
            $(".tablaVideoJuegos tbody tr").remove();
            $(".tablaVideoJuegos thead tr").remove();
            Funciones.CargarCabeceras();
            result.forEach(function (elemento) {
                Funciones.AppendVideojuego(elemento);
            });
        };
        Funciones.AppendVideojuego = function (juego) {
            var cabeceras = Funciones.ObtenerCabeceras();
            var columnas = "";
            var disponible = juego.getDisponible() ? "Disponible" : "No disponible";
            if (Final.Genericos.Perfil() == "A") {
                columnas += "<td onclick='Final.Funciones.CargarEnABM(" + juego.getId() + ")'>" + juego.getJuego() + "</td>";
                cabeceras.forEach(function (elemento) {
                    columnas += "<td onclick='Final.Funciones.CargarEnABM(" + juego.getId() + ")'>";
                    if (elemento == "Consola") {
                        columnas += juego.getConsola();
                    }
                    else if (elemento == "Compañía") {
                        columnas += juego.getCompania();
                    }
                    else if (elemento == "Precio") {
                        columnas += "$" + juego.getPrecio();
                    }
                    else if (elemento == "Stock") {
                        columnas += disponible;
                    }
                    columnas += "</td>";
                });
                columnas += "<td class='text-center'><button type='button' class='btn btn-danger btn-rounded btn-sm' onclick= 'Final.Genericos.Time(Final.Funciones.Borrar"
                    + ", " + juego.getId() + ")'><i class='fa fa-trash'></i></button></td>";
            }
            else {
                columnas += "<td>" + juego.getJuego();
                cabeceras.forEach(function (elemento) {
                    if (elemento == "Consola") {
                        columnas += "</td><td>" + juego.getConsola();
                    }
                    else if (elemento == "Compañía") {
                        columnas += "</td><td>" + juego.getCompania();
                    }
                    else if (elemento == "Precio") {
                        columnas += "</td><td>$" + juego.getPrecio();
                    }
                    else if (elemento == "Stock") {
                        columnas += "</td><td>" + disponible;
                    }
                });
                if (juego.getDisponible()) {
                    columnas += "</td><td class='text-center'><button type='button' class='btn btn-primary btn-rounded btn-sm' onclick= 'Final.Funciones.AgregarCompra(" +
                        juego.getId() + ")'><i class='fa fa-cart-plus'></i></button></td>";
                }
                else {
                    columnas += "</td><td class='text-center'><i class='fa fa-ban' style='color:white;'></i></button></td>";
                }
            }
            $("#bodyTabla").append("<tr id='" + juego.getId() + "'>" + columnas + "</tr>");
        };
        Funciones.Agregar = function () {
            if (Funciones.ValidarCampos() != false) {
                var videojuegos = Funciones.TraerListaLS("videojuegos");
                var auxJuego = Funciones.CrearObjeto(Final.Genericos.NuevoId(videojuegos));
                videojuegos.push(auxJuego);
                Funciones.AppendVideojuego(auxJuego);
                Funciones.GuardarListaLS(videojuegos, "videojuegos");
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/nuevoJuego",
                    data: {
                        id: auxJuego.getId(), disponible: auxJuego.getDisponible(), precio: auxJuego.getPrecio(),
                        juego: auxJuego.getJuego(), consola: auxJuego.getConsola(), compania: auxJuego.getCompania()
                    }
                });
                Funciones.ReestablecerTodo();
            }
            $("#spin").modal("hide");
        };
        Funciones.Modificar = function () {
            if (Funciones.ValidarCampos() != false) {
                var videojuegos = Funciones.TraerListaLS("videojuegos");
                var idModif = Number(localStorage.getItem('idModificado'));
                var auxJuego = Funciones.CrearObjeto(idModif);
                $.ajax({
                    type: "POST",
                    url: "http://localhost:3000/editarJuego",
                    data: {
                        id: auxJuego.getId(), disponible: auxJuego.getDisponible(), precio: auxJuego.getPrecio(),
                        juego: auxJuego.getJuego(), consola: auxJuego.getConsola(), compania: auxJuego.getCompania()
                    }
                });
                var idTable = Funciones.IndexEnTabla(idModif);
                videojuegos.splice(idTable, 1, auxJuego);
                Funciones.CargarLista(videojuegos);
                Funciones.GuardarListaLS(videojuegos, "videojuegos");
                Funciones.ReestablecerTodo();
            }
            $("#spin").modal("hide");
        };
        Funciones.CrearObjeto = function (id) {
            var juego = String($("#juego").val());
            var consola = String($("#consola").val());
            var compania = String($("#compania").val());
            var precio = String($("#precio").val());
            var disponible = $("#disponible").val() == "true" ? true : false;
            return new Final.Videojuego(id, juego, consola, compania, precio, disponible);
        };
        Funciones.Borrar = function (id) {
            var idModif = localStorage.getItem('idModificado');
            if (idModif == id) {
                $("#spin").modal("hide");
                alert("No se puede borrar este videojuego mientras se está modificando.");
                return false;
            }
            var videojuegos = Funciones.TraerListaLS("videojuegos");
            var auxJuego = videojuegos.filter(function (e) { return e.getId() == id; });
            $("#" + id).remove();
            var index = videojuegos.indexOf(auxJuego[0]);
            videojuegos.splice(index, 1);
            Funciones.GuardarListaLS(videojuegos, "videojuegos");
            $.ajax({
                type: "POST",
                url: "http://localhost:3000/eliminarJuego",
                data: { "id": String(auxJuego[0].getId()) }
            });
            $("#spin").modal("hide");
        };
        Funciones.CargarEnABM = function (id) {
            Funciones.ReestablecerTodo();
            var videojuegos = Funciones.TraerListaLS("videojuegos");
            var auxJuego = videojuegos.filter(function (e) { return e.getId() == id; });
            $("#consola").val(auxJuego[0].getConsola());
            $("#juego").val(auxJuego[0].getJuego());
            $("#compania").val(auxJuego[0].getCompania());
            $("#precio").val(auxJuego[0].getPrecio());
            $("#disponible").val(String(auxJuego[0].getDisponible()));
            localStorage.setItem("idModificado", id);
            Funciones.CambiarIngresoModificacion();
        };
        Funciones.ValidarCampos = function () {
            var result = true;
            if ($("#juego").val() == "" || $("#juego").val() == undefined) {
                $("#juego").addClass("is-invalid");
                $("#lblJuego").slideDown("slow");
                result = false;
            }
            if ($("#consola").val() == "null") {
                $("#consola").addClass("is-invalid");
                $("#lblConsola").slideDown("slow");
                result = false;
            }
            if ($("#compania").val() == "" || $("#compania").val() == undefined) {
                $("#compania").addClass("is-invalid");
                $("#lblCompania").slideDown("slow");
                result = false;
            }
            if ($("#precio").val() == "" || $("#precio").val() == undefined || $("#precio").val() < 1) {
                $("#precio").addClass("is-invalid");
                $("#lblPrecio").slideDown("slow");
                result = false;
            }
            return result;
        };
        Funciones.ReestablecerTodo = function () {
            localStorage.setItem("idModificado", "-1");
            Funciones.CambiarIngresoModificacion();
            $("#lblJuego").slideUp("fast");
            $("#lblConsola").slideUp("fast");
            $("#lblCompania").slideUp("fast");
            $("#lblPrecio").slideUp("fast");
            $("#lblEdad").slideUp("fast");
            $("#juego").removeClass("is-invalid");
            $("#consola").removeClass("is-invalid");
            $("#compania").removeClass("is-invalid");
            $("#precio").removeClass("is-invalid");
            $("#juego").val("");
            $("#consola").val("null");
            $("#compania").val("");
            $("#precio").val("");
            $("#disponible").val("true");
        };
        Funciones.Info = function () {
            alert("BoostGame es una tienda dedicada a la compra de videojuegos de todas las consolas!\n\n© 2018 BOOSTGAME, INC. TODOS LOS DERECHOS RESERVADOS.");
        };
        Funciones.CambiarIconoToggle = function () {
            if ($('#icoTggl').hasClass('fa fa-toggle-right')) {
                $('#icoTggl').removeClass('fa-toggle-right');
                $('#icoTggl').addClass('fa-toggle-left');
            }
            else {
                $('#icoTggl').removeClass('fa-toggle-left');
                $('#icoTggl').addClass('fa-toggle-right');
            }
        };
        Funciones.CambiarIngresoModificacion = function () {
            var idModif = localStorage.getItem('idModificado');
            if (idModif == "-1") {
                $(".lblIng").css("display", "block");
                $(".lblMod").css("display", "none");
                $("#btnAgregar").css("display", "block");
                $("#btnLimpiar").css("display", "block");
                $("#btnCancelar").css("display", "none");
                $("#btnModificar").css("display", "none");
            }
            else {
                $(".lblIng").css("display", "none");
                $(".lblMod").css("display", "block");
                $("#btnAgregar").css("display", "none");
                $("#btnLimpiar").css("display", "none");
                $("#btnCancelar").removeAttr('style');
                $("#btnModificar").css("display", "block");
            }
        };
        Funciones.IndexEnTabla = function (id) {
            var videojuegos = Funciones.TraerListaLS("videojuegos");
            var aux = videojuegos.filter(function (e) { return e.getId() === id; });
            var auxJuego = aux[0];
            return videojuegos.indexOf(auxJuego);
        };
        Funciones.FiltrarJuegos = function (event) {
            var juego = $("#busJuego").val().toString().trim().toLowerCase();
            var disponible = $("#fltDisponible").val();
            var auxDisponible;
            var consola = String($("#fltConsola").val());
            var videojuegos = Funciones.TraerListaLS("videojuegos");
            var boolJuego = juego != "" ? true : false;
            var boolConsola = consola != "null" ? true : false;
            var boolDisponible = disponible != "null" ? true : false;
            var auxVideojuegos;
            if (boolDisponible) {
                auxDisponible = disponible == "true" ? true : false;
            }
            if (boolJuego && boolConsola && boolDisponible) {
                auxVideojuegos = videojuegos.filter(function (e) { return e.getJuego().toString().toLowerCase().startsWith(juego)
                    && e.getDisponible() == auxDisponible && e.getConsola() == consola; });
            }
            else if (boolJuego && boolConsola) {
                auxVideojuegos = videojuegos.filter(function (e) { return e.getJuego().toString().toLowerCase().startsWith(juego)
                    && e.getConsola() == consola; });
            }
            else if (boolJuego && boolDisponible) {
                auxVideojuegos = videojuegos.filter(function (e) { return e.getJuego().toString().toLowerCase().startsWith(juego)
                    && e.getDisponible() == auxDisponible; });
            }
            else if (boolDisponible && boolConsola) {
                auxVideojuegos = videojuegos.filter(function (e) { return e.getDisponible() == auxDisponible
                    && e.getConsola() == consola; });
            }
            else if (boolJuego) {
                auxVideojuegos = videojuegos.filter(function (e) { return e.getJuego().toString().toLowerCase().startsWith(juego); });
            }
            else if (boolConsola) {
                auxVideojuegos = videojuegos.filter(function (e) { return e.getConsola() == consola; });
            }
            else if (boolDisponible) {
                auxVideojuegos = videojuegos.filter(function (e) { return e.getDisponible() == auxDisponible; });
            }
            else {
                Funciones.CargarLista(videojuegos);
            }
            if (auxVideojuegos != undefined) {
                $(".tablaVideoJuegos tbody tr").remove();
                auxVideojuegos.forEach(function (elemento) {
                    Funciones.AppendVideojuego(elemento);
                });
            }
        };
        Funciones.CargarCompras = function (compras) {
            var total = 0;
            compras.forEach(function (elemento) {
                var columnas = "";
                columnas += "<td>" + elemento.getJuego() + "</td><td>$" + elemento.getPrecio() + "</td>" +
                    "<td class='text-center'><button type='button' class='btn btn-danger btn-rounded btn-sm' onclick= 'Final.Funciones.BorrarCompra("
                    + elemento.getId() + ")'><i class='fa fa-times-circle fa-lg'></i></button></td>";
                $("#bodyTablaCompra").append("<tr id='" + elemento.getId() + "C'>" + columnas + "</tr>");
                total += Number(elemento.getPrecio());
            });
            $("#total").text("$" + total);
        };
        Funciones.AgregarCompra = function (id) {
            $(".tablaCompras tbody tr").remove();
            var videojuegos = Funciones.TraerListaLS("videojuegos");
            var auxJuego = videojuegos.filter(function (e) { return e.getId() == id; });
            var compras = Funciones.TraerListaLS("compras");
            compras.push(auxJuego[0]);
            Funciones.CargarCompras(compras);
            Funciones.GuardarListaLS(compras, "compras");
            $("#strCant").text(" " + compras.length + "");
        };
        Funciones.BorrarCompra = function (id) {
            var compras = Funciones.TraerListaLS("compras");
            var auxJuego = compras.filter(function (e) { return e.getId() == id; });
            var total = 0;
            $("#" + id + "C").remove();
            var index = compras.indexOf(auxJuego[0]);
            compras.splice(index, 1);
            Funciones.GuardarListaLS(compras, "compras");
            compras.forEach(function (elemento) {
                total += Number(elemento.getPrecio());
            });
            $("#total").text("$" + total);
            compras.length < 1 ? $("#bodyTablaCompra").append("<tr><td colspan='3' class='text-center'>El carrito está vacío</td></tr>") : null;
            $("#strCant").text(" " + compras.length + "");
        };
        Funciones.AjustarCol = function () {
            if ($("#divIzq").hasClass("col-md-8")) {
                $("#divIzq").removeClass("col-md-8");
                $("#divIzq").addClass("col-md-9");
                $("#divDer").removeClass("col-md-4");
                $("#divDer").addClass("col-md-3");
            }
            else {
                $("#divIzq").removeClass("col-md-9");
                $("#divIzq").addClass("col-md-8");
                $("#divDer").removeClass("col-md-3");
                $("#divDer").addClass("col-md-4");
            }
        };
        return Funciones;
    }());
    Final.Funciones = Funciones;
})(Final || (Final = {}));
