export class UploadSingleOutputDto{
    originalname:string
    mimetype:string
    filename:string
    size:number
    url:string
}

export class UploadSingleVideoOutputDto extends UploadSingleOutputDto{
    playerURL:string
}