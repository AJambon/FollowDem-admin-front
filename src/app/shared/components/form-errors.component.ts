import { Component, Input, Host, SkipSelf } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-form-error',
  templateUrl: './form-errors.component.html'
})

export class FormErrorComponent {
  @Input() controlName: string;
  @Input() errorKey: string;

  constructor(
    @Host() @SkipSelf() private form: FormGroupDirective
  ) {
  }

  get isInvalid() {
    const control = this.form.form.get(this.controlName);
    return control.hasError(this.errorKey) && (control.dirty || this.form.submitted);
  }

  get error_msg() {
    if (this.controlName === 'login') {
      if (this.errorKey === 'login') {
        return 'Identifant incorrect';
      } else if (this.errorKey === 'required') {
        return '* Champs requis';
      }
    }
    if (this.controlName === 'password') {
      if (this.errorKey === 'password') {
        return 'Mot de passe incorrect';
      } else if (this.errorKey === 'required') {
        return '* Champs requis';
      }
    }
    if (this.controlName === 'device_type') {
      if (this.errorKey === 'type_already_exists') {
        return ' Ce type de dispositif existe déjà';
      } else if (this.errorKey === 'required') {
        return '* Champs requis';
      }
    }
    if (this.controlName === 'name') {
      if (this.errorKey === 'animal_already_exists') {
        return ' Cet animal existe déjà';
      } else if (this.errorKey === 'required') {
        return '* Champs requis';
      }
    }
    if (this.controlName === 'attribute') {
      if (this.errorKey === 'attirbute_already_exists') {
        return ' Cet attribut existe déjà';
      } else if (this.errorKey === 'required') {
        return '* Champs requis';
      }
    }
    if (this.controlName === 'ref_device') {
      if (this.errorKey === 'device_already_exists') {
        return ' Ce dispositif existe déjà';
      } else if (this.errorKey === 'required') {
        return '* Champs requis';
      }
    }

    if (this.controlName === 'order') {
      if (this.errorKey === 'order_already_exists') {
        return ' Cet ordre existe déjà';
      } else if (this.errorKey === 'required') {
        return '* Champs requis';
      }
    }
    if (this.controlName === 'birth_year') {
      if (this.errorKey === 'pattern') {
        return 'Invalide année';
      } else if (this.errorKey === 'required') {
        return '* Champs requis';
      }
    }
    
    return '* Champs requis';

  }
}