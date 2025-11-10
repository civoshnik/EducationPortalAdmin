export default interface lessonEntity {
    lessonId: string
    courseId: string
    name: string
    content: string
    videoURL: string
    createdAt: Date
    modifiedAt?: Date | undefined
}
