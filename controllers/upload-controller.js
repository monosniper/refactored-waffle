const ApiError = require("../exceptions/api-error");
const del = require('del');

class UploadController {
    async uploadFiles(req, res, next) {
        try {
            if(!req.files) {
                return next(ApiError.BadRequest('Нет файлов для загрузки'));
            } else {
                await del(`./uploads/${req.body.dir}`);

                let file = req.files.file;

                await file.mv(`./uploads/${req.body.dir}/${file.name}`);

                res.send({
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: file.name,
                        mimetype: file.mimetype,
                        size: file.size
                    }
                });
            }
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UploadController();