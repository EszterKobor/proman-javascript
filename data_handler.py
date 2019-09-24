import database_common


@database_common.connection_handler
def get_card_status(cursor, status_id):
    cursor.execute("""
                    SELECT title 
                    FROM statuses
                    WHERE id = $(status_id)s;
                    """,
                   {'status_id': status_id})
    card_status = cursor.fetchone()
    return card_status


@database_common.connection_handler
def get_boards(cursor):
    cursor.execute("""
                    SELECT * FROM boards;
                    """)
    boards = cursor.fetchall()
    return boards


@database_common.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""
                    SELECT * FROM cards
                    WHERE board_id = $(board_id)s;
                    """,
                   {'board_id': board_id})
    cards_for_board = cursor.fetchall()
    return cards_for_board
