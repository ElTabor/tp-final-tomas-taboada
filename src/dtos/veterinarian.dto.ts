export interface CreateVeterinarianDTO {
    fullName: string;
    licenseNumber: string;
    specialty: string;
}

export interface UpdateVeterinarianDTO {
    fullName?: string;
    licenseNumber?: string;
    specialty?: string;
}
