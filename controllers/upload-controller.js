const ApiError = require("../exceptions/api-error");

class UploadController {
    async uploadFiles(req, res, next) {
        try {
            console.log(req.files, req.body);
            if(!req.files) {
                return next(ApiError.BadRequest('Нет файлов для загрузки'));
            } else {
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file

                let file = req.files.file;

                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                await file.mv(`./uploads/${req.body.dir}/${file.name}`);

                //send response
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