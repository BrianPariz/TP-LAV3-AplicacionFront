var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Final;
(function (Final) {
    var Videojuego = /** @class */ (function (_super) {
        __extends(Videojuego, _super);
        function Videojuego(id, juego, consola, compania, precio, disponible) {
            var _this = _super.call(this, id, precio, disponible) || this;
            _this.juego = juego;
            _this.consola = consola;
            _this.compania = compania;
            return _this;
        }
        Videojuego.prototype.getJuego = function () {
            return this.juego;
        };
        Videojuego.prototype.getCompania = function () {
            return this.compania;
        };
        Videojuego.prototype.getConsola = function () {
            return this.consola;
        };
        Videojuego.prototype.setJuego = function (juego) {
            this.juego = juego;
        };
        Videojuego.prototype.setCompania = function (compania) {
            this.compania = compania;
        };
        Videojuego.prototype.setConsola = function (consola) {
            this.consola = consola;
        };
        Videojuego.Parse = function (jsonVideojuegos) {
            var videojuegos = new Array();
            var auxJuego;
            if (jsonVideojuegos != null) {
                for (var i = 0; i < jsonVideojuegos.length; i++) {
                    if (jsonVideojuegos[i]['id'] != undefined &&
                        jsonVideojuegos[i]['juego'] != undefined &&
                        jsonVideojuegos[i]['consola'] != undefined &&
                        jsonVideojuegos[i]['compania'] != undefined &&
                        jsonVideojuegos[i]['precio'] != undefined &&
                        jsonVideojuegos[i]['disponible'] != undefined) {
                        auxJuego = new Final.Videojuego(Number(jsonVideojuegos[i]['id']), jsonVideojuegos[i]['juego'], jsonVideojuegos[i]['consola'], jsonVideojuegos[i]['compania'], jsonVideojuegos[i]['precio'], Boolean(jsonVideojuegos[i]['disponible']));
                        videojuegos.push(auxJuego);
                    }
                }
            }
            return videojuegos;
        };
        return Videojuego;
    }(Final.Articulo));
    Final.Videojuego = Videojuego;
})(Final || (Final = {}));
