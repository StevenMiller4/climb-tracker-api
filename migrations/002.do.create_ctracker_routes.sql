CREATE TABLE ctracker_routes (
    id INTEGER PRIMARY KEY GENERATED DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT now() NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    location TEXT,
    difficulty TEXT NOT NULL,
    status TEXT NOT NULL,
    user_id INTEGER
        REFERENCES ctracker_users(id) ON DELETE CASCADE NOT NULL
);