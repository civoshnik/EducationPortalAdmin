export default interface UserEntity {
    userId: string,
    firstName: string,
    lastName: string,
    login: string,
    email: string,
    role: number,
    phone: string,
    createdAt: Date,
    modifiedAt: Date | undefined
}