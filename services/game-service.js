const GameModel = require("../models/game-model");

class GameService {
    async getAllGames() {
        const games = await GameModel.find().sort({'createdAt': -1});
        return games;
    }

    async createGame(name, slug, image) {
        const game = await GameModel.create({
            name, slug, image
        });

        return game;
    }

    async deleteGame(slug) {
        await GameModel.findOneAndDelete({slug});
    }
}

module.exports = new GameService()