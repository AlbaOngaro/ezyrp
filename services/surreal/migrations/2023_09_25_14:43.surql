DEFINE TABLE email SCHEMALESS PERMISSIONS FOR select, update, delete WHERE workspace = $auth.workspace, FOR create WHERE true;

REMOVE FIELD email ON email;
REMOVE FIELD name ON email;
REMOVE FIELD status ON email;