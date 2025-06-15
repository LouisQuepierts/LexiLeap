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
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    avatar  VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS user_tokens (
    user_id INT PRIMARY KEY,
    token VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at TIMESTAMP,
    version INT DEFAULT 1,
    UNIQUE KEY (token),
    FOREIGN KEY (user_id) REFERENCES user(id)
)

CREATE TABLE IF NOT EXISTS word_set (
    id INT PRIMARY KEY AUTO_INCREMENT,  -- 自增主键，不再作为词集编号  
    user_id INT NOT NULL,  
    name VARCHAR(100) NOT NULL,  
    file_path VARCHAR(255) NOT NULL,  
    set_order TINYINT NOT NULL,  -- 词集顺序编号（1-16）  
    is_shared BOOLEAN DEFAULT FALSE,  
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,  
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP,  
    deleted BOOLEAN DEFAULT FALSE,  
    FOREIGN KEY (user_id) REFERENCES user(id),  
    UNIQUE KEY (user_id, set_order)  -- 确保每个用户的set_order唯一 
);