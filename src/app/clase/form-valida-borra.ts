import { FormGroup } from "@angular/forms";

export class FormValidaBorra {
    static getErrorMensaje(formulario: FormGroup | undefined, campo: string, tipo: string): string {
        const control = formulario?.get(campo);
        if (!control || !control.touched || !control.hasError(tipo)) return '';
    
    switch (tipo) {
        case 'required':
        return 'Este campo es requerido';
        case 'minlength':
        return `Debe tener al menos ${control.getError('minlength').requiredLength} caracteres`;
        case 'maxlength':
        return `Debe tener como máximo ${control.getError('maxlength').requiredLength} caracteres`;
        case 'min':
        return `Debe ser mayor o igual a ${control.getError('min').min}`;
        case 'max':
        return `Debe ser menor o igual a ${control.getError('max').max}`;
        default:
        return '';
    }
    }

    static borrarFormulario(formulario: FormGroup | undefined) {
    formulario?.reset();
    }
}

