DROP DATABASE IF EXISTS lexi_leap;
CREATE DATABASE IF NOT EXISTS lexi_leap;
USE lexi_leap;

CREATE TABLE IF NOT EXISTS word (
    id INT PRIMARY KEY AUTO_INCREMENT,
    spell VARCHAR(100) NOT NULL UNIQUE,
    definition_cn VARCHAR(64) NOT NULL,
    definition_en VARCHAR(64) NOT NULL,
    example_sentence VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS tag (
    id INT PRIMARY KEY AUTO_INCREMENT,
    NAME VARCHAR(32) NOT NULL UNIQUE,
    description VARCHAR(256) NOT NULL,
    color CHAR(7) NOT NULL DEFAULT '#FFFFFF',
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS affix (
    id INT PRIMARY KEY AUTO_INCREMENT,
    NAME VARCHAR(32) NOT NULL UNIQUE,
    description VARCHAR(256) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS word_tags (
    word_id INT,
    tag_id INT,
    
    PRIMARY KEY (word_id, tag_id),
    FOREIGN KEY (word_id) REFERENCES word(id),
    FOREIGN KEY (tag_id) REFERENCES tag(id)
);

CREATE TABLE IF NOT EXISTS word_affixes (
    word_id INT,
    affix_id INT,
    
    PRIMARY KEY (word_id, affix_id),
    FOREIGN KEY (word_id) REFERENCES word(id),
    FOREIGN KEY (affix_id) REFERENCES affix(id)
);

CREATE TABLE IF NOT EXISTS user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username ARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VVARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE word_sets (
    user_id INT UNSIGNED NOT NULL,
    id TINYINT UNSIGNED NOT NULL,
    name VARCHAR(100) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE

    PRIMARY KEY (user_id, id),
    CONSTRAINT max_sets_per_user CHECK (id <= 16)  -- 限制每个用户最多16个练习集
);