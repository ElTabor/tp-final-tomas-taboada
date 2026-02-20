export interface CreateOwnerDTO {
    fullName: string;
    phone: string;
    address?: string;
}

export interface UpdateOwnerDTO {
    fullName?: string;
    phone?: string;
    address?: string;
}
