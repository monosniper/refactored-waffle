const GameService = require('../services/game-service');

class GameController {
    async getGames(req, res, next) {
        try {
            const games = await GameService.getAllGames();

            return res.json(games);
        } catch (e) {
            next(e);
        }
    }

    async createGame(req, res, next) {
        try {
            const {name, slug, image} = req.body;

            const game = await GameService.createGame(name, slug, image);

            return res.json(game);
        } catch (e) {
            next(e);
        }
    }

    async deleteGame(req, res, next) {
        try {
            await GameService.deleteGame(req.params.slug);

            return res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new GameController();