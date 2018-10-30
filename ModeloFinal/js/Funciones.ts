namespace Final {
    export class Funciones {

        public static Onload() {
            
            localStorage.setItem("idModificado", "-1");

            if(Genericos.Perfil() == "A") {
                $('#sidebar').toggleClass('active');
                $('#sidebar').show();
                
                $('#sidebarCollapse').on('click', function () {
                    $('#sidebar').toggleClass('active');
                    Funciones.CambiarIconoToggle();
                });
            }
            else {
                let compras = Funciones.TraerListaLS("compras");
                compras.length > 0 ? Funciones.CargarCompras(compras) : $("#bodyTablaCompra").append("<tr><td colspan='3' class='text-center'>El carrito está vacío</td></tr>");
                $("#strCant").text(" " + compras.length);
                $('#btnCompras').show();
                $('#aside').hide();
            }

            $('.flt').change(function(){
                Funciones.FiltrarJuegos(event);        
            });

            $( '.chk' ).on( 'click', function() {
                let videojuegos = Funciones.TraerListaLS("videojuegos");
                Funciones.CargarLista(videojuegos);
                Funciones.FiltrarJuegos(event); 
            });

            let videojuegos = Funciones.TraerListaLS("videojuegos");
            Funciones.CargarLista(videojuegos);
            $("#spin").modal("hide");
        }
        
        public static TraerListaLS(key):Array<Final.Videojuego> {
            return Videojuego.Parse(JSON.parse(localStorage.getItem(key)));
        }

        public static GuardarListaLS(videojuegos, key) {
            localStorage.setItem(key, JSON.stringify(videojuegos));
        }

        public static ObtenerCabeceras() {
            let cabeceras = [];
            $('#chkConsola').is(':checked') ? cabeceras.push("Consola") : null;
            $('#chkCompania').is(':checked') ? cabeceras.push("Compañía") : null;
            $('#chkPrecio').is(':checked') ? cabeceras.push("Precio") : null;
            $('#chkDisponible').is(':checked') ? cabeceras.push("Stock") : null;
            return cabeceras;
        }

        public static CargarCabeceras() {
            let cabeceras = Funciones.ObtenerCabeceras();
            let columnas = "<th>Juego</th>";

            cabeceras.forEach(function(elemento) {
                columnas += "<th>" + elemento + "</th>";
            });
            
            columnas += Genericos.Perfil() == "U" ? "<th>Comprar</th>" : "<th>Borrar</th>";

            $("#headTabla").append("<tr>" + columnas + "</tr>");
        }

        public static CargarLista(result) {
            $(".tablaVideoJuegos tbody tr").remove();
            $(".tablaVideoJuegos thead tr").remove();
            Funciones.CargarCabeceras();
            result.forEach(function(elemento) {
                Funciones.AppendVideojuego(elemento);
            });
        }

        public static AppendVideojuego(juego:Final.Videojuego) {
            let cabeceras = Funciones.ObtenerCabeceras();
            let columnas = "";
            let disponible = juego.getDisponible() ? "Disponible" : "No disponible";

            if(Genericos.Perfil() == "A") {
                columnas += "<td onclick='Final.Funciones.CargarEnABM("+juego.getId()+")'>" + juego.getJuego() + "</td>";
                cabeceras.forEach(function(elemento) {
                    columnas += "<td onclick='Final.Funciones.CargarEnABM("+juego.getId()+")'>";
                    if(elemento == "Consola") {
                        columnas += juego.getConsola();
                    }
                    else if(elemento == "Compañía") {
                        columnas += juego.getCompania();
                    }
                    else if(elemento == "Precio") {
                        columnas += "$" + juego.getPrecio();
                    }
                    else if(elemento == "Stock") {
                        columnas += disponible;
                    }
                    columnas += "</td>"
                });

                columnas += "<td class='text-center'><button type='button' class='btn btn-danger btn-rounded btn-sm' onclick= 'Final.Genericos.Time(Final.Funciones.Borrar" 
                + ", " + juego.getId() + ")'><i class='fa fa-trash'></i></button></td>";
            }
            else {
                columnas += "<td>" + juego.getJuego();

                cabeceras.forEach(function(elemento) {
                    if(elemento == "Consola") {
                        columnas += "</td><td>" + juego.getConsola();
                    }
                    else if(elemento == "Compañía") {
                        columnas += "</td><td>" + juego.getCompania();
                    }
                    else if(elemento == "Precio") {
                        columnas += "</td><td>$" + juego.getPrecio();
                    }
                    else if(elemento == "Stock") {
                        columnas += "</td><td>" + disponible;
                    }
                });
                
                if(juego.getDisponible()) {
                    columnas += "</td><td class='text-center'><button type='button' class='btn btn-primary btn-rounded btn-sm' onclick= 'Final.Funciones.AgregarCompra(" +
                    juego.getId() + ")'><i class='fa fa-cart-plus'></i></button></td>";
                }
                else {
                    columnas += "</td><td class='text-center'><i class='fa fa-ban' style='color:white;'></i></button></td>";
                }
            }

            $("#bodyTabla").append("<tr id='"+juego.getId()+"'>" + columnas + "</tr>");
        }

        public static Agregar() {
            if (Funciones.ValidarCampos() != false) {
                let videojuegos = Funciones.TraerListaLS("videojuegos");
                let auxJuego = Funciones.CrearObjeto(Genericos.NuevoId(videojuegos));

                videojuegos.push(auxJuego);
                Funciones.AppendVideojuego(auxJuego);
                Funciones.GuardarListaLS(videojuegos, "videojuegos");

                $.ajax ({ 
                    type: "POST",
                    url:"http://localhost:3000/nuevoJuego",
                    data: { 
                        id : auxJuego.getId(), disponible : auxJuego.getDisponible(), precio : auxJuego.getPrecio(),
                        juego : auxJuego.getJuego(), consola : auxJuego.getConsola(), compania : auxJuego.getCompania()
                    }
                });

                Funciones.ReestablecerTodo();
            }

            $("#spin").modal("hide");
        }

        public static Modificar() {
            if (Funciones.ValidarCampos() != false) {
                let videojuegos = Funciones.TraerListaLS("videojuegos");
                let idModif = Number(localStorage.getItem('idModificado'));
                let auxJuego = Funciones.CrearObjeto(idModif);

                $.ajax ({ 
                    type: "POST",
                    url:"http://localhost:3000/editarJuego",
                    data: { 
                        id : auxJuego.getId(), disponible : auxJuego.getDisponible(), precio : auxJuego.getPrecio(),
                        juego : auxJuego.getJuego(), consola : auxJuego.getConsola(), compania : auxJuego.getCompania()
                    }
                });
                
                let idTable = Funciones.IndexEnTabla(idModif)
                videojuegos.splice(idTable, 1, auxJuego);

                Funciones.CargarLista(videojuegos);
                Funciones.GuardarListaLS(videojuegos, "videojuegos");
                Funciones.ReestablecerTodo();
            }

            $("#spin").modal("hide");
        }

        public static CrearObjeto(id) {
            let juego = String($("#juego").val());
            let consola = String($("#consola").val());
            let compania = String($("#compania").val());
            let precio = String($("#precio").val());
            let disponible = $("#disponible").val() == "true" ? true : false;

           return new Final.Videojuego(id, juego, consola, compania, precio, disponible);
        }

        public static Borrar(id) {
            let idModif = localStorage.getItem('idModificado');

            if(idModif == id) {
                $("#spin").modal("hide");
                alert("No se puede borrar este videojuego mientras se está modificando.");
                return false;
            }
            
            let videojuegos = Funciones.TraerListaLS("videojuegos");
            let auxJuego = videojuegos.filter(e => e.getId() == id);
            $("#" + id).remove();
            let index = videojuegos.indexOf(auxJuego[0]);
            videojuegos.splice(index, 1);
            Funciones.GuardarListaLS(videojuegos, "videojuegos");

            $.ajax ({ 
                type: "POST",
                url:"http://localhost:3000/eliminarJuego",
                data: { "id" :  String(auxJuego[0].getId()) }
            });

            $("#spin").modal("hide");
        }

        public static CargarEnABM(id) {
            Funciones.ReestablecerTodo();
            let videojuegos = Funciones.TraerListaLS("videojuegos");
            let auxJuego = videojuegos.filter(e => e.getId() == id);
            $("#consola").val(auxJuego[0].getConsola());
            $("#juego").val(auxJuego[0].getJuego());
            $("#compania").val(auxJuego[0].getCompania());
            $("#precio").val(auxJuego[0].getPrecio());
            $("#disponible").val(String(auxJuego[0].getDisponible()));

            localStorage.setItem("idModificado", id);
            Funciones.CambiarIngresoModificacion();
        }

        public static ValidarCampos():any {
            let result = true;

            if($("#juego").val() == "" || $("#juego").val() == undefined) {
                $("#juego").addClass("is-invalid");
                $("#lblJuego").slideDown("slow");
                result = false;
            }
            if($("#consola").val() == "null") {
                $("#consola").addClass("is-invalid");
                $("#lblConsola").slideDown("slow");
                result = false;
            }
            if($("#compania").val() == "" || $("#compania").val() == undefined) {
                $("#compania").addClass("is-invalid");
                $("#lblCompania").slideDown("slow");
                result = false;
            }
            if($("#precio").val() == "" || $("#precio").val() == undefined || $("#precio").val() < 1) {
                $("#precio").addClass("is-invalid");
                $("#lblPrecio").slideDown("slow");
                result = false;
            }

            return result;
        }

        public static ReestablecerTodo() {
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
        }

        public static Info() {
            alert("BoostGame es una tienda dedicada a la compra de videojuegos de todas las consolas!\n\n© 2018 BOOSTGAME, INC. TODOS LOS DERECHOS RESERVADOS.");
        }
        
        public static CambiarIconoToggle() {
            if($('#icoTggl').hasClass('fa fa-toggle-right')) {
                $('#icoTggl').removeClass('fa-toggle-right');
                $('#icoTggl').addClass('fa-toggle-left');
            }
            else {
                $('#icoTggl').removeClass('fa-toggle-left');
                $('#icoTggl').addClass('fa-toggle-right');
            }
        }

        public static CambiarIngresoModificacion() {
            let idModif = localStorage.getItem('idModificado');
            if(idModif == "-1") {
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
                $("#btnCancelar").removeAttr( 'style' );
                $("#btnModificar").css("display", "block");
            }
        }

        public static IndexEnTabla(id) {
            let videojuegos = Funciones.TraerListaLS("videojuegos");
            let aux = videojuegos.filter(e => e.getId() === id);
            let auxJuego = aux[0];
            return videojuegos.indexOf(auxJuego);
        }

        public static FiltrarJuegos(event) {
            let juego = $("#busJuego").val().toString().trim().toLowerCase();
            let disponible = $("#fltDisponible").val();
            let auxDisponible;
            let consola = String($("#fltConsola").val());
            let videojuegos = Funciones.TraerListaLS("videojuegos");
            let boolJuego = juego != "" ? true : false;
            let boolConsola = consola != "null" ? true : false;
            let boolDisponible = disponible != "null" ? true : false;
            let auxVideojuegos;

            if(boolDisponible) {
                auxDisponible = disponible == "true" ? true : false;
            }
    
            if(boolJuego && boolConsola && boolDisponible) {
                auxVideojuegos = videojuegos.filter(e => e.getJuego().toString().toLowerCase().startsWith(juego) 
                && e.getDisponible() == auxDisponible && e.getConsola() == consola);
            }
            else if(boolJuego && boolConsola) {
                auxVideojuegos = videojuegos.filter(e => e.getJuego().toString().toLowerCase().startsWith(juego) 
                && e.getConsola() == consola);
            }
            else if(boolJuego && boolDisponible) {
                auxVideojuegos = videojuegos.filter(e => e.getJuego().toString().toLowerCase().startsWith(juego) 
                && e.getDisponible() == auxDisponible);
            }
            else if(boolDisponible && boolConsola) {
                auxVideojuegos = videojuegos.filter(e => e.getDisponible() == auxDisponible 
                && e.getConsola() == consola);
            }
            else if(boolJuego) {
                auxVideojuegos = videojuegos.filter(e => e.getJuego().toString().toLowerCase().startsWith(juego));
            }
            else if(boolConsola) {
                auxVideojuegos = videojuegos.filter(e => e.getConsola() == consola);
            }
            else if(boolDisponible) {
                auxVideojuegos = videojuegos.filter(e => e.getDisponible() == auxDisponible);
            }
            else {
                Funciones.CargarLista(videojuegos);
            }
    
            if(auxVideojuegos != undefined) {
                $(".tablaVideoJuegos tbody tr").remove();
                auxVideojuegos.forEach(function(elemento) {
                    Funciones.AppendVideojuego(elemento);
                });            
            }
        }

        public static CargarCompras(compras) {
            let total = 0;
            compras.forEach(function(elemento) {
                let columnas = "";
                columnas += "<td>" + elemento.getJuego() + "</td><td>$" + elemento.getPrecio() + "</td>" +
                "<td class='text-center'><button type='button' class='btn btn-danger btn-rounded btn-sm' onclick= 'Final.Funciones.BorrarCompra(" 
                + elemento.getId() + ")'><i class='fa fa-times-circle fa-lg'></i></button></td>";
                
                $("#bodyTablaCompra").append("<tr id='" + elemento.getId() + "C'>" + columnas + "</tr>");
                total += Number(elemento.getPrecio());
            });

            $("#total").text("$"+total);
        }

        public static AgregarCompra(id) {
            $(".tablaCompras tbody tr").remove();
            let videojuegos = Funciones.TraerListaLS("videojuegos");
            let auxJuego = videojuegos.filter(e => e.getId() == id);
            let compras = Funciones.TraerListaLS("compras");
            compras.push(auxJuego[0]);
            Funciones.CargarCompras(compras);
            Funciones.GuardarListaLS(compras, "compras");
            $("#strCant").text(" " + compras.length + "");
        }

        public static BorrarCompra(id) {
            let compras = Funciones.TraerListaLS("compras");
            let auxJuego = compras.filter(e => e.getId() == id);
            let total = 0;
            $("#" + id + "C").remove();
            let index = compras.indexOf(auxJuego[0]);
            compras.splice(index, 1);
            Funciones.GuardarListaLS(compras, "compras");

            compras.forEach(function(elemento) {
                total += Number(elemento.getPrecio());
            });
            $("#total").text("$"+total);
            
            compras.length < 1 ? $("#bodyTablaCompra").append("<tr><td colspan='3' class='text-center'>El carrito está vacío</td></tr>") : null;
            $("#strCant").text(" " + compras.length + "");
        }

        public static AjustarCol() {
            if($("#divIzq").hasClass("col-md-8")) {
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
        }
    }
}