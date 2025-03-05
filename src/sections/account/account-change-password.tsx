import { z as zod } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useBoolean } from 'src/hooks/use-boolean';

import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Form, Field } from 'src/components/hook-form';
import { Typography } from '@mui/material';
import { changePasswordFromKeycloak } from 'src/auth/context/jwt/keycloak';
// ----------------------------------------------------------------------

export type ChangePassWordSchemaType = zod.infer<typeof ChangePassWordSchema>;

export const ChangePassWordSchema = zod
  .object({
    newPassword: zod
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres!' }),
    confirmNewPassword: zod
      .string()
      .min(6, { message: 'La contraseña debe tener al menos 6 caracteres!' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Las contraseñas no coinciden!',
    path: ['confirmNewPassword'],
  });

// ----------------------------------------------------------------------

export function AccountChangePassword() {
  const password = useBoolean();

  const defaultValues = { newPassword: '', confirmNewPassword: '' };

  const methods = useForm<ChangePassWordSchemaType>({
    mode: 'all',
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await changePasswordFromKeycloak(data.newPassword); // 🔹 Espera la respuesta

      if (response.success) {
        toast.success(response.message); // ✅ Mensaje de éxito
        reset();
        console.info('✅ Contraseña cambiada con éxito', data);
      } else {
        toast.error(response.message || 'Error al actualizar la contraseña'); // ❌ Mostrar error
      }
    } catch (error) {
      console.error('❌ Error al cambiar la contraseña del usuario:', error);
      toast.error('Error inesperado. Inténtalo de nuevo.');
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Card sx={{ p: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
        <Field.Text
          name="newPassword"
          label="Nueva contraseña"
          type={password.value ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Field.Text
          name="confirmNewPassword"
          type={password.value ? 'text' : 'password'}
          label="Confirmar Nueva contraseña"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!methods.formState.isValid}
          sx={{ ml: 'auto' }}
        >
          Guardar cambios
        </LoadingButton>
      </Card>
    </Form>
  );
}
