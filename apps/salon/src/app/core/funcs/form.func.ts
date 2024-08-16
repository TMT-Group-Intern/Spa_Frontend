import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";

const updateValidator = (
  condition: boolean,
  control: FormGroup,
  params: {
    field: string;
    validators: ValidatorFn | ValidatorFn[];
    state?: 'setValidators' | 'addValidators' | 'setErrors';
  }
) => {
    if (condition) {
      // condition true then set or add validator in form
      if (!params.state || params.state === 'setValidators') {
        control.controls[params.field].setValidators(params.validators);
      } else if (params.state === 'addValidators') {
        control.controls[params.field].addValidators(params.validators);
      } else if (params.state === 'setErrors') {
        control.controls[params.field].setErrors(params.validators);
      }
    } else {
      control.get(params.field)?.clearValidators();
      control.get(params.field)?.updateValueAndValidity();
    }
  }

export {updateValidator}
