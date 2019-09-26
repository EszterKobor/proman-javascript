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
            boardClone.querySelector('.board').dataset.boardId = `${board.id}`;
            boardsContainer.appendChild(boardClone);
            this.loadCards(board.id);
        }
        this.addCardData();
        document.querySelector('#board-loading').remove();
    }

    ,
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards)
        });
    }
    ,
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        const currentBoard = document.querySelector(`[data-board-id='${cards[0].board_id}']`);
        for (let card of cards) {
            let currentColumn = currentBoard.querySelector(`[data-status-title='${card.status_id}']`).querySelector(".board-column-content");
            const cardTemplate = document.querySelector('#card-template');
            const cardClone = document.importNode(cardTemplate.content, true);
            cardClone.querySelector('.card').dataset.cardStatusTitle = `${card.status_id}`;
            cardClone.querySelector('.card-title').textContent = `${card.title}`;
            currentColumn.appendChild(cardClone);
        }
    }
    ,
    addCardData: function () {
        let addCardBtns = document.querySelectorAll('.add-card');
        for (let button of addCardBtns) {
            button.addEventListener('click', function () {
                const inputTemplate = document.querySelector('#add-data-template');
                const inputClone = document.importNode(inputTemplate.content, true);
                this.parentNode.appendChild(inputClone);

                let saveBtn = this.parentNode.querySelector('.save-btn');
                saveBtn.addEventListener('click', function () {
                    let cardTitle = this.parentNode.querySelector('.input-data').value;
                    let boardId = this.parentNode.parentNode.parentNode.dataset.boardId;

                    dataHandler.createNewCard(cardTitle, boardId, 0, function (data) {
                        dom.showNewCard(data)
                    });
                    this.parentNode.remove();


                });

                let cancelBtn = this.parentNode.querySelector('.cancel-btn');
                cancelBtn.addEventListener('click', function () {
                    this.parentNode.remove();

                })

            });
        }
    }
    ,
    showNewCard: function (data) {
        const currentBoard = document.querySelector(`[data-board-id='${data.boardId}']`);
        let currentColumn = currentBoard.querySelector(`[data-status-title='new']`).querySelector(".board-column-content");
        const cardTemplate = document.querySelector('#card-template');
        const cardClone = document.importNode(cardTemplate.content, true);
        cardClone.querySelector('.card').dataset.cardStatusTitle = `new`;
        cardClone.querySelector('.card-title').textContent = data.cardTitle;
        currentColumn.appendChild(cardClone);
    }
};

