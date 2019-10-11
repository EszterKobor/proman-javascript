ALTER TABLE IF EXISTS ONLY public.boards DROP CONSTRAINT IF EXISTS pk_boards_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS pk_cards_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.statuses DROP CONSTRAINT IF EXISTS pk_statuses_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_board_id CASCADE;
ALTER TABLE IF EXISTS ONLY public.cards DROP CONSTRAINT IF EXISTS fk_status_id CASCADE;


DROP TABLE IF EXISTS public.boards;
DROP SEQUENCE IF EXISTS public.boards_id_seq;
CREATE TABLE boards (
    id serial NOT NULL,
    title text
);


DROP TABLE IF EXISTS public.statuses;
DROP SEQUENCE IF EXISTS public.statuses_id_seq;
CREATE TABLE statuses (
    id serial NOT NULL,
    title text,
    board_id integer
);


DROP TABLE IF EXISTS public.cards;
DROP SEQUENCE IF EXISTS public.cards_id_seq;
CREATE TABLE cards (
    id serial NOT NULL,
    board_id integer,
    title text,
    status_id integer,
    order_card integer
);


ALTER TABLE ONLY boards
    ADD CONSTRAINT pk_boards_id PRIMARY KEY (id);


ALTER TABLE ONLY cards
    ADD CONSTRAINT pk_cards_id PRIMARY KEY (id);


ALTER TABLE ONLY statuses
    ADD CONSTRAINT pk_statuses_id PRIMARY KEY (id),
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE;


ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_board_id FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE ;


ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_status_id FOREIGN KEY (status_id) REFERENCES statuses(id) ON DELETE CASCADE;


INSERT INTO boards VALUES (1, 'Board 1');
INSERT INTO boards VALUES (2, 'Board 2');
SELECT pg_catalog.setval('boards_id_seq', 2, true);


INSERT INTO statuses VALUES (0, 'new', 1);
INSERT INTO statuses VALUES (1, 'in progress', 1);
INSERT INTO statuses VALUES (2, 'testing', 1);
INSERT INTO statuses VALUES (3, 'done', 1);
INSERT INTO statuses VALUES (4, 'new', 2);
INSERT INTO statuses VALUES (5, 'in progress', 2);
INSERT INTO statuses VALUES (6, 'testing', 2);
INSERT INTO statuses VALUES (7, 'done', 2);
SELECT pg_catalog.setval('statuses_id_seq', 7, true);


INSERT INTO cards VALUES (1, 1, 'new progress', 0, 0);
INSERT INTO cards VALUES (2, 1, 'my new 2', 0, 1);
INSERT INTO cards VALUES (3, 1, 'my in progress card', 1, 0);
INSERT INTO cards VALUES (4, 1, 'testing webpage', 2, 0);
INSERT INTO cards VALUES (5, 1, 'done something 1', 3, 0);
INSERT INTO cards VALUES (6, 1, 'done my stuff 1', 3, 1);
INSERT INTO cards VALUES (7, 2, 'new card 1', 4, 0);
INSERT INTO cards VALUES (8, 2, 'new card 2', 4, 1);
INSERT INTO cards VALUES (9, 2, 'in progress card', 5, 0);
INSERT INTO cards VALUES (10, 2, 'testing something', 6, 0);
INSERT INTO cards VALUES (11, 2, 'done little card 1', 7, 0);
INSERT INTO cards VALUES (12, 2, 'done card 1', 7, 1);
SELECT pg_catalog.setval('cards_id_seq', 12, true);

