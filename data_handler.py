import database_common


@database_common.connection_handler
def get_boards(cursor):
    cursor.execute("""
                    SELECT boards.*, json_object_agg(statuses.id, statuses.title) AS statuses
                    FROM boards
                    JOIN statuses on boards.id = statuses.board_id
                    GROUP BY boards.id
                    ORDER BY boards.id;
                    """)
    boards = cursor.fetchall()
    return boards


@database_common.connection_handler
def get_cards_for_board(cursor, board_id):
    cursor.execute("""
                    SELECT 
                        cards.id AS card_id,
                        cards.board_id, 
                        cards.title AS card_title,
                        statuses.id AS status_id,
                        statuses.title AS status_title 
                    FROM cards 
                    JOIN statuses on cards.status_id = statuses.id
                    WHERE cards.board_id = %(board_id)s;
                    """,
                   {'board_id': board_id})
    all_cards = cursor.fetchall()
    return all_cards


@database_common.connection_handler
def create_new_board(cursor, title):
    cursor.execute("""
                    INSERT INTO boards (title)
                    VALUES (%(title)s)
                    RETURNING id;
                    """,
                   {'title': title})
    result = cursor.fetchone()
    return result


@database_common.connection_handler
def create_new_card(cursor, title, board_id, status_id):
    cursor.execute("""
                    INSERT INTO cards (board_id, title, status_id)
                    VALUES (%(board_id)s, %(title)s, %(status_id)s)
                    RETURNING id AS card_id, board_id, title AS card_title, status_id;
                    """,
                   {'board_id': board_id, 'title': title, 'status_id': status_id})
    result = cursor.fetchone()
    return result


@database_common.connection_handler
def drag_and_drop_card(cursor, card_id, new_status_id):
    cursor.execute("""
                    UPDATE cards SET status_id =  %(new_status_id)s
                    WHERE id = %(card_id)s
                    RETURNING id, status_id;""",
                   {'card_id': card_id, 'new_status_id': new_status_id})
    result = cursor.fetchone()
    print(result)
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


@database_common.connection_handler
def add_statuses_to_table(cursor, table_id):
    cursor.execute("""
    INSERT INTO statuses (title, board_id) VALUES ('new', %(table_id)s);
    INSERT INTO statuses (title, board_id) VALUES ('in progress', %(table_id)s);
    INSERT INTO statuses (title, board_id) VALUES ('testing', %(table_id)s);
    INSERT INTO statuses (title, board_id) VALUES ('done', %(table_id)s);
    """, {'table_id': table_id})


@database_common.connection_handler
def get_board(cursor, table_id):
    cursor.execute("""
                    SELECT boards.*, json_object_agg(statuses.id, statuses.title) AS statuses
                    FROM boards
                    JOIN statuses on boards.id = statuses.board_id
                    WHERE boards.id = %(table_id)s
                    GROUP BY boards.id
                    ORDER BY boards.id;
                    """, {"table_id": table_id})
    board = cursor.fetchone()
    return board


@database_common.connection_handler
def rename_card(cursor, id, title):
    cursor.execute("""
                    UPDATE cards
                    SET title = %(title)s
                    WHERE cards.id = %(id)s
                    RETURNING id, title;
                    """,
                   {'id': id, 'title': title})
    result = cursor.fetchone()
    return result


@database_common.connection_handler
def rename_column(cursor, id, title):
    cursor.execute("""
                    UPDATE statuses
                    SET title = %(title)s
                    WHERE statuses.id = %(id)s
                    RETURNING id, title;
                    """,
                   {'id': id, 'title': title})
    result = cursor.fetchone()
    return result
