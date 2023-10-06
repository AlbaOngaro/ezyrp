DEFINE TABLE user SCHEMAFULL PERMISSIONS FOR update, delete WHERE id = $auth.id FOR select WHERE id = $auth.id OR workspace = $auth.workspace;

DEFINE TABLE profile SCHEMALESS PERMISSIONS FOR update WHERE user = $auth.id, FOR select WHERE user = $auth.id OR workspace = $auth.workspace FOR create, delete NONE;
