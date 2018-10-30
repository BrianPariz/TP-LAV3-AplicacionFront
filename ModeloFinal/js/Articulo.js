var Final;
(function (Final) {
    var Articulo = /** @class */ (function () {
        function Articulo(id, precio, disponible) {
            this.id = id;
            this.precio = precio;
            this.disponible = disponible;
        }
        Articulo.prototype.getId = function () {
            return this.id;
        };
        Articulo.prototype.getPrecio = function () {
            return this.precio;
        };
        Articulo.prototype.getDisponible = function () {
            return this.disponible;
        };
        Articulo.prototype.setId = function (id) {
            this.id = id;
        };
        Articulo.prototype.setPrecio = function (precio) {
            this.precio = precio;
        };
        Articulo.prototype.setDisponible = function (disponible) {
            this.disponible = disponible;
        };
        return Articulo;
    }());
    Final.Articulo = Articulo;
})(Final || (Final = {}));
