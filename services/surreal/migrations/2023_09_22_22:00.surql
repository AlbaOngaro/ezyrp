DEFINE TABLE email SCHEMAFULL PERMISSIONS FOR select, update, delete WHERE workspace = type::string($auth.workspace), FOR create WHERE true;

DEFINE FIELD email ON email TYPE string;
DEFINE FIELD name ON email TYPE string;
DEFINE FIELD status ON email TYPE string;
