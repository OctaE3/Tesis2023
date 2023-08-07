import * as Yup from 'yup';

const ValidacionReutilizable = (fields) => {
    const validationSchema = {};

    fields.forEach(field => {
        if (field.validation) {
            if (field.validation === 'text' || field.validation === 'select') {
                validationSchema[field.name] = Yup.string().required(`${field.label} es obligatorio`);
            }

            else if (field.validation === 'email') {
                validationSchema[field.name] = Yup.string().email('Ingrese un email válido').required(`${field.label} es obligatorio`);
            }

            else if (field.validation === 'phone') {
                validationSchema[field.name] = Yup.array()
                    .of(
                        Yup.string().matches(/^[0-9]+$/, { message: 'El teléfono solo debe contener dígitos numéricos', excludeEmptyString: true })
                            .min(9, 'El teléfono debe tener al menos 9 dígitos')
                            .max(9, 'El teléfono debe tener máximo 9 dígitos')
                    )
                    .min(1, `Debe ingresar al menos un ${field.label}`)
                    .required(`${field.label} es obligatorio`)
            }

            else if (field.validation === 'number') {
                validationSchema[field.name] = Yup.number().required(`${field.label} es obligatorio`);
            }

            else if (field.validation === 'decimal') {
                validationSchema[field.name] = Yup.string().transform((value, originalValue) => originalValue.replace(',', '.'))
                    .matches(/^\d+(\.\d)?$/, `${field.label} debe ser un número válido con hasta 1 decimal`)
                    .required(`${field.label} es obligatorio`);
            }
        }
    });
    return Yup.object().shape(validationSchema);
};

export default ValidacionReutilizable;