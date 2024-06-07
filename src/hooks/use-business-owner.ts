import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';
import { Role } from '@/enums/role';

type RegisterBusinessOwnerInput = {
  firstName: string;
  lastName: string;
  email: string;
};

type RegisterBusinessOwnerOutput = {
  data: {
    id: string;
    email: string;
    role: keyof typeof Role;
  } | null;
  status: 201 | 409 | 500;
};

export const useBusinessOwner = () => {
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);

  const register = async ({
    firstName,
    lastName,
    email,
  }: RegisterBusinessOwnerInput): Promise<RegisterBusinessOwnerOutput> => {
    try {
      setIsLoadingRegister(true);

      const { count } = await supabase
        .from('business_owners')
        .select('*', { count: 'exact', head: true })
        .eq('email', email);

      const userExists = !!count;

      if (userExists) {
        return {
          data: null,
          status: 409,
        };
      }

      const { data } = await supabase
        .from('business_owners')
        .insert({ id: cuid(), first_name: firstName, last_name: lastName, email })
        .select();

      if (!data?.[0]) {
        return {
          data: null,
          status: 500,
        };
      }

      return {
        data: {
          id: data[0].id,
          role: 'BUSINESS_OWNER',
        },
        status: 201,
      };
    } catch (error) {
      return {
        data: null,
        status: 500,
      };
    } finally {
      setIsLoadingRegister(false);
    }
  };

  return {
    register,
    isLoadingRegister,
  };
};
