import { FC, PropsWithChildren } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { UserRole } from '@/enums/user-role';

export const ProtectedRoute: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const rowData = cookies().get('@pontoja:app.user')?.value;

  if (!rowData) return redirect('/cliente/entrar');

  const data = JSON.parse(rowData);

  if (!data?.state) return redirect('/cliente/entrar');

  if (!data?.state?.user) return redirect('/cliente/entrar');

  const { id, role } = data.state.user;

  if (!id || !role || role !== UserRole.PARTICIPANT) redirect('/cliente/entrar');

  return <>{children}</>;
};
