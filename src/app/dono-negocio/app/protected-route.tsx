import { FC, PropsWithChildren } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const ProtectedRoute: FC<PropsWithChildren<unknown>> = ({ children }) => {
  const rowData = cookies().get('@pontoja:app')?.value;

  if (!rowData) return redirect('/dono-negocio/entrar');

  const data = JSON.parse(rowData);

  if (!data?.state) return redirect('/dono-negocio/entrar');

  if (!data?.state?.user) return redirect('/dono-negocio/entrar');

  const { id, role } = data.state.user;

  if (!id || !role) redirect('/dono-negocio/entrar');

  return <>{children}</>;
};
