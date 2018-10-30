namespace Final {
    export class Articulo {

        private id:number;
        private precio:string;
        private disponible:boolean;
    
        public constructor(id:number, precio:string, disponible:boolean) {
            this.id=id;
            this.precio=precio;
            this.disponible=disponible;
        }

        public getId():number {
            return this.id;
        }
        
        public getPrecio():string {
            return this.precio;
        }
        
        public getDisponible():boolean {
            return this.disponible;
        }

        public setId(id:number) {
            this.id=id;
        }
    
        public setPrecio(precio:string) {
            this.precio=precio;
        }
    
        public setDisponible(disponible:boolean) {
            this.disponible=disponible;
        }
    }
}
