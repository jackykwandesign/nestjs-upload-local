
import { S3 } from "aws-sdk"
import * as multerS3 from "multer-s3"
import { RenameFile } from "src/filters"
const s3 = new S3({
    region : process.env.AWS_S3_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
})
const s3Storage = multerS3({
	s3: s3,
	bucket: process.env.AWS_S3_BUCKET,
	metadata: function (req, file, cb) {
		cb(null, { fieldName: file.fieldname })
	},
	key: RenameFile
})
interface S3MulterFile extends Omit<Express.Multer.File, "filename"> {
	bucket:string
	key:string
	acl:string
	contentDisposition:string
	contentEncoding:string
	storageClass:string
	serverSideEncryption:string
	location:string
	etag:string
	versionId:string
}
export { s3, s3Storage, S3MulterFile}

// sample output
// file {
// 	fieldname: 'file',
// 	originalname: 'apple.jpg',
// 	encoding: '7bit',
// 	mimetype: 'image/jpeg',
// 	size: 47970,
// 	bucket: 'fantasktic-upload-dev',
// 	key: '5d0a7d46-fe7e-4fe8-968b-bf6383a30ee1.jpg',
// 	acl: 'private',
// 	contentType: 'application/octet-stream',
// 	contentDisposition: null,
// 	contentEncoding: null,
// 	storageClass: 'STANDARD',
// 	serverSideEncryption: null,
// 	metadata: { fieldName: 'file' },
// 	location: 'https://fantasktic-upload-dev.s3.ap-southeast-1.amazonaws.com/5d0a7d46-fe7e-4fe8-968b-bf6383a30ee1.jpg',
// 	etag: '"541483fbbc4825113e3b0d5184473996"',
// 	versionId: undefined
//   }