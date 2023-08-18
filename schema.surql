-- ------------------------------
-- OPTION
-- ------------------------------

OPTION IMPORT;

-- ------------------------------
-- SCOPES
-- ------------------------------

DEFINE SCOPE allusers 
SESSION 2w 
SIGNUP (
		CREATE user 
		SET 
			email = $email,
			username = IF $username THEN $username ELSE string::concat('@', string::split($email, '@')[0]) END,
			password = crypto::argon2::generate($password)
)
SIGNIN (
	SELECT * FROM user 
	WHERE 
		email = $email AND crypto::argon2::compare(password, $password)
);

-- ------------------------------
-- TABLE: user
-- ------------------------------

DEFINE TABLE user SCHEMAFULL PERMISSIONS FOR select, update WHERE id = $auth.id, FOR create, delete NONE;

DEFINE FIELD password ON user TYPE string;
DEFINE FIELD email ON user TYPE string;
DEFINE FIELD username ON user TYPE string;

DEFINE INDEX idx_user ON user FIELDS email UNIQUE;