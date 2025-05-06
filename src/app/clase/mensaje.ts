import { UsuarioChat } from '../usuario-chat';

export class Mensaje {
    id?: string;
    created_at?: Date;
    mensaje?: string;
    usuarios?: UsuarioChat[];


}
