import { FastifyRequest } from 'fastify';
import { Controller, Inject, POST } from 'fastify-decorators';
import multer from 'fastify-multer';
import {
  UploadBody,
  uploadBodyDTO,
  UploadQuery,
  uploadQueryDTO,
  uploadResponseDTO,
} from '../../dto/upload.dto';
import { ERR_BAD_REQUEST } from '../../libs/constants/errors';
import { UploadService } from '../../services/upload.service';
import { verifyAccess } from '../hooks/onRequest/verifyAccess';

type UploadRequest = FastifyRequest<{
  Querystring: UploadQuery;
  Body: UploadBody;
}>;

const allowedFileTypeMap: { [key: string]: boolean } = {
  'image/heic': true,
  'image/jpeg': true,
  'image/jpg': true,
  'image/png': true,
  'video/mp4': true,
  'video/3gp': true,
  'application/octet-stream': true,
  'application/macbinary': true,
  'application/zip': true,
};

const upload = multer({
  // eslint-disable-next-line no-unused-vars
  fileFilter: (_, file, cb) => {
    if (!allowedFileTypeMap[file.mimetype]) {
      cb(ERR_BAD_REQUEST(`file type of ${file.mimetype} is not allowed`));
    }

    cb(null, true);
  },
});

@Controller({
  route: '/upload',
  type: 0,
  tags: [{ name: 'upload' }],
})
export class UploadController {
  @Inject(UploadService)
  private service!: UploadService;

  @POST({
    url: '/',
    options: {
      schema: {
        body: uploadBodyDTO,
        querystring: uploadQueryDTO,
        response: { 200: uploadResponseDTO },
      },
      preValidation: upload.single('file'),
      onRequest: verifyAccess,
    },
  })
  async upload(request: UploadRequest) {
    const filename = (request.body && request.body.filename) || request.file.originalname;
    const mimetype =
      request.query.folder === 'firmware-sensor'
        ? 'application/octet-stream'
        : request.file.mimetype;

    const url = await this.service.uploadToGcpCloudStorage(
      request.file.buffer as Buffer,
      request.query.folder,
      mimetype,
      filename,
    );

    return {
      code: 200,
      data: {
        url,
      },
    };
  }
}
