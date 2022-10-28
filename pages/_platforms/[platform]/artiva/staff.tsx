import AdminLayout from "@/admin/AdminLayout";
import ModalWrapper from "@/components/ModalWrapper";
import ProtocolSaveToast from "@/components/ProtocolSaveToast";
import { RoleEnum, RoleRequest } from "@/hooks/platform/useCreatePlatform";
import useSetManyRoles from "@/hooks/platform/useSetManyRoles";
import { GetPlatformUserResponse } from "@/services/platform-graph";
import { AddressView, AvatarView } from "@artiva/shared";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

const parseRole = (role: RoleEnum) => {
  switch (role) {
    case RoleEnum.PUBLISHER:
      return "PUBLISHER";
    case RoleEnum.MANAGER:
      return "MANAGER";
    case RoleEnum.ADMIN:
      return "ADMIN";
  }
};

const Staff = () => {
  const {
    query: { platform },
  } = useRouter();
  const { data } = useSWR(`/api/platform/${platform}/staff`);
  const [open, setOpen] = useState(false);
  const [newUsers, setNewUsers] = useState<RoleRequest[]>([]);
  const save = useSetManyRoles({ data: newUsers });

  const allUsers: GetPlatformUserResponse[] = data
    ? [
        ...data,
        ...newUsers.map((x) => ({
          user: x.account,
          role: parseRole(x.role),
        })),
      ]
    : [];

  return (
    <AdminLayout>
      <StaffModal
        open={open}
        setOpen={setOpen}
        setNewUser={(request) => {
          setNewUsers((x) => [...x, request]);
        }}
      />
      <div className="w-full">
        <div className="flex justify-between items-baseline relative py-6 px-10">
          <div className="flex items-baseline">
            <h1 className="text-3xl font-bold">Staff</h1>
          </div>
          <div className="flex relative">
            <button
              onClick={() => {
                setOpen(true);
              }}
              className="flex items-center justify-around w-32 h-8 rounded-md bg-gray-100 mr-2"
            >
              <div className="flex items-center">
                <span className="mr-2">Add Staff</span>
                <PlusIcon className="h-4" />
              </div>
            </button>

            <button
              onClick={() => {
                save.save();
              }}
              className="flex items-center justify-center rounded-md h-8 bg-black text-white w-32"
            >
              Save onchain
            </button>

            <div className="absolute top-10 right-0 z-10">
              <ProtocolSaveToast {...save} />
            </div>
          </div>
        </div>

        <div className="h-[78vh] overflow-y-auto">
          <div className="flex flex-col px-10">
            <h2 className="text-xs text-gray-500 font-semibold border-b mt-10 pb-4 w-full">
              PLATFORM USERS
            </h2>
            {allUsers?.map((x: any, idx: number) => (
              <StaffPlacard key={idx} account={x} />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

const StaffPlacard = ({ account }: { account: GetPlatformUserResponse }) => {
  const { user, role } = account;

  return (
    <div className="py-6 rounded-md flex items-center justify-between mb-1 border-b">
      <div className="flex items-center">
        <AvatarView address={user} className="h-6 rounded-full mr-2" />
        <AddressView address={user} className="" />
      </div>
      <div className="flex items-center">
        <div className="bg-gray-500 text-white rounded-full w-20 h-6 flex items-center justify-around text-xs mr-8">
          {role}
        </div>
      </div>
    </div>
  );
};

const StaffModal = ({
  open,
  setOpen,
  setNewUser,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  setNewUser: (request: RoleRequest) => void;
}) => {
  const [account, setAccount] = useState("");
  const [role, setRole] = useState(RoleEnum.PUBLISHER);

  const onAddUser = () => {
    setNewUser({ account, role });
    setAccount("");
    setRole(RoleEnum.PUBLISHER);
    setOpen(false);
  };

  return (
    <ModalWrapper open={open} setOpen={setOpen}>
      <div className="text-2xl font-semibold">Add a new staff user</div>
      <div className="text-sm text-gray-500 mt-2">
        Add a new staff account to your platform, and select a role that matches
        what you’d like them to be able to do.
      </div>

      <div className="mt-8">User Address</div>
      <input
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        placeholder="0x23F91..."
        className="mt-1 bg-gray-100 rounded-md w-full px-4 p-2 focus:outline-none"
      />

      <RadioGroup value={role} onChange={setRole} className="mt-8">
        <RadioGroup.Option value={RoleEnum.PUBLISHER}>
          {({ checked }) => (
            <ModalRadioButton
              title="Publisher"
              description="Can add, manage and delete posts they've added to the platform."
              checked={checked}
            />
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={RoleEnum.MANAGER}>
          {({ checked }) => (
            <ModalRadioButton
              title="Manager"
              description="A trusted user that can change site settings, branding, and add posts to the platform"
              checked={checked}
            />
          )}
        </RadioGroup.Option>
        <RadioGroup.Option value={RoleEnum.ADMIN}>
          {({ checked }) => (
            <ModalRadioButton
              title="Admin"
              description="A very trusted user that can manage users, change all settings and add posts to the platform"
              checked={checked}
            />
          )}
        </RadioGroup.Option>
      </RadioGroup>

      <div className="mt-8 flex items-center justify-end">
        <button
          onClick={onAddUser}
          className="bg-black text-white h-8 w-32 rounded-md"
        >
          Add user
        </button>
      </div>
    </ModalWrapper>
  );
};

export const ModalRadioButton = ({
  checked,
  title,
  description,
}: {
  checked: boolean;
  title: string;
  description: string;
}) => {
  return (
    <div className="w-full flex items-center cursor-pointer p-2 pb-4 border-b">
      {checked ? (
        <div className="bg-black h-6 w-6 rounded-full flex items-center justify-around">
          <CheckIcon className="text-white h-4" />
        </div>
      ) : (
        <div className="border border-black h-6 w-6 rounded-full flex items-center justify-around" />
      )}

      <div className="w-full pl-4">
        <div>{title}</div>
        <div className="text-sm text-gray-400">{description}</div>
      </div>
    </div>
  );
};

export default Staff;
