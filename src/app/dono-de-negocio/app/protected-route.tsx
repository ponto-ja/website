import { FC, PropsWithChildren } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserRole } from '@/enums/user-role';

export const ProtectedRoute: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const rowData = cookies().get('@pontoja:app.user')?.value;

  if (!rowData) return redirect('/dono-de-negocio/entrar');

  const data = JSON.parse(rowData);

  if (!data?.state) return redirect('/dono-de-negocio/entrar');

  if (!data?.state?.user) return redirect('/dono-de-negocio/entrar');

  const { id, role } = data.state.user;

  if (!id || !role || role !== UserRole.BUSINESS_OWNER)
    redirect('/dono-de-negocio/entrar');

  return <>{children}</>;
};
