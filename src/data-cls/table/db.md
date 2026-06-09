const { MAX } = require("mssql");

CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    email VARCHAR(255) NULL,
    first_name NVARCHAR(100) NOT NULL,
    last_name NVARCHAR(100) NOT NULL,
    user_code VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    gender BOOLEAN NULL,
    phone_number VARCHAR(20) NULL,
    user_type NVARCHAR(100) NULL,
    title_custom NVARCHAR(255) NULL,
    status_id INT NOT NULL,
    created_date DATETIME2 NULL,
    modified_date DATETIME2 NULL,
    created_at  DATETIME2 NULL,
    updated_at  DATETIME2 NULL,
    deleted_at  DATETIME2 NULL,

    CONSTRAINT uq_users_user_code UNIQUE (user_code),
    CONSTRAINT uq_users_user_name UNIQUE (user_name),
    CONSTRAINT uq_users_email UNIQUE (email)
);


CREATE TABLE organizations (
    org_id BIGINT PRIMARY KEY,
    org_name NVARCHAR(255),
    parent_id BIGINT NULL,
    parent_name NVARCHAR(255) NULL
    created_at  DATETIME2 NULL,
    updated_at  DATETIME2 NULL
);

CREATE TABLE groups (
    group_id BIGINT PRIMARY KEY,
    group_name NVARCHAR(255),
    description NVARCHAR(MAX),
    created_at  DATETIME2 NULL,
    updated_at  DATETIME2 NULL,
    deleted_at  DATETIME2 NULL
);

CREATE TABLE user_organizations (
    user_id BIGINT NOT NULL,
    org_id BIGINT NOT NULL,
    PRIMARY KEY(user_id, org_id)
);

CREATE TABLE user_groups (
    user_id BIGINT NOT NULL,
    group_id BIGINT NOT NULL,
    PRIMARY KEY(user_id, group_id),
    created_at  DATETIME2 NULL,
    updated_at  DATETIME2 NULL,
);


CREATE TABLE courses (
    id BIGINT PRIMARY KEY,
    name NVARCHAR(500) NOT NULL,
    code VARCHAR(100) NULL,
    topic_id BIGINT NOT NULL,
    owner_id BIGINT NULL,
    cost DECIMAL(18,2) NULL,
    start_date DATETIME2 NULL,
    end_date DATETIME2 NULL,
    duration_seconds DECIMAL(18,2) DEFAULT 0,
    course_link NVARCHAR(1000) NULL,
    created_by BIGINT NULL,
    created_by_code VARCHAR(50) NULL,
    created_date DATETIME2 NULL,
    modified_date DATETIME2 NULL,

    CONSTRAINT fk_course_topic
        FOREIGN KEY (topic_id)
        REFERENCES course_topics(id)
);


CREATE TABLE course_topics (
    id BIGINT PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    parent_id BIGINT NULL,
    icon NVARCHAR(1000) NULL,
    description NVARCHAR(MAX) NULL,
    created_date DATETIME2 DEFAULT GETDATE(),

    CONSTRAINT fk_course_category_parent
        FOREIGN KEY (parent_id)
        REFERENCES course_topics(id)
);


--------------------------------------------------

CREATE TABLE course_statistics (
    course_id BIGINT PRIMARY KEY,
    total_user_complete INT DEFAULT 0,
    last_sync_date DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT fk_course_stat_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
);

CREATE TABLE course_users (
    course_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    enrolled_date DATETIME2 NULL,
    PRIMARY KEY(course_id, user_id),
    CONSTRAINT fk_course_users_course
        FOREIGN KEY(course_id)
        REFERENCES courses(id),

    CONSTRAINT fk_course_users_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
);


CREATE TABLE course_users (
    course_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    enrolled_date DATETIME2 NULL,
    PRIMARY KEY(course_id, user_id),
    CONSTRAINT fk_course_users_course
        FOREIGN KEY(course_id)
        REFERENCES courses(id),

    CONSTRAINT fk_course_users_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
);