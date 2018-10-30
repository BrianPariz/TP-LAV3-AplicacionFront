namespace Final {
    export class Videojuego extends Articulo {
    
        private juego:string;
        private consola:string;
        private compania:string;

        public constructor(id?:number, juego?:string, consola?:string, compania?:string, precio?:string, disponible?:boolean) {
            super(id, precio, disponible);
            this.juego=juego;
            this.consola=consola;
            this.compania=compania;
        }

        public getJuego():string {
            return this.juego;
        }
    
        public getCompania() {
            return this.compania;
        }

        public getConsola():string {
            return this.consola;
        }

        public setJuego(juego:string) {
            this.juego=juego;
        }
    
        public setCompania(compania:string) {
            this.compania=compania;
        }

        public setConsola(consola:string) {
            this.consola=consola;
        }

        public static Parse(jsonVideojuegos):Array<Final.Videojuego> {
            let videojuegos = new Array<Final.Videojuego>();
            let auxJuego;

            if(jsonVideojuegos != null) {
                for (let i = 0; i < jsonVideojuegos.length; i++) {
                    if (jsonVideojuegos[i]['id'] != undefined &&
                    jsonVideojuegos[i]['juego'] != undefined &&
                    jsonVideojuegos[i]['consola'] != undefined &&
                    jsonVideojuegos[i]['compania'] != undefined &&
                    jsonVideojuegos[i]['precio'] != undefined &&
                    jsonVideojuegos[i]['disponible'] != undefined) {
                    auxJuego = new Final.Videojuego(Number(jsonVideojuegos[i]['id']),jsonVideojuegos[i]['juego'],jsonVideojuegos[i]['consola'],
                    jsonVideojuegos[i]['compania'],jsonVideojuegos[i]['precio'],Boolean(jsonVideojuegos[i]['disponible']));
                    videojuegos.push(auxJuego);
                    }
                }
            }

            return videojuegos;
        }
    }
}