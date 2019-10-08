// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        document.querySelector(".board-add").addEventListener("click", dom.openNewBoardForm);
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
            boardClone.querySelector('.board-toggle').addEventListener('click', dom.toggleBoardContent);
            boardsContainer.appendChild(boardClone);
            this.loadCards(board.id);
        }
        this.addCardData();
        document.querySelector('#board-loading').remove();
    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            if (cards.length != 0) {
                dom.showCards(cards)
            }
        });
    },

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
    },

    addCardData: function () {
        let addCardBtns = document.querySelectorAll('.add-card');
        for (let button of addCardBtns) {
            button.addEventListener('click', dom.openNewCardForm);
        }
    },

    showNewCard: function (data) {
        const currentBoard = document.querySelector(`[data-board-id='${data.board_id}']`);
        let currentColumn = currentBoard.querySelector(`[data-status-title='new']`).querySelector(".board-column-content");
        const cardTemplate = document.querySelector('#card-template');
        const cardClone = document.importNode(cardTemplate.content, true);
        cardClone.querySelector('.card').dataset.cardStatusTitle = `new`;
        cardClone.querySelector('.card-title').textContent = data.title;
        currentColumn.appendChild(cardClone);
    }
    ,
    openNewBoardForm: function () {
        document.querySelector('.board-add').disabled = true;
        const boardForm = document.querySelector("#add-data-template");
        let boardFormClone = document.importNode(boardForm.content, true);
        const saveBtn = boardFormClone.querySelector(".save-btn");
        const cancelBtn = boardFormClone.querySelector(".cancel-btn");
        saveBtn.addEventListener('click', dom.saveNewBoard);
        cancelBtn.addEventListener('click', dom.closeNewBoardForm);
        document.querySelector("#add-board-container").appendChild(boardFormClone);
    }
    ,
    closeNewBoardForm: function () {
        this.closest('.add-input').remove();
        document.querySelector('.board-add').disabled = false;
    }
    ,
    saveNewBoard: function () {
        let title = this.previousElementSibling.value;
        if (title !== "") {
            dataHandler.createNewBoard(title, dom.appendNewBoard);
        }
        this.closest('.add-input').remove();
        document.querySelector('.board-add').disabled = false;
    }
    ,
    appendNewBoard: function (boardData) {
        let boardContainer = document.querySelector(".board-container");
        let boardTemplate = document.querySelector("#board-template");
        let boardClone = document.importNode(boardTemplate.content, true);
        let titleArea = boardClone.querySelector(".board-title");
        titleArea.textContent = boardData.title;
        boardClone.querySelector('.board').dataset.boardId = `${boardData.id}`;
        boardClone.querySelector('.add-card').addEventListener('click', dom.openNewCardForm);
        boardContainer.appendChild(boardClone);
        boardClone.querySelector('.board-toggle').addEventListener('click', dom.toggleBoardContent);
    }

    ,
    openNewCardForm: function () {
        this.disabled = true;
        const inputTemplate = document.querySelector('#add-data-template');
        const inputClone = document.importNode(inputTemplate.content, true);
        this.parentNode.appendChild(inputClone);

        let saveBtn = this.parentNode.querySelector('.save-btn');
        saveBtn.addEventListener('click', function () {
            if (this.parentNode.querySelector('.input-data').value !== "") {
                let cardTitle = this.parentNode.querySelector('.input-data').value;
                let boardId = this.closest('section.board').dataset.boardId;
                dataHandler.createNewCard(cardTitle, boardId, 0, function (data) {
                    dom.showNewCard(data);
                });
            }
            this.parentNode.parentNode.querySelector('.add-card').disabled = false;
            this.parentNode.querySelector('.input-data').remove();
            this.parentNode.remove();
        });

        let cancelBtn = this.parentNode.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function () {
            this.parentNode.parentNode.querySelector('.add-card').disabled = false;
            this.parentNode.remove();
        });
    }

    ,
    toggleBoardContent: function () {
        let boardContent = this.closest('.board-header').nextElementSibling;
        if (boardContent.classList.contains('hidden-board')) {
            boardContent.classList.remove('hidden-board');
            boardContent.classList.add('board-columns');
        } else {
            boardContent.classList.remove('board-columns');
            boardContent.classList.add('hidden-board');
        }

    }
    // here comes more features
};

