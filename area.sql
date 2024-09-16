CREATE DATABASE IF NOT EXISTS area;
USE area;

CREATE TABLE `users`
(
    id        int(11)      NOT NULL AUTO_INCREMENT,
    email     varchar(255) NOT NULL UNIQUE,
    password  varchar(255) NOT NULL UNIQUE,
    username  varchar(255) NOT NULL,
    create_at datetime     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)CHARSET=utf8;

CREATE TABLE `actions_api`
(
    id          int(11)                                             NOT NULL AUTO_INCREMENT,
    name        varchar(255)                                        NOT NULL UNIQUE,
    PRIMARY KEY (id)
)CHARSET=utf8;

CREATE TABLE `actions`
(
    id          int(11)                                             NOT NULL AUTO_INCREMENT,
    title       varchar(255)                                        NOT NULL,
    description varchar(255)                                        NOT NULL,
    api_name    varchar(255)                                        NOT NULL,
    ask_url     varchar(255)                                        NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (api_name) REFERENCES actions_api (name)
)CHARSET=utf8;

CREATE TABLE `reactions_api`
(
    id          int(11)                                             NOT NULL AUTO_INCREMENT,
    name        varchar(255)                                        NOT NULL UNIQUE,
    PRIMARY KEY (id)
)CHARSET=utf8;

CREATE TABLE `reactions`
(
    id          int(11)                                             NOT NULL AUTO_INCREMENT,
    title       varchar(255)                                        NOT NULL,
    description varchar(255)                                        NOT NULL,
    api_name    varchar(255)                                        NOT NULL,
    ask_url     varchar(255)                                        NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (api_name) REFERENCES reactions_api (name)
)CHARSET=utf8;

create table `users_configs`
(
    id              int(11) NOT NULL AUTO_INCREMENT,
    email           varchar(255) NOT NULL,
    actions_id      int(11) NOT NULL,
    method          ENUM ('GET', 'POST', 'PUT', 'DELETE') DEFAULT NULL,
    headers         json DEFAULT NULL,
    body            json DEFAULT NULL,
    reaction_id     int(11) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (actions_id) REFERENCES actions (id),
    FOREIGN KEY (email) REFERENCES users (email),
    FOREIGN KEY (reaction_id) REFERENCES reactions (id)
)CHARSET=utf8;