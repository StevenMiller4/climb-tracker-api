CREATE TABLE ctracker_users (
    id INTEGER PRIMARY KEY GENERATED DEFAULT AS IDENTITY,
    username varchar(12) NOT NULL,
    password varchar(50) NOT NULL
);