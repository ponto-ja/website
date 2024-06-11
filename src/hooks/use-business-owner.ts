import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';
import { UserRole } from '@/enums/user-role';

type RegisterBusinessOwnerInput = {
  firstName: string;
  lastName: string;
  email: string;
};

type RegisterBusinessOwnerOutput = {
  code: 'CREATED' | 'EMAIL_ALREADY_EXISTS' | 'UNEXPECTED_ERROR';
};

type AuthenticateBusinessOwnerAccountInput = {
  email: string;
};

type AuthenticateBusinessOwnerAccountOutput = {
  data: {
    id: string;
    role: keyof typeof UserRole;
  } | null;
  code: 'SUCCESS' | 'INVALID_CREDENTIAL' | 'UNEXPECTED_ERROR';
};

type GetByIdOutput = {
  data: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  code: 'SUCCESS' | 'INVALID_ID' | 'UNEXPECTED_ERROR';
};

export const useBusinessOwner = () => {
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [isLoadingAuthenticate, setIsLoadingAuthenticate] = useState(false);
  const [isLoadingGetById, setIsLoadingGetById] = useState(false);

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
          code: 'EMAIL_ALREADY_EXISTS',
        };
      }

      const { data } = await supabase
        .from('business_owners')
        .insert({
          id: cuid(),
          first_name: firstName,
          last_name: lastName,
          email,
          has_active_subscription: true,
        })
        .select();

      if (!data?.[0]) {
        return {
          code: 'UNEXPECTED_ERROR',
        };
      }

      return {
        code: 'CREATED',
      };
    } catch (error) {
      return {
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingRegister(false);
    }
  };

  const authenticate = async ({
    email,
  }: AuthenticateBusinessOwnerAccountInput): Promise<AuthenticateBusinessOwnerAccountOutput> => {
    try {
      setIsLoadingAuthenticate(true);

      const { data } = await supabase
        .from('business_owners')
        .select('*')
        .eq('email', email);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'INVALID_CREDENTIAL',
        };
      }

      return {
        data: {
          id: data[0].id,
          role: 'BUSINESS_OWNER',
        },
        code: 'SUCCESS',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingAuthenticate(false);
    }
  };

  const getById = async (id: string): Promise<GetByIdOutput> => {
    try {
      setIsLoadingGetById(true);

      const { data } = await supabase.from('business_owners').select('*').eq('id', id);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'INVALID_ID',
        };
      }

      return {
        data: {
          id: data[0].id,
          firstName: data[0].first_name,
          lastName: data[0].last_name,
        },
        code: 'SUCCESS',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingGetById(false);
    }
  };

  return {
    isLoadingRegister,
    isLoadingAuthenticate,
    isLoadingGetById,
    register,
    authenticate,
    getById,
  };
};
