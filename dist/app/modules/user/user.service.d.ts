import { Prisma } from "@prisma/client";
declare const createUser: (payload: Prisma.UserCreateInput) => Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    status: import(".prisma/client").$Enums.Status;
    role: import(".prisma/client").$Enums.Role;
    profile: string | null;
    location: string | null;
    customerId: string | null;
    phoneNumber: string | null;
    expiredAt: Date | null;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
declare const userService: {
    createUser: typeof createUser;
};
export default userService;
//# sourceMappingURL=user.service.d.ts.map