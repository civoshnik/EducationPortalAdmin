export default interface lessonEntity {
    lessonId: string
    courseId: string
    name: string
    content: string
    videoUrl: string
    createdAt: Date
    modifiedAt?: Date | undefined
}
