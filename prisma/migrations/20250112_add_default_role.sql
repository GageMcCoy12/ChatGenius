-- Insert default role
INSERT INTO "Role" ("id", "name")
VALUES ('1', 'user')
ON CONFLICT ("id") DO NOTHING; 