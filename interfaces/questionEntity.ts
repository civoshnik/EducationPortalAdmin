export default interface questionEntity {
    questionId: string
    testId: string
    text: string
    type: string
    createdAt: Date
    modifiedAt?: Date | undefined
}
