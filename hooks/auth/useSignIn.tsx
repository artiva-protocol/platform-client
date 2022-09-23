import useAxios, { UseAxiosType } from "hooks/axios/useAxios";

export type UserType = {
  address: string;
  publicKey: string;
  signature: string;
};

const useSignIn = ({
  data,
  onSettled,
}: {
  data: Partial<UserType>;
  onSettled?: () => void;
}): UseAxiosType<UserType> => {
  return useAxios<UserType>({
    url: process.env.NEXT_PUBLIC_SERVER_BASEURL + "/auth/login",
    data,
    onSettled,
  });
};

export default useSignIn;
