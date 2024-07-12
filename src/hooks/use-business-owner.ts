import { useState } from 'react';
import { supabase } from '@/infra/database/supabase/client';
import cuid from 'cuid';
import { UserRole } from '@/enums/user-role';

type RegisterBusinessOwnerInput = {
  firstName: string;
  lastName: string;
  companyIdentificationNumber: string;
  phoneNumber: string;
};

type RegisterBusinessOwnerOutput = {
  code:
    | 'CREATED'
    | 'COMPANY_IDENTIFICATION_NUMBER_ALREADY_EXISTS'
    | 'PHONE_NUMBER_ALREADY_EXISTS'
    | 'UNEXPECTED_ERROR';
};

type AuthenticateBusinessOwnerAccountInput = {
  companyIdentificationNumber: string;
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
    hasActiveSubscription: boolean;
  } | null;
  code: 'SUCCESS' | 'INVALID_ID' | 'UNEXPECTED_ERROR';
};

type CheckSubscriptionOutput = {
  data: {
    hasActiveSubscription: boolean;
  } | null;
  code: 'SUCCESS' | 'UNEXPECTED_ERROR';
};

export const useBusinessOwner = () => {
  const [isLoadingRegister, setIsLoadingRegister] = useState(false);
  const [isLoadingAuthenticate, setIsLoadingAuthenticate] = useState(false);
  const [isLoadingGetById, setIsLoadingGetById] = useState(false);
  const [isLoadingCheckSubscription, setIsLoadingCheckSubscription] = useState(false);

  const register = async ({
    firstName,
    lastName,
    companyIdentificationNumber,
    phoneNumber,
  }: RegisterBusinessOwnerInput): Promise<RegisterBusinessOwnerOutput> => {
    try {
      setIsLoadingRegister(true);

      const { count: countByCompanyIdentificationNumber } = await supabase
        .from('business_owners')
        .select('*', { count: 'exact', head: true })
        .eq('company_identification_number', companyIdentificationNumber);

      const userExistsByCompanyIdentificationNumber =
        !!countByCompanyIdentificationNumber;

      if (userExistsByCompanyIdentificationNumber) {
        return {
          code: 'COMPANY_IDENTIFICATION_NUMBER_ALREADY_EXISTS',
        };
      }

      const { count: countByPhoneNumber } = await supabase
        .from('business_owners')
        .select('*', { count: 'exact', head: true })
        .eq('phone_number', phoneNumber);

      const userExistsByPhoneNumber = !!countByPhoneNumber;

      if (userExistsByPhoneNumber) {
        return {
          code: 'PHONE_NUMBER_ALREADY_EXISTS',
        };
      }

      const { data } = await supabase
        .from('business_owners')
        .insert({
          id: cuid(),
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          company_identification_number: companyIdentificationNumber,
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
    companyIdentificationNumber,
  }: AuthenticateBusinessOwnerAccountInput): Promise<AuthenticateBusinessOwnerAccountOutput> => {
    try {
      setIsLoadingAuthenticate(true);

      const { data } = await supabase
        .from('business_owners')
        .select('*')
        .eq('company_identification_number', companyIdentificationNumber);

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
          hasActiveSubscription: data[0].has_active_subscription,
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

  const checkSubscription = async (
    businessOwnerId: string,
  ): Promise<CheckSubscriptionOutput> => {
    try {
      setIsLoadingCheckSubscription(true);

      const { data } = await supabase
        .from('business_owners')
        .select('*')
        .eq('id', businessOwnerId);

      if (!data?.[0]) {
        return {
          data: null,
          code: 'UNEXPECTED_ERROR',
        };
      }

      return {
        data: {
          hasActiveSubscription: data[0].has_active_subscription,
        },
        code: 'SUCCESS',
      };
    } catch {
      return {
        data: null,
        code: 'UNEXPECTED_ERROR',
      };
    } finally {
      setIsLoadingCheckSubscription(false);
    }
  };

  return {
    isLoadingRegister,
    isLoadingAuthenticate,
    isLoadingGetById,
    isLoadingCheckSubscription,
    register,
    authenticate,
    getById,
    checkSubscription,
  };
};
