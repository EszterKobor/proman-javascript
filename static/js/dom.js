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
            boardsContainer.appendChild(boardClone);
            this.loadCards(board.id);
        }
        this.addCardData();
        document.querySelector('#board-loading').remove();
    },

    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            dom.showCards(cards)
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
        const currentBoard = document.querySelector(`[data-board-id='${data.boardId}']`);
        let currentColumn = currentBoard.querySelector(`[data-status-title='new']`).querySelector(".board-column-content");
        const cardTemplate = document.querySelector('#card-template');
        const cardClone = document.importNode(cardTemplate.content, true);
        cardClone.querySelector('.card').dataset.cardStatusTitle = `new`;
        cardClone.querySelector('.card-title').textContent = data.cardTitle;
        currentColumn.appendChild(cardClone);
    }
    ,
    openNewBoardForm: function () {
        const boardForm = document.querySelector("#add-data-template");
        let boardFormClone = document.importNode(boardForm.content, true);
        const saveBtn = boardFormClone.querySelector(".save-btn");
        saveBtn.setAttribute("id", "save-board-btn");
        const cancelBtn = boardFormClone.querySelector(".cancel-btn");
        cancelBtn.setAttribute("id", "cancel-board-form-btn");
        saveBtn.addEventListener('click', dom.saveNewBoard);
        cancelBtn.addEventListener('click', dom.closeNewBoardForm);
        const boardSpan = boardFormClone.querySelector(".add-input");
        boardSpan.setAttribute("id", "board-input-form");
        let boardTitle = boardFormClone.querySelector(".input-data");
        boardTitle.setAttribute("id", "board-title");

        document.querySelector("#add-board-container").appendChild(boardFormClone);
    }
    ,
    closeNewBoardForm: function () {
        document.querySelector("#board-input-form").remove();
    }
    ,
    saveNewBoard: function () {
        let title = document.querySelector("#board-title").value;
        dataHandler.createNewBoard(title, dom.appendNewBoard);
        dom.closeNewBoardForm();
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
    }

    ,
    openNewCardForm: function (event) {
        const inputTemplate = document.querySelector('#add-data-template');
        const inputClone = document.importNode(inputTemplate.content, true);
        this.parentNode.appendChild(inputClone);

        let saveBtn = this.parentNode.querySelector('.save-btn');
        saveBtn.addEventListener('click', function () {
            if (this.parentNode.querySelector('.input-data').value === "") {
                this.parentNode.querySelector('.input-data').remove();
            } else {
                let cardTitle = this.parentNode.querySelector('.input-data').value;
                let boardId = this.parentNode.parentNode.parentNode.dataset.boardId;

                dataHandler.createNewCard(cardTitle, boardId, 0, function (data) {
                    dom.showNewCard(data);

                });
            }
            this.parentNode.remove();
            button.disabled = false;
        });

        let cancelBtn = this.parentNode.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function () {
            this.parentNode.remove();
            button.disabled = false;
        });
    }
    // here comes more features
};

