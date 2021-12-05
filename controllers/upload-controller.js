const ApiError = require("../exceptions/api-error");
const del = require('del');
const fs = require("fs");
const {toBoolean} = require("validator");

class UploadController {
    async uploadFiles(req, res, next) {
        try {
            if(!req.files) {
                return next(ApiError.BadRequest('Нет файлов для загрузки'));
            } else {
                toBoolean(req.body.del)  && await del(`./uploads/${req.body.dir}`);

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

    async getSongs(req, res, next) {
        try {
            return res.json(fs.readdirSync(`uploads/player`, {withFileTypes: true}).map(file => file.name));
        } catch (e) {
            next(e);
        }
    }

    async deleteSong(req, res, next) {
        try {
            const song = req.params.song;

            await fs.unlinkSync('./uploads/player/' + song);

            return res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UploadController();