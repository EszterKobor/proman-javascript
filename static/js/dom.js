// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        // shows boards appending them to #boards div
        // it adds necessary event listeners also

        let boardsContainer = document.querySelector('.board-container');

        for (let board of boards) {
            const boardTemplate = document.querySelector('#board-template');
            const boardClone = document.importNode(boardTemplate.content, true);
            boardClone.querySelector('.board-title').textContent = `${board.title}`;
            boardClone.dataset.boardId = `${board.id}`;
            boardsContainer.appendChild(boardClone);
        }

        document.querySelector('#board-loading').remove();
    }

    ,
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(function (boardsId) {
            dom.showCards(cards);
        });
    }
    ,
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        const currentBoard = document.querySelector(`[data-board-id='${cards[0].board_id}']`);
        for (let card of cards) {
            let currentColumn = currentBoard.querySelector(`[data-status-id='${card.status_id}']`).querySelector("board-column-content");
            const cardTemplate = document.querySelector('#card-template');
            const cardClone = document.importNode(cardTemplate.content, true);
            cardClone.dataset.cardStatusId = "0";
            cardClone.querySelector('.card-title').textContent = `${card.title}`;
            currentColumn.appendChild(cardClone);
        }
    }
    ,
    // here comes more features
};
