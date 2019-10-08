import database_common


@database_common.connection_handler
def get_card_status(cursor, status_id):
    cursor.execute("""
                    SELECT title 
                    FROM statuses
                    WHERE id = %(status_id)s;
                    """,
                   {'status_id': status_id})
    card_status = cursor.fetchone()
    return card_status['title']


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
                    WHERE board_id = %(board_id)s;
                    """,
                   {'board_id': board_id})
    all_cards = cursor.fetchall()
    matching_cards = []
    for card in all_cards:
        card['status_id'] = get_card_status(card['status_id'])  # Set textual status for the card
        matching_cards.append(card)
    return matching_cards


@database_common.connection_handler
def create_new_board(cursor, title):
    cursor.execute("""
                    INSERT INTO boards (title)
                    VALUES (%(title)s)
                    RETURNING id, title;
                    """,
                   {'title': title})
    result = cursor.fetchone()
    return result


@database_common.connection_handler
def create_new_card(cursor, title, board_id, status_id):
    cursor.execute("""
                    INSERT INTO cards (board_id, title, status_id)
                    VALUES (%(board_id)s, %(title)s, %(status_id)s)
                    RETURNING id, board_id, title, status_id;
                    """,
                   {'board_id': board_id, 'title': title, 'status_id': status_id})
    result = cursor.fetchone()
    return result


@database_common.connection_handler
def delete_card(cursor, card_id):
    cursor.execute("""
    DELETE FROM cards
    WHERE id = %(card_id)s
    RETURNING id;
    """, {'card_id': card_id})
    result = cursor.fetchone()
    return result


@database_common.connection_handler
def rename_board(cursor, id, title):
    cursor.execute("""
                    UPDATE boards
                    SET title = %(title)s
                    WHERE boards.id = %(id)s
                    RETURNING id, title;
                    """,
                   {'id': id, 'title': title})
    result = cursor.fetchone()
    return result
