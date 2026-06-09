
 CREATE TABLE users (
  id INT IDENTITY PRIMARY KEY,
  code NVARCHAR(50) UNIQUE NOT NULL,
  username NVARCHAR(50) UNIQUE NOT NULL,
  email NVARCHAR(100) UNIQUE NOT NULL,
  password NVARCHAR(255) NOT NULL,
  first_name NVARCHAR(50),
  last_name NVARCHAR(50),
  birthday DATE NULL,
  gender NVARCHAR(10),
  phone_number NVARCHAR(20),
  employment_date DATE NULL,
  quit_job_date DATE NULL,
  user_type NVARCHAR(20) NOT NULL,
  status_id INT DEFAULT 1,
  is_assign_course BIT DEFAULT 0,
  is_assign_training BIT DEFAULT 0,
  sync_id NVARCHAR(100),
  title_custom_codes NVARCHAR(MAX),
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  deleted_at DATETIME2 NULL
);

CREATE TABLE groups (
  id INT IDENTITY PRIMARY KEY,
  code NVARCHAR(50) UNIQUE NOT NULL,
  name NVARCHAR(100) NOT NULL,
  description NVARCHAR(MAX),
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  deleted_at DATETIME2 NULL
);

CREATE TABLE user_groups (
  id INT IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  group_id INT NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),
  CONSTRAINT fk_ug_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_ug_group FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE INDEX idx_ug_user ON user_groups(user_id);
CREATE INDEX idx_ug_group ON user_groups(group_id);


CREATE TABLE organization_structures (
  id INT IDENTITY PRIMARY KEY,
  name NVARCHAR(255) NOT NULL,
  parent_id INT NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),

  CONSTRAINT fk_org_parent
    FOREIGN KEY (parent_id) REFERENCES organization_structures(id)
);


CREATE TABLE titles (
  id INT IDENTITY PRIMARY KEY,
  code NVARCHAR(50) NOT NULL,
  name NVARCHAR(255) NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE()
);



CREATE TABLE user_organizations (
  id INT IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  organization_id INT NOT NULL,
  title_id INT NOT NULL,
  is_owner BIT DEFAULT 0,
  is_primary BIT DEFAULT 0,
  start_date DATE NULL,
  end_date DATE NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),

  CONSTRAINT fk_uo_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_uo_org FOREIGN KEY (organization_id) REFERENCES organization_structures(id),
  CONSTRAINT fk_uo_title FOREIGN KEY (title_id) REFERENCES titles(id)
);


CREATE TABLE courses (
  id INT IDENTITY PRIMARY KEY,
  code NVARCHAR(50) UNIQUE NOT NULL,
  name NVARCHAR(255) NOT NULL,
  topic_name NVARCHAR(255),
  cost FLOAT,
  time INT,
  link NVARCHAR(500),
  total_user_complete INT DEFAULT 0,
  owner_id INT NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),

  CONSTRAINT fk_course_owner FOREIGN KEY (owner_id) REFERENCES users(id)
);



---------------------------------------------------------------

CREATE TABLE trainings (
  id INT IDENTITY PRIMARY KEY,
  course_id INT NOT NULL,
  trainer_id INT NOT NULL,
  start_date DATETIME2 NOT NULL,
  end_date DATETIME2 NOT NULL,
  created_at DATETIME2 DEFAULT GETDATE(),
  updated_at DATETIME2 DEFAULT GETDATE(),

  CONSTRAINT fk_training_course FOREIGN KEY (course_id) REFERENCES courses(id),
  CONSTRAINT fk_training_trainer FOREIGN KEY (trainer_id) REFERENCES users(id)
);

 INSERT INTO users (code, username, email, password, user_type)
 VALUES ('U001', 'admin', 'admin@lms.com', 'hashed_password', 'ADMIN');

 INSERT INTO groups (code, name)
 VALUES ('ADMIN', 'Administrator');

 INSERT INTO user_groups (user_id, group_id)
 VALUES (1, 1);

