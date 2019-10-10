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
            let boardContent = boardClone.querySelectorAll('.board-column-content');
            let boardContentArray = Array.from(boardContent);
            dragula(boardContentArray).on('drop', function (el, target) {
                dom.handleDrop(el, target);
            });
            boardsContainer.appendChild(boardClone);
            this.loadCards(board.id);
        }
        this.addCardData();
        document.querySelector('#board-loading').remove();

        let boardTitles = document.querySelectorAll('.board-title');
        for (let title of boardTitles) {
            title.addEventListener('click', dom.openRenameBoardForm);
        }
    }
    ,
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(boardId, function (cards) {
            if (cards.length != 0) {
                dom.showCards(cards)
            }
        });
    }
    ,
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
        for (let card of cards) {
            dom.showCard(card, card.status_id)
        }
        dom.renameCard();
    },

    addCardData: function () {
        let addCardBtns = document.querySelectorAll('.add-card');
        for (let button of addCardBtns) {
            button.addEventListener('click', dom.openNewCardForm);
        }
    },

    showNewCard: function (cardData) {
        dom.showCard(cardData);
        dom.renameCard();
    },

    showCard: function (cardData, statusTitle = 'new') {
        const currentBoard = document.querySelector(`[data-board-id='${cardData.board_id}']`);
        let currentColumn = currentBoard.querySelector(`[data-status-title="${statusTitle}"]`)
            .querySelector(".board-column-content");
        const cardTemplate = document.querySelector('#card-template');
        const cardClone = document.importNode(cardTemplate.content, true);
        cardClone.querySelector('.card').dataset.cardStatusTitle = `new`;
        cardClone.querySelector('.card').dataset.cardId = `${cardData.id}`;
        cardClone.querySelector('.card-title').textContent = cardData.title;
        dom.createCardDeletion(cardClone);
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
        boardClone.querySelector('.board-title').addEventListener('click', dom.openRenameBoardForm);
        boardClone.querySelector('.add-card').addEventListener('click', dom.openNewCardForm);
        boardClone.querySelector('.board-toggle').addEventListener('click', dom.toggleBoardContent);
        let boardContent = boardClone.querySelectorAll('.board-column-content');
        let boardContentArray = Array.from(boardContent);
        dragula(boardContentArray).on('drop', function (el, target) {
            dom.handleDrop(el, target);
        });
        boardContainer.appendChild(boardClone);
    }
    ,
    openNewCardForm: function () {
        dom.changeAddButtonToDisable(this);
        this.closest('.board-header').querySelector('.board-title').removeEventListener('click', dom.openRenameBoardForm);
        const inputTemplate = document.querySelector('#add-data-template');
        const inputClone = document.importNode(inputTemplate.content, true);
        inputClone.querySelector(".input-data").placeholder = "Enter card name...";
        this.closest('.board-header').insertBefore(inputClone, this.closest('.board-header').querySelector(".board-toggle"));

        let saveBtn = this.parentNode.querySelector('.save-btn');
        saveBtn.addEventListener('click', function () {
            if (this.parentNode.querySelector('.input-data').value !== "") {
                this.closest('.board-header').querySelector('.board-title').addEventListener('click', dom.openRenameBoardForm);
                let cardTitle = this.parentNode.querySelector('.input-data').value;
                let boardId = this.closest('section.board').dataset.boardId;
                dataHandler.createNewCard(cardTitle, boardId, 0, function (data) {
                    dom.showNewCard(data);
                });
            }
            const addButton = this.closest('.board-header').querySelector('.add-card');
            dom.changeAddButtonToActive(addButton);
            this.parentNode.querySelector('.input-data').remove();
            this.parentNode.remove();
        });

        let cancelBtn = this.parentNode.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', function () {
            this.closest('.board-header').querySelector('.board-title').addEventListener('click', dom.openRenameBoardForm);
            const addButton = this.closest('.board-header').querySelector('.add-card');
            dom.changeAddButtonToActive(addButton);
            this.parentNode.remove();
        });
    },

    changeAddButtonToActive: function (addButton) {
        addButton.disabled = false;
        addButton.style.color = 'white';
    },

    changeAddButtonToDisable: function (addButton) {
        addButton.disabled = true;
        addButton.style.color = 'gray';
    },

    createCardDeletion: function (card) {
        card.querySelector('.fas').addEventListener('click', dom.startCardDeletion);
    },

    startCardDeletion: function () {
        const cardId = this.closest(".card").dataset.cardId;
        dataHandler.deleteCard(cardId, function (data) {
            dom.deleteCard(data)
        })
    },

    deleteCard: function (data) {
        const card = document.querySelector(`[data-card-id='${data.id}']`);
        let cardContainer = card.parentElement;
        card.remove();
        if (cardContainer.childElementCount === 0) {
            cardContainer.textContent = '';
        }
    }

    ,
    toggleBoardContent: function () {
        let boardContent = this.closest('.board-header').nextElementSibling;
        if (boardContent.classList.contains('hidden-board')) {
            boardContent.classList.remove('hidden-board');
            boardContent.classList.add('board-columns');
            this.querySelector('i').classList.remove('fa-chevron-down');
            this.querySelector('i').classList.add('fa-chevron-up');
        } else {
            boardContent.classList.remove('board-columns');
            boardContent.classList.add('hidden-board');
            this.querySelector('i').classList.remove('fa-chevron-up');
            this.querySelector('i').classList.add('fa-chevron-down');
        }

    }

    ,
    handleDrop: function (el, target) {
        dataHandler.modifyCardStatus(el.dataset.cardId, target.previousElementSibling.innerHTML, function (data) {
                let statusName = "";
                switch (data.status_id) {
                    case 0:
                        statusName = "New";
                        break;
                    case 1:
                        statusName = "In Progress";
                        break;
                    case 2:
                        statusName = "Testing";
                        break;
                    case 3:
                        statusName = "Done";
                        break;
                    default:
                        statusName = "Invalid status";
                }
            }
        )
    }
    ,
    openRenameBoardForm: function () {
        const renameForm = document.querySelector("#add-data-template");
        let renameFormClone = document.importNode(renameForm.content, true);
        let firstChild = this.closest('.board-header');
        let oldTitle = firstChild.childNodes[0];

        renameFormClone.querySelector(".input-data").placeholder = "Enter new board name...";

        const otherAddButton = this.closest('.board-header').querySelector('.add-card');
        dom.changeAddButtonToDisable(otherAddButton);

        const saveBtn = renameFormClone.querySelector(".save-btn");
        saveBtn.addEventListener('click', function () {
            dom.saveNewTitle(oldTitle, this);
            const addButton = this.closest('.board-header').querySelector('.add-card');
            dom.changeAddButtonToActive(addButton);
        });

        const cancelBtn = renameFormClone.querySelector(".cancel-btn");
        cancelBtn.addEventListener('click', function () {
            const addButton = this.closest('.board-header').querySelector('.add-card');
            dom.changeAddButtonToActive(addButton);
            dom.closeNewTitleForm(oldTitle, this);
        });

        firstChild.replaceChild(renameFormClone, oldTitle);
    }
    ,
    saveNewTitle: function (oldTitle, saveButton) {
        let title = saveButton.previousElementSibling.value;
        let boardId = saveButton.closest('.board').dataset.boardId;
        if (title !== "") {
        } else {
            title = oldTitle.innerHTML;
        }
        dataHandler.renameBoard(boardId, title, dom.showNewTitle);
    }
    ,
    showNewTitle: function (newTitle) {
        let currentBoard = document.querySelector(`[data-board-id='${newTitle.id}']`);
        let boardHeader = currentBoard.querySelector('.board-header');
        let titleSpan = document.createElement('span');
        titleSpan.setAttribute('class', 'board-title');
        titleSpan.innerHTML = newTitle.title;

        currentBoard.querySelector('.add-input').remove();
        boardHeader.insertBefore(titleSpan, boardHeader.firstChild);

        titleSpan.addEventListener('click', dom.openRenameBoardForm);
    }
    ,
    closeNewTitleForm: function (oldTitle, cancelButton) {
        let boardHeader = cancelButton.closest('.board-header');
        cancelButton.closest('.add-input').remove();
        let titleSpan = document.createElement('span');
        titleSpan.setAttribute('class', 'board-title');
        titleSpan.innerHTML = oldTitle.innerHTML;
        boardHeader.insertBefore(titleSpan, boardHeader.firstChild);
        titleSpan.addEventListener('click', dom.openRenameBoardForm);
    }
    ,
    renameCard: function () {
        let cardTitles = document.querySelectorAll('.card-title');

        for (let title of cardTitles) {
            let originalTitle = title.innerHTML;
            title.addEventListener('keydown', function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                    let newTitle = this.innerHTML;
                    this.setAttribute('contenteditable', 'false');
                    let cardId = this.parentNode.dataset.cardId;
                    this.innerHTML = newTitle;
                    dataHandler.renameCard(cardId, newTitle, function () {
                        originalTitle = newTitle;
                    })
                } else if (e.keyCode === 27) {
                    this.innerHTML = originalTitle;
                    this.setAttribute('contenteditable', 'false');
                }
                this.setAttribute('contenteditable', 'true');
            });
            title.addEventListener('blur', function () {
                this.innerHTML = originalTitle;
            });

        }
    }
};
