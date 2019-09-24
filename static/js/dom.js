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
            boardsContainer.appendChild(boardClone);
        }

        document.querySelector('#board-loading').remove();
    }

    ,
        loadCards: function (boardId) {
            // retrieves cards and makes showCards called
        }
    ,
        showCards: function (cards) {
            // shows the cards of a board
            // it adds necessary event listeners also
        }
    ,
        // here comes more features
    };
