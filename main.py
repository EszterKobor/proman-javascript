from flask import Flask, render_template, url_for, request
from util import json_response

import data_handler

app = Flask(__name__)


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/get-boards", methods=['GET', 'POST'])
@json_response
def get_boards():
    if request.method == 'POST':
        print('MEGJÖTTEM JSBŐL POSTKÉNT')
        return
    print('GET VOK')
    """
    All the boards
    """
    return data_handler.get_boards()


# !!!! "/cards/<int:board_id>"
@app.route("/get-cards/<int:board_id>")
@json_response
def get_cards_for_board(board_id: int):
    return data_handler.get_cards_for_board(board_id)


@app.route("/create-new-board/<title>")
@json_response
def create_new_board(title):
    return data_handler.create_new_board(title)


@app.route("/create-new-card/<cardTitle>/<boardId>/<statusId>", methods=["GET","POST"])  # to do: add parameters
@json_response
def create_new_card(cardTitle, boardId, statusId):
    if request.method == "POST":
        return data_handler.create_new_card(cardTitle, boardId, statusId)


def main():
    app.run(debug=True, port=5002)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
